import { useState, useCallback, useEffect, useRef } from "react";
import { updateTransactions, createTransactions } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listTransactions } from "../amplify/auth/post-confirmation/graphql/queries"; 
import { encryptFields, decryptFields } from './utils/encryption';

const ENCRYPTED_FIELDS = ['amount'];

export const useTransactionOperations = ({ 
    transactions, 
    setAllTransactions, 
    setFilteredTransactions, 
    client, 
    setSelectedTransactionAccount, 
    selectedTransactionAccount, 
    handleViewTransactions, 
    accounts,
    transactionFilterOption,
    isDateFilterApplied,
    dateFrom,
    dateTo,
    futurePayments,
    holdings, 
    userId
}) => { 
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(false);
    const hasInitializedRef = useRef(false);
    const previousHoldingsRef = useRef(null);

    const generateAllTransactions = useCallback((regularTransactions = transactions) => {
        let allGeneratedTransactions = [];

        // 1. Generate starting balances with correct dates
        accounts?.forEach(account => {
            if (account.starting_balance) {
                // Find earliest transaction date for this account, including ALL dates even if they seem invalid
                const accountTransactions = [
                    ...(regularTransactions?.filter(t => t.account_id === account.id) || []),
                    ...(holdings?.filter(h => h.account_id === account.id).map(h => ({ 
                        xtn_date: h.purchase_date 
                    })) || []),
                    ...(holdings?.filter(h => h.account_id === account.id && h.maturity_date).map(h => ({ 
                        xtn_date: h.maturity_date 
                    })) || [])
                ].filter(t => t.xtn_date);

                let startDate = '1900-01-01';
                if (accountTransactions.length > 0) {
                    try {
                        // Don't filter dates - use all of them to find the earliest
                        const earliestDate = new Date(Math.min(...accountTransactions.map(t => new Date(t.xtn_date))));
                        earliestDate.setDate(earliestDate.getDate() - 1);
                        startDate = earliestDate.toISOString().split('T')[0];
                    } catch (err) {
                        console.error('Error calculating start date:', err);
                    }
                }

                allGeneratedTransactions.push({
                    id: `starting-${account.id}`,
                    account_id: account.id,
                    accountName: account.name,
                    type: 'Starting Balance',
                    xtn_date: startDate,
                    amount: parseFloat(account.starting_balance || 0),
                    isGenerated: true
                });
            }
        });

        // 2. Generate holding transactions
        if (holdings?.length > 0) {
            holdings.forEach(holding => {
                const accountName = accounts.find(acc => acc.id === holding.account_id)?.name || "Unknown Account";
                
                // Validate dates
                const purchaseDate = new Date(holding.purchase_date);
                const maturityDate = holding.maturity_date ? new Date(holding.maturity_date) : null;
                
                // Only add transactions with valid dates
                if (!isNaN(purchaseDate.getTime())) {
                    allGeneratedTransactions.push({
                        id: `holding-${holding.id}`,
                        account_id: holding.account_id,
                        accountName,
                        holdingName: holding.name || `${holding.amount_paid} @ ${holding.interest_rate}%`,
                        type: 'Holding Purchase',
                        xtn_date: holding.purchase_date,
                        amount: -parseFloat(holding.amount_paid || 0),
                        isGenerated: true
                    });
                }

                if (maturityDate && !isNaN(maturityDate.getTime())) {
                    allGeneratedTransactions.push({
                        id: `maturity-${holding.id}`,
                        account_id: holding.account_id,
                        accountName,
                        holdingName: holding.name || `${holding.amount_paid} @ ${holding.interest_rate}%`,
                        type: 'Holding Maturity',
                        xtn_date: holding.maturity_date,
                        amount: parseFloat(holding.amount_at_maturity || 0),
                        isGenerated: true
                    });
                }
            });
        }

        // 3. Generate future minimum withdrawals
        accounts?.forEach(account => {
            if (account.min_withdrawal_date && account.type === 'RRIF') {  // Only for RRIF accounts
                const today = new Date();
                const currentYear = today.getFullYear();
                
                // Calculate account holder's age at start of each year
                const birthDate = new Date(account.birthdate);
                
                // Get month/day for withdrawal
                const dbDate = new Date(account.min_withdrawal_date);
                const month = dbDate.getMonth();
                const day = dbDate.getDate();
                
                // Calculate first withdrawal date for this year
                let withdrawalDate = new Date(currentYear, month, day);
                
                // If this year's date has passed, start from next year
                if (withdrawalDate < today) {
                    withdrawalDate = new Date(currentYear + 1, month, day);
                }

                // Generate transactions for the specified number of future years
                for (let i = 0; i < futurePayments; i++) {
                    const yearOffset = i;
                    const futureDate = new Date(withdrawalDate);
                    futureDate.setFullYear(withdrawalDate.getFullYear() + yearOffset);
                    
                    // Calculate age at start of withdrawal year
                    const ageAtWithdrawal = futureDate.getFullYear() - birthDate.getFullYear();
                    
                    // Calculate account value at start of year (cash + holdings)
                    const startOfYear = new Date(futureDate.getFullYear(), 0, 1).toISOString().split('T')[0];

                    // Get cash value (running total of transactions)
                    const cashValue = allGeneratedTransactions
                        .filter(t => t.account_id === account.id && t.xtn_date < startOfYear)
                        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

                    // Get holdings value
                    const holdingsValue = holdings
                        .filter(h => h.account_id === account.id)
                        .reduce((sum, holding) => sum + getHoldingValueAtDate(holding, startOfYear), 0);

                    const accountValue = cashValue + holdingsValue;

                    const factor = getPrescribedFactor(ageAtWithdrawal);
                    const minWithdrawalAmount = accountValue * factor;
                    
                    /* console.log('Calculating minimum withdrawal for', futureDate.toISOString());
                    console.log('Cash value:', cashValue);
                    console.log('Holdings value:', holdingsValue);
                    console.log('Total account value:', accountValue);
                    console.log('Age at withdrawal:', ageAtWithdrawal);
                    console.log('Factor:', factor);
                    console.log('Minimum withdrawal amount:', minWithdrawalAmount);*/

                    allGeneratedTransactions.push({
                        id: `minwithdraw-${account.id}-${futureDate.getFullYear()}`,
                        account_id: account.id,
                        accountName: account.name,
                        type: 'Minimum Withdrawal',
                        xtn_date: futureDate.toISOString().split('T')[0],
                        amount: -Math.abs(minWithdrawalAmount), // Ensure it's negative (money going out)
                        isGenerated: true
                    });
                }
            }
        });

        // 4. Combine all transactions
        const regularTransactionsWithAccounts = regularTransactions?.filter(t => !t.isGenerated)?.map(transaction => ({
            ...transaction,
            accountName: accounts.find(acc => acc.id === transaction.account_id)?.name || "Unknown Account"
        })) || [];

        const finalTransactions = [
            ...regularTransactionsWithAccounts,
            ...allGeneratedTransactions
        ].sort((a, b) => a.xtn_date.localeCompare(b.xtn_date));

        return finalTransactions;
    }, [transactions, accounts, holdings, futurePayments]);

    const filterTransactions = useCallback((transactions, criteria) => {
        if (!transactions) return [];
        
        return transactions.filter(transaction => {
            // Account filter
            if (criteria.accountId && transaction.account_id !== criteria.accountId) {
                return false;
            }
            
            // Date range filter
            if (criteria.dateRange?.from && criteria.dateRange?.to) {
                try {
                    // Parse dates without time components to avoid timezone issues
                    const transactionDate = transaction.xtn_date.split('T')[0];
                    const fromDate = criteria.dateRange.from;
                    const toDate = criteria.dateRange.to;
                    
                    // Compare date strings directly (YYYY-MM-DD format)
                    return transactionDate >= fromDate && transactionDate <= toDate;
                } catch (err) {
                    console.error('Error comparing dates:', err);
                    return false;
                }
            }
            
            return true;
        });
    }, []);

    const fetchTransactions = useCallback(async () => {
        try {
            const { data } = await client.models.Transactions.list({
                filter: { owner: { eq: userId } }
            });
            
            // Decrypt the fields for each transaction and convert amount to number
            const decryptedTransactions = await Promise.all(
                data.map(async transaction => {
                    const decrypted = await decryptFields(transaction, ENCRYPTED_FIELDS);
                    return {
                        ...decrypted,
                        amount: parseFloat(decrypted.amount) // Convert decrypted amount to number for display/calculations
                    };
                })
            );
            
            // Generate all transactions (including generated ones)
            const updatedTransactions = generateAllTransactions(decryptedTransactions);
            setAllTransactions(updatedTransactions);
            
            const filterCriteria = {
                accountId: selectedTransactionAccount?.id !== 'all' ? selectedTransactionAccount?.id : null,
                dateRange: transactionFilterOption === 'dateRange' && isDateFilterApplied
                    ? { from: dateFrom, to: dateTo }
                    : null
            };

            const filtered = filterTransactions(updatedTransactions, filterCriteria);
            setFilteredTransactions(filtered);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    }, [generateAllTransactions, selectedTransactionAccount, transactionFilterOption, isDateFilterApplied, 
        dateFrom, dateTo, filterTransactions, setAllTransactions, setFilteredTransactions, client]);

    const addTransaction = async (addedtransaction) => {
        console.log("transaction to add:", addedtransaction);
        if (!addedtransaction.account_id) {
            console.error("Select an Account!");
            return;
        }
        
        try {
            // Convert amount to string for encryption
            const transactionToAdd = {
                ...addedtransaction,
                amount: addedtransaction.amount.toString(), // Convert to string before encryption
                owner: userId
            };
            
            console.log("Preparing to encrypt transaction:", transactionToAdd);
            
            // Encrypt sensitive fields before saving
            const encryptedTransaction = await encryptFields(transactionToAdd, ENCRYPTED_FIELDS);
            console.log("Encrypted transaction:", encryptedTransaction);
            
            // Create the transaction
            const result = await client.models.Transactions.create(encryptedTransaction);
            console.log("Transaction created:", result);
            
            // Refresh the list to get decrypted data
            await fetchTransactions();
        } catch (err) {
            console.error("Error adding transaction:", err);
            alert("Failed to add transaction: " + err.message);
        }
    };
    
    const deleteTransaction = async (id) => {
        try {
            await client.models.Transactions.delete({ id });
            // Instead of directly updating state, fetch all transactions again
            await fetchTransactions();
        } catch (err) {
            console.error("Error deleting Transaction:", err);
            alert("Failed to delete the Transaction. Please try again later.");
        }
    };
      
    const updateTransaction = async (updatedTransaction) => {
        setIsUpdatingTransaction(true);
        try {
            const updatedData = {
                id: updatedTransaction.id,
                account_id: updatedTransaction.account_id,
                type: updatedTransaction.type,
                xtn_date: updatedTransaction.xtn_date,
                amount: parseFloat(updatedTransaction.amount), 
            };

            await client.graphql({
                query: updateTransactions,
                variables: { input: updatedData },
            });

            // Instead of manually updating state, fetch all transactions again
            await fetchTransactions();
            setEditingTransaction(null);
        } catch (err) {
            console.error("Error updating Transaction:", err);
            alert("Failed to update the Transaction. Please try again later.");
        } finally {
            setIsUpdatingTransaction(false);
        }
    };

    // Add an effect to handle initial data loading and updates
    useEffect(() => {
        // Skip if we've already initialized or don't have required data
        if (hasInitializedRef.current || !accounts?.length || !holdings) {
            return;
        }

        hasInitializedRef.current = true;
        fetchTransactions();
    }, [accounts, holdings, fetchTransactions]);

    // Add separate effect for updates
    useEffect(() => {
        // Skip initial load as it's handled by the other effect
        if (!hasInitializedRef.current) {
            return;
        }

        const holdingsChanged = JSON.stringify(holdings) !== JSON.stringify(previousHoldingsRef.current);
        if (holdingsChanged) {
            previousHoldingsRef.current = holdings;
            fetchTransactions();
        }
    }, [holdings, fetchTransactions]);

    // Add an effect to handle futurePayments changes
    useEffect(() => {
        if (hasInitializedRef.current) {
            fetchTransactions();
        }
    }, [futurePayments]);

    return {
        editingTransaction,
        setEditingTransaction,
        isUpdatingTransaction,
        fetchTransactions,
        filterTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction
    };
};

// Helper function to calculate prescribed factor based on age
const getPrescribedFactor = (age) => {
    // As per CRA rules, factor is 1/(90-age) for most cases
    if (age < 71) return 1/(90-age);
    
    // For specific ages, CRA has set factors
    const factors = {
        71: 0.0528,
        72: 0.0540,
        73: 0.0553,
        74: 0.0567,
        75: 0.0582,
        76: 0.0598,
        77: 0.0617,
        78: 0.0636,
        79: 0.0658,
        80: 0.0682,
        81: 0.0708,
        82: 0.0738,
        83: 0.0771,
        84: 0.0808,
        85: 0.0851,
        86: 0.0899,
        87: 0.0955,
        88: 0.1021,
        89: 0.1099,
        90: 0.1192,
        91: 0.1306,
        92: 0.1449,
        93: 0.1634,
        94: 0.1879,
        95: 0.2000
    };
    return factors[age] || 0.20; // 20% for age 95 and over
};

// Helper function to calculate holding value at a specific date
const getHoldingValueAtDate = (holding, date) => {
    const purchaseDate = new Date(holding.purchase_date);
    const maturityDate = new Date(holding.maturity_date);
    const targetDate = new Date(date);
    
    // If before purchase date, holding wasn't owned yet
    if (targetDate < purchaseDate) return 0;
    
    // If after or at maturity, use maturity value
    if (targetDate >= maturityDate) return parseFloat(holding.amount_at_maturity);
    
    // Calculate partial value based on time progression
    const totalGain = parseFloat(holding.amount_at_maturity) - parseFloat(holding.amount_paid);
    const totalDays = (maturityDate - purchaseDate) / (1000 * 60 * 60 * 24);
    const daysHeld = (targetDate - purchaseDate) / (1000 * 60 * 60 * 24);
    
    return parseFloat(holding.amount_paid) + (totalGain * (daysHeld / totalDays));
};