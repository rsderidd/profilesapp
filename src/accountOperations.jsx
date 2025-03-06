// accountOperations.jsx

import { useState } from "react";
import { createAccounts, deleteAccounts, updateAccounts, } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listAccounts, } from "../amplify/auth/post-confirmation/graphql/queries"; 
import { encryptFields, decryptFields } from './utils/encryption';

const ENCRYPTED_FIELDS = ['starting_balance'];

export const useAccountOperations = ({ accounts, setAccounts, client, userId }) => {
    const [editingAccount, setEditingAccount] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch accounts
  const fetchAccounts = async () => {
    try {
        // console.log("Fetching accounts for user:", userId); // Log the userId
        const { data } = await client.models.Accounts.list({
            filter: { owner: { eq: userId } }
        });
        
        // Decrypt the fields and convert numeric values
        const decryptedAccounts = await Promise.all(
            data.map(async account => {
                const decrypted = await decryptFields(account, ENCRYPTED_FIELDS);
                return {
                    ...decrypted,
                    starting_balance: parseFloat(decrypted.starting_balance) // Convert to number for display/calculations
                };
            })
        );
        
        setAccounts(decryptedAccounts);
        return decryptedAccounts;
    } catch (err) {
        console.error("Error fetching accounts:", err);
        return [];
    }
  };

  // Add a new account
  const addAccount = async (addedAccount) => {
    console.log("new account:", addedAccount);   
    try {
      // Convert numeric fields to strings for encryption
      const accountToAdd = {
        ...addedAccount,
        starting_balance: addedAccount.starting_balance.toString(),
        owner: userId
      };

      // Encrypt sensitive fields
      const encryptedAccount = await encryptFields(accountToAdd, ENCRYPTED_FIELDS);
      
      const createdAccount = await client.models.Accounts.create(encryptedAccount);
      await fetchAccounts(); // Refresh the list to get decrypted data
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
      // Convert numeric fields to strings for encryption
      const accountToUpdate = {
        ...updatedAccount,
        starting_balance: updatedAccount.starting_balance.toString()
      };

      // Encrypt sensitive fields
      const encryptedAccount = await encryptFields(accountToUpdate, ENCRYPTED_FIELDS);

      const result = await client.graphql({
        query: updateAccounts,
        variables: { input: encryptedAccount }
      });

      await fetchAccounts(); // Refresh the list to get decrypted data
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
