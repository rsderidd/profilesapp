import { useState } from "react";
import { createHoldings, deleteHoldings, updateHoldings,  } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listHoldings, } from "../amplify/auth/post-confirmation/graphql/queries"; 
import { encryptFields, decryptFields } from './utils/encryption';

const ENCRYPTED_FIELDS = ['amount_paid', 'amount_at_maturity'];

export const useHoldingOperations = ({ 
    holdings, 
    setHoldings, 
    client, 
    setSelectedAccount, 
    selectedAccount, 
    handleViewHoldings,
    accounts  // Add this parameter
    , userId
}) => {
    const [editingHolding, setEditingHolding] = useState(null);
    const [isUpdatingHolding, setIsUpdatingHolding] = useState(false);
  
    const fetchHoldings = async () => {
        try {
            const { data } = await client.models.Holdings.list({
                filter: { owner: { eq: userId } }
            });
            
            // Decrypt the fields and convert numeric values
            const decryptedHoldings = await Promise.all(
                data.map(async holding => {
                    const decrypted = await decryptFields(holding, ENCRYPTED_FIELDS);
                    return {
                        ...decrypted,
                        amount_paid: parseFloat(decrypted.amount_paid),
                        amount_at_maturity: parseFloat(decrypted.amount_at_maturity)
                    };
                })
            );
            
            setHoldings(decryptedHoldings);
            return decryptedHoldings;
        } catch (err) {
            console.error("Error fetching holdings:", err);
            return [];
        }
    };
  
    const addHolding = async (addedHolding) => {
        try {
            // Convert numeric fields to strings for encryption
            const holdingToAdd = {
                ...addedHolding,
                amount_paid: addedHolding.amount_paid.toString(),
                amount_at_maturity: addedHolding.amount_at_maturity.toString(),
                owner: userId
            };

            // Encrypt sensitive fields
            const encryptedHolding = await encryptFields(holdingToAdd, ENCRYPTED_FIELDS);
            
            const createdHolding = await client.models.Holdings.create(encryptedHolding);
            await fetchHoldings(); // Refresh the list to get decrypted data
        } catch (err) {
            console.error("Error adding holding:", err);
        }
    };
  
    const updateHolding = async (updatedHolding) => {
        setIsUpdatingHolding(true);
        try {
            // Convert numeric fields to strings for encryption
            const holdingToUpdate = {
                ...updatedHolding,
                amount_paid: updatedHolding.amount_paid.toString(),
                rate: parseFloat(updatedHolding.rate),
                amount_at_maturity: updatedHolding.amount_at_maturity.toString()
            };

            // Encrypt sensitive fields
            const encryptedHolding = await encryptFields(holdingToUpdate, ENCRYPTED_FIELDS);

            const result = await client.graphql({
                query: updateHoldings,
                variables: { input: encryptedHolding }
            });

            setEditingHolding(null);
            await fetchHoldings(); // Refresh the list to get decrypted data
        } catch (err) {
            console.error("Error updating holding:", err);
            alert("Failed to update the holding. Please try again later.");
        } finally {
            setIsUpdatingHolding(false);
        }
    };

    const deleteHolding = async (id) => { // HOLDINGS: Added
        try {
          client.models.Holdings.delete({id});
          setHoldings((prevHoldings) => prevHoldings.filter((holding) => holding.id !== id));
        } catch (err) {
          console.error("Error deleting holding:", err);
        }
    };
    
  
    return {
      fetchHoldings,
      addHolding,
      updateHolding,
      deleteHolding,
      editingHolding,
      setEditingHolding,
      isUpdatingHolding,
    };
};