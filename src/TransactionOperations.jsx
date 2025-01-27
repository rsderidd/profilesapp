import { useState, useCallback, useEffect, useRef } from "react";
import { updateTransactions, createTransactions } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listTransactions } from "../amplify/auth/post-confirmation/graphql/queries"; 

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
    holdings
}) => { 
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(false);
    const hasInitializedRef = useRef(false);
    const previousHoldingsRef = useRef(null);

    const generateAllTransactions = useCallback((regularTransactions = transactions) => {
        let allGeneratedTransactions = [];

        // 1. Generate starting balances
        accounts?.forEach(account => {
            if (account.starting_balance) {
                allGeneratedTransactions.push({
                    id: `starting-${account.id}`,
                    account_id: account.id,
                    accountName: account.name,
                    type: 'Starting Balance',
                    xtn_date: '1900-01-01',
                    amount: parseFloat(account.starting_balance || 0),
                    isGenerated: true
                });
            }
        });

        // 2. Generate holding transactions
        if (holdings?.length > 0) {
            holdings.forEach(holding => {
                const accountName = accounts.find(acc => acc.id === holding.account_id)?.name || "Unknown Account";
                
                allGeneratedTransactions.push({
                    id: `holding-${holding.id}`,
                    account_id: holding.account_id,
                    accountName,
                    type: 'Holding Purchase',
                    xtn_date: holding.purchase_date,
                    amount: -parseFloat(holding.amount_paid || 0),
                    isGenerated: true
                });

                if (holding.maturity_date) {
                    allGeneratedTransactions.push({
                        id: `maturity-${holding.id}`,
                        account_id: holding.account_id,
                        accountName,
                        type: 'Holding Maturity',
                        xtn_date: holding.maturity_date,
                        amount: parseFloat(holding.amount_at_maturity || 0),
                        isGenerated: true
                    });
                }
            });
        }

        // 3. Combine all transactions
        const regularTransactionsWithAccounts = regularTransactions?.filter(t => !t.isGenerated)?.map(transaction => ({
            ...transaction,
            accountName: accounts.find(acc => acc.id === transaction.account_id)?.name || "Unknown Account"
        })) || [];

        const finalTransactions = [
            ...regularTransactionsWithAccounts,
            ...allGeneratedTransactions
        ].sort((a, b) => a.xtn_date.localeCompare(b.xtn_date));

        return finalTransactions;
    }, [transactions, accounts, holdings]);

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
            const transactionsData = await client.models.Transactions.list();
            const regularTransactions = transactionsData.data || [];
            
            const updatedTransactions = generateAllTransactions(regularTransactions);
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
            const createdTransaction = await client.models.Transactions.create({
                account_id: addedtransaction.account_id,
                type: addedtransaction.type,
                xtn_date: addedtransaction.xtn_date,
                amount: parseFloat(addedtransaction.amount),
            });
            // Instead of directly updating state, fetch all transactions again
            await fetchTransactions();
        } catch (err) {
            console.error("Error adding transaction:", err);
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

        console.log("Initial data available for transaction generation:", {
            accountsCount: accounts.length,
            holdingsCount: holdings.length
        });

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
            console.log("Holdings updated, regenerating transactions");
            previousHoldingsRef.current = holdings;
            fetchTransactions();
        }
    }, [holdings, fetchTransactions]);

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