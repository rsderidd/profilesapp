// accountOperations.jsx

import { useState } from "react";
import { createAccounts, deleteAccounts, updateAccounts, } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listAccounts, } from "../amplify/auth/post-confirmation/graphql/queries"; 

export const useAccountOperations = ({ accounts, setAccounts,  client,  }) => {
    const [editingAccount, setEditingAccount] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const { data } = await client.models.Accounts.list();
      setAccounts(data);
      return data;
    } catch (err) {
      console.error("Error fetching accounts:", err);
      return [];
    }
  };

  // Add a new account
  const addAccount = async (addedAccount) => {
    console.log("new account:", addedAccount);   
    try {
      const createdAccount = await client.models.Accounts.create({
        ...addedAccount,
        starting_balance: parseFloat(addedAccount.starting_balance),
      });
      const caccount = createdAccount.data || createdAccount

      setAccounts((prevAccounts) => [...prevAccounts, caccount]);
      fetchAccounts(); // Refreshes the list after adding
    } catch (err) {
      console.error("Error adding account:", err);
    }
  };

  // Delete an account
  const deleteAccount = async (id) => {
    try {
      const accountToDelete = accounts.find((account) => account.id === id);
      console.log("Account to delete:", accountToDelete);
      console.log(`Attempting to delete account with ID: ${id}`);
      if (!id) throw new Error("ID is null or undefined");

      // Delete the account from the backend database
      console.log("Delete response:", await client.models.Accounts.delete({id}));
      
      // testing only
      const verifyAccounts = await client.models.Accounts.list();
      console.log("Backend Accounts after deletion:", verifyAccounts);
      
      // Update the state to exclude the deleted account
      setAccounts((prevAccounts) => {
        const updatedAccounts = prevAccounts.filter(
          (account) => account.id !== id
        );
        console.log("Updated Accounts List:", updatedAccounts); // Correct state log
        return updatedAccounts;
      });
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  // Update an account
  const updateAccount = async (updatedAccount) => {
    setIsUpdating(true);
    try {

      // Prepare the updated data for the account
      const updatedData = {
        id: updatedAccount.id, // Required for update
        name: updatedAccount.name,
        type: updatedAccount.type,
        birthdate: updatedAccount.birthdate,
        min_withdrawal_date: updatedAccount.min_withdrawal_date,
        starting_balance: parseFloat(updatedAccount.starting_balance),
      };
  
      console.log("Payload for update:", updatedData);

      // Prepare the condition for the update (if needed)
      // const condition = {};  // You can add condition logic here if necessary
  
      // Perform the update using the API and the updateAccounts mutation
      // const result = await client.models.Accounts.update(editingAccount.id, updatedData, { condition });
      // const result = await client.models.Accounts.update(editingAccount.id, updatedData);
      
      // const updatedAccount = await API.graphql(graphqlOperation(updateAccounts, { input: updatedData }));
      const result = await client.graphql({
        query: updateAccounts,
        variables: { input: updatedData }
      });

  
      // Update the state to reflect the changes
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === result.data.updateAccounts.id
            ? result.data.updateAccounts
            : account
        )
      );
  
     } catch (err) {
      console.error("Error updating account:", err);
      alert("Failed to update the account. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };


  return {
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    editingAccount,
    setEditingAccount,
    isUpdating,
  };
};
