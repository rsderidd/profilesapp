import { useState, useCallback } from "react";
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

    const fetchTransactions = async () => {
        try {
            const transactionsData = await client.models.Transactions.list();
            const holdingsData = await client.models.Holdings.list();
            
            const regularTransactions = transactionsData.data || [];
            const holdings = holdingsData.data || [];
            
            // Use new function to generate all synthetic transactions
            const generatedTransactions = generateAllTransactions(holdings, accounts, regularTransactions);
            
            const allTransactions = [...regularTransactions, ...generatedTransactions];
            setAllTransactions(allTransactions);
            
            // Apply any current filters
            const filterCriteria = {
                accountId: selectedTransactionAccount?.id !== 'all' ? selectedTransactionAccount?.id : null,
                dateRange: transactionFilterOption === 'dateRange' && isDateFilterApplied
                    ? { 
                        from: dateFrom,
                        to: dateTo
                    }
                    : null
            };

            const filtered = filterTransactions(allTransactions, filterCriteria);
            const filteredWithAccounts = filtered.map((transaction) => {
                const account = accounts.find((acc) => acc.id === transaction.account_id);
                const accountName = account ? account.name : "Unknown Account";
                return { ...transaction, accountName };
            });

            setFilteredTransactions(filteredWithAccounts);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    };

    // New helper function to filter transactions
    const filterTransactions = (transactions, criteria) => {
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
    };
    
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
            const ctransaction = createdTransaction.data || createdTransaction;
            setAllTransactions((prevTransactions) => [...prevTransactions, ctransaction]);
            if (selectedTransactionAccount) {
                await handleViewTransactions(selectedTransactionAccount.id, selectedTransactionAccount.name);
            } else {
                fetchTransactions();
            }
        } catch (err) {
            console.error("Error adding transaction:", err);
        }
    };
    
    const deleteTransaction = async (id) => {
        try {
            await client.models.Transactions.delete({ id });
            
            // Update both allTransactions and filteredTransactions states
            setAllTransactions(prevTransactions => 
                prevTransactions.filter(transaction => transaction.id !== id)
            );
            
            setFilteredTransactions(prevFiltered => 
                prevFiltered.filter(transaction => transaction.id !== id)
            );
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

            const result = await client.graphql({
                query: updateTransactions,
                variables: { input: updatedData },
            });

            const updatedTransactionData = result.data.updateTransactions;
            
            // Update allTransactions by replacing just the updated transaction
            setAllTransactions(prevTransactions => 
                prevTransactions.map(transaction =>
                    transaction.id === updatedTransactionData.id
                        ? updatedTransactionData
                        : transaction
                )
            );
            
            // Re-apply current filters to show updated data
            const filterCriteria = {
                accountId: selectedTransactionAccount?.id !== 'all' ? selectedTransactionAccount?.id : null,
                dateRange: transactionFilterOption === 'dateRange' && isDateFilterApplied
                    ? { 
                        from: dateFrom,
                        to: dateTo
                    }
                    : null
            };

            // Update filteredTransactions by replacing just the updated transaction
            setFilteredTransactions(prevFiltered => {
                const shouldInclude = filterTransactions([updatedTransactionData], filterCriteria).length > 0;
                
                if (shouldInclude) {
                    // Update or add the transaction
                    const exists = prevFiltered.some(t => t.id === updatedTransactionData.id);
                    if (exists) {
                        return prevFiltered.map(transaction =>
                            transaction.id === updatedTransactionData.id
                                ? { 
                                    ...updatedTransactionData,
                                    accountName: accounts.find(acc => acc.id === updatedTransactionData.account_id)?.name || "Unknown Account"
                                }
                                : transaction
                        );
                    } else {
                        // Add to filtered if it now matches criteria
                        return [...prevFiltered, {
                            ...updatedTransactionData,
                            accountName: accounts.find(acc => acc.id === updatedTransactionData.account_id)?.name || "Unknown Account"
                        }];
                    }
                } else {
                    // Remove from filtered if it no longer matches criteria
                    return prevFiltered.filter(t => t.id !== updatedTransactionData.id);
                }
            });

            setEditingTransaction(null);
        } catch (err) {
            console.error("Error updating Transaction:", err);
            alert("Failed to update the Transaction. Please try again later.");
        } finally {
            setIsUpdatingTransaction(false);
        }
    };
    
    const generateHoldingTransactions = (holdings) => {
        return holdings.flatMap((holding) => [
            {
                id: `purchase-${holding.id}`, // Unique ID for the purchase transaction
                account_id: holding.account_id,
                type: "Purchase",
                xtn_date: holding.purchase_date, // Assuming `purchase_date` exists in holdings
                amount: -holding.amount_paid, // Assuming `purchase_amount` exists
                isGenerated: true,
            },
            {
                id: `maturity-${holding.id}`, // Unique ID for the maturity transaction
                account_id: holding.account_id,
                type: "Maturity",
                xtn_date: holding.maturity_date, // Assuming `maturity_date` exists in holdings
                amount: holding.amount_at_maturity, // Assuming `maturity_amount` exists
                isGenerated: true,
            },
        ]);
    };

    const generateAllTransactions = useCallback(() => {
        let generatedTransactions = [];

        // Keep existing generation logic
        accounts.forEach(account => {
            if (account.starting_balance) {
                generatedTransactions.push({
                    id: `starting-${account.id}`,
                    account_id: account.id,
                    type: 'Starting Balance',
                    xtn_date: '1900-01-01',
                    amount: parseFloat(account.starting_balance || 0),
                    isGenerated: true
                });
            }
        });

        // Generate holding transactions
        const holdingTransactions = generateHoldingTransactions(holdings);
        generatedTransactions = [...generatedTransactions, ...holdingTransactions];

        // Add future minimum payments
        if (futurePayments > 0) {
            const today = new Date();
            
            accounts.forEach(account => {
                if (!account.min_withdrawal_date) return;
                
                const [, month, day] = account.min_withdrawal_date.split('-');
                
                for (let i = 0; i < futurePayments; i++) {
                    const year = today.getFullYear() + (i + (today > new Date(today.getFullYear(), month - 1, day) ? 1 : 0));
                    const date = `${year}-${month}-${day}`;
                    
                    generatedTransactions.push({
                        id: `future-${account.id}-${i}`,
                        account_id: account.id,
                        type: 'Minimum Payment',
                        xtn_date: date,
                        amount: -10,  // Adjust this amount as needed
                        isGenerated: true
                    });
                }
            });
        }

        // Combine all transactions and sort
        const allTransactions = [...transactions, ...generatedTransactions]
            .sort((a, b) => a.xtn_date.localeCompare(b.xtn_date));
        
        setAllTransactions(allTransactions);
        return allTransactions;
    }, [transactions, accounts, futurePayments, setAllTransactions]);

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