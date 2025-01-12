
import { useState } from "react";
import { updateTransactions, createTransactions } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listTransactions } from "../amplify/auth/post-confirmation/graphql/queries"; 

export const useTransactionOperations = ({ transactions, setTransactions, client, setSelectedTransactionAccount, selectedTransactionAccount, handleViewTransactions }) => {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(false);

    const fetchTransactions = async () => { 
        try {
          const {data} = await  client.models.Transactions.list(); // Amplify.API.graphql({ query: listTransactions });
           // console.log(" fetched Transactions:", data);
          const holdingsData = await client.models.Holdings.list(); // Replace with actual API or state call
          const holdings = holdingsData?.data || [];
          const generatedTransactions = generateHoldingTransactions(holdings);
          const combinedTransactions = [...data, ...generatedTransactions];
          setSelectedTransactionAccount(null)
          setTransactions(combinedTransactions);
      
       } catch (err) {
          console.error("Error fetching Transactions:", err);
        }
    };
    
    const addTransaction = async (addedtransaction) => { // HOLDINGS: Added
        console.log("transaction to add:", addedtransaction)
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
          const ctransaction = createdTransaction.data || createdTransaction
          setTransactions((prevTransactions) => [...prevTransactions, ctransaction]);
          if (selectedTransactionAccount) {
            await handleViewTransactions(selectedTransactionAccount.id, selectedTransactionAccount.name);
          } else {
             fetchTransactions();
          }
        } catch (err) {
          console.error("Error adding transaction:", err);
        }
      };
    
      const deleteTransaction = async (id) => { // HOLDINGS: Added
        try {
          client.models.Transactions.delete({id});
          setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== id));
        } catch (err) {
          console.error("Error deleting Transaction:", err);
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
    
          setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
              transaction.id === result.data.updateTransactions.id
                ? result.data.updateTransactions
                : transaction
            )
          );
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

    return {
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        editingTransaction,
        setEditingTransaction,
        isUpdatingTransaction,
    };
};