import { useState } from "react";
import { createHoldings, deleteHoldings, updateHoldings,  } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listHoldings, } from "../amplify/auth/post-confirmation/graphql/queries"; 

export const useHoldingOperations = ({ 
    holdings, 
    setHoldings, 
    client, 
    setSelectedAccount, 
    selectedAccount, 
    handleViewHoldings,
    accounts  // Add this parameter
}) => {
    const [editingHolding, setEditingHolding] = useState(null);
    const [isUpdatingHolding, setIsUpdatingHolding] = useState(false);
  
    const fetchHoldings = async () => { 
        try {
          const {data} = await client.models.Holdings.list();
          setSelectedAccount(null);
          // Add account type to each holding
          const holdingsWithAccountType = data.map(holding => {
            const account = accounts.find(acc => acc.id === holding.account_id);
            return {
              ...holding,
              accountType: account?.type || 'Unknown',
              accountName: account?.name || 'Unknown Account'
            };
          });
          setHoldings(holdingsWithAccountType);
        } catch (err) {
          console.error("Error fetching holdings:", err);
        }
    };
  
    const addHolding = async (addedholding) => { // HOLDINGS: Added
        console.log("holding to add:", addedholding)
        if (!addedholding.account_id) {
        console.error("Select an Account!");
        return;
        }
        
        try {
        const createdHolding = await client.models.Holdings.create({
            account_id: addedholding.account_id,
            name: addedholding.name,
            purchase_date: addedholding.purchase_date,
            amount_paid: parseFloat(addedholding.amount_paid),
            maturity_date: addedholding.maturity_date,
            rate: parseFloat(addedholding.rate),
            amount_at_maturity: parseFloat(addedholding.amount_at_maturity),
        });
        const cholding = createdHolding.data || createdHolding
        setHoldings((prevHoldings) => [...prevHoldings, cholding]);
        if (selectedAccount) {
            await handleViewHoldings(selectedAccount.id, selectedAccount.name);
        } else {
            fetchHoldings();
        }
        } catch (err) {
        console.error("Error adding holding:", err);
        }
    };
  
    const updateHolding = async (updatedHolding) => {
        setIsUpdatingHolding(true);
        try {
          const updatedData = {
            id: updatedHolding.id,
            account_id: updatedHolding.account_id,
            name: updatedHolding.name,
            purchase_date: updatedHolding.purchase_date,
            amount_paid: parseFloat(updatedHolding.amount_paid),
            maturity_date: updatedHolding.maturity_date,
            rate: parseFloat(updatedHolding.rate),
            amount_at_maturity: parseFloat(updatedHolding.amount_at_maturity),  
          };
    
          const result = await client.graphql({
            query: updateHoldings,
            variables: { input: updatedData },
          });
    
          setHoldings((prevHoldings) =>
            prevHoldings.map((holding) =>
              holding.id === result.data.updateHoldings.id
                ? result.data.updateHoldings
                : holding
            )
          );
          setEditingHolding(null);
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