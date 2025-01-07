import React, { useState, useEffect } from 'react';
import { Button, Flex, Heading, TextField, SelectField } from '@aws-amplify/ui-react';

const HoldingForm = ({
    editingHolding,
    setEditingHolding,
    isUpdatingHolding,
    updateHolding,
    addHolding,
    selectedAccount,
    accounts
}) => {
    const [newHolding, setNewHolding] = useState({
        account_id: "",
        name: "",
        purchase_date: "",
        amount_paid: "",
        maturity_date: "",
        rate: "",
        amount_at_maturity: "",
      });

    const [editing, setEditing] = useState(false);
    
    // If editingHolding is passed from parent, initialize state with editingAccount values
    useEffect(() => {
    if (editingHolding) {
        setEditing(true);
        setNewHolding({
            id: editingHolding.id,
            account_id: editingHolding.account_id,
            name: editingHolding.name,
            purchase_date: editingHolding.purchase_date,
            amount_paid: parseFloat(editingHolding.amount_paid),
            maturity_date: editingHolding.maturity_date,
            rate: parseFloat(editingHolding.rate),
            amount_at_maturity: parseFloat(editingHolding.amount_at_maturity),  
        });
    } else {
        setEditing(false);
        setNewHolding({
            account_id: "",
            name: "",
            purchase_date: "",
            amount_paid: "",
            maturity_date: "",
            rate: "",
            amount_at_maturity: "",
        });
    }
    }, [editingHolding]);

    const handleAddHolding= () => {
        addHolding(newHolding);
        setNewHolding({
            name: "",
            purchase_date: "",
            amount_paid: "",
            maturity_date: "",
            rate: "",
            amount_at_maturity: "",
        });
      };

      const handleUpdateHolding = () => {
        updateHolding(newHolding);
        setEditingHolding(null); // Clear the editing state
        setNewHolding({
          name: "",
          purchase_date: "",
          amount_paid: "",
          maturity_date: "",
          rate: "",
          amount_at_maturity: "",
      });      };

      const handleDateChange = (field, value) => {
        let formattedValue = value.replace(/[^0-9-]/g, '');
    
        // Remove extra dashes
        formattedValue = formattedValue.replace(/-{2,}/g, '-');
      
        // Prevent invalid formatting like starting with a dash or multiple dashes
        if (formattedValue.startsWith('-')) {
          formattedValue = formattedValue.slice(1);
        }
      
        // Format as yyyy-mm-dd only if enough digits are present
        const digitsOnly = formattedValue.replace(/-/g, '');
        if (digitsOnly.length > 4 && digitsOnly.length <= 6) {
          formattedValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}`;
        } else if (digitsOnly.length > 6) {
          formattedValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6, 8)}`;
        }
    
        setNewHolding((prev) => ({ ...prev, [field]: formattedValue }));
      };

      const handleCancel = () => {
        setEditing(false)
        setEditingHolding(null); // Clear the editing state
        setNewHolding({
            name: "",
            purchase_date: "",
            amount_paid: "",
            maturity_date: "",
            rate: "",
            amount_at_maturity: "",
        });
      }
      
      return (

        <Flex key="edthld" direction="column" gap="1rem">
            <Heading level={3}>
              {editingHolding ? "Edit Holding" : "Add New Holding"}
            </Heading>
              
              {/* Account ID Section */}
              {
                selectedAccount && selectedAccount.name ? (
                  
                  <div>
                  <label>Account</label>
                  <div>{selectedAccount.name}</div> 
                  {/* Set the account_id in newHolding */}
                  {newHolding.account_id !== selectedAccount.id && setNewHolding({...newHolding, account_id: selectedAccount.id,})}
                  </div>
                 
                ) : (
                  // If no account is selected, show the dropdown for selecting an account
                  <SelectField
                    label="Select Account"
                    value={newHolding.account_id}
                    onChange={(e) =>
                      setNewHolding({...newHolding,account_id: e.target.value,})
                    }
                  >
                    <option value="" disabled>Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </SelectField>
                )
              }


            <TextField
              label="Name"
              value={newHolding.name}
              onChange={(e) =>
                setNewHolding({...newHolding,name: e.target.value,})
              }
            />
            <TextField
              label="Purchase Date"
              value={newHolding.purchase_date}
              onChange={(e) => 
                setNewHolding({...newHolding,purchase_date: e.target.value,})
              }
            />
            <TextField
              label="Amount Paid"
              type="number"
              value={newHolding.amount_paid}
              onChange={(e) =>
                setNewHolding({...newHolding,amount_paid: parseFloat(e.target.value),})
              }
            />
            <TextField
              label="Maturity Date"
              value={newHolding.maturity_date}
              onChange={(e) => 
                setNewHolding({...newHolding,maturity_date: e.target.value,})
              }
            />
            <TextField
              label="Rate"
              type="number"
              value={newHolding.rate}
              onChange={(e) => 
                setNewHolding({...newHolding,rate: parseFloat(e.target.value),})
              }
            />
            <TextField
              label="Amount at Maturity"
              type="number"
              value={newHolding.amount_at_maturity}
              onChange={(e) => 
                setNewHolding({...newHolding,amount_at_maturity: parseFloat(e.target.value),})
              }
            />
            <Button onClick={editingHolding ? 
              handleUpdateHolding : 
              handleAddHolding}>
              {editingHolding ? "Save Changes" : "Add Holding"}
            </Button>
            {editingHolding && (
              <Button onClick={() => 
                handleCancel()}>Cancel</Button>
            )}
          </Flex>

)   ;
};

export default HoldingForm;

      
    