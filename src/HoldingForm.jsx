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
      };

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
                  {newHolding.account_id !== selectedAccount.id && setNewHolding({
                    ...newHolding,
                    account_id: selectedAccount.id,
                  })}
                  </div>
                 
                ) : (
                  // If no account is selected, show the dropdown for selecting an account
                  <SelectField
                    label="Select Account"
                    value={newHolding.account_id}
                    onChange={(e) =>
                      setNewHolding({
                        ...newHolding,
                        account_id: e.target.value,
                      })
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
              value={editingHolding ? editingHolding.name : newHolding.name}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      name: e.target.value,
                    })
                  : setNewHolding({
                      ...newHolding,
                      name: e.target.value,
                    })
              }
            />
            <TextField
              label="Purchase Date"
              value={editingHolding ? editingHolding.purchase_date : newHolding.purchase_date}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      purchase_date: e.target.value,
                    })
                  : setNewHolding({
                      ...newHolding,
                      purchase_date: e.target.value,
                    })
              }
            />
            <TextField
              label="Amount Paid"
              type="number"
              value={editingHolding ? editingHolding.amount_paid : newHolding.amount_paid}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      amount_paid: parseFloat(e.target.value),
                    })
                  : setNewHolding({
                      ...newHolding,
                      amount_paid: parseFloat(e.target.value),
                    })
              }
            />
            <TextField
              label="Maturity Date"
              value={editingHolding ? editingHolding.maturity_date : newHolding.maturity_date}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      maturity_date: e.target.value,
                    })
                  : setNewHolding({
                      ...newHolding,
                      maturity_date: e.target.value,
                    })
              }
            />
            <TextField
              label="Rate"
              type="number"
              value={editingHolding ? editingHolding.rate : newHolding.rate}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      rate: parseFloat(e.target.value),
                    })
                  : setNewHolding({
                      ...newHolding,
                      rate: parseFloat(e.target.value),
                    })
              }
            />
            <TextField
              label="Amount at Maturity"
              type="number"
              value={editingHolding ? editingHolding.amount_at_maturity : newHolding.amount_at_maturity}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      amount_at_maturity: parseFloat(e.target.value),
                    })
                  : setNewHolding({
                      ...newHolding,
                      amount_at_maturity: parseFloat(e.target.value),
                    })
              }
            />
            <Button onClick={editingHolding ? updateHolding : addHolding}>
              {editingHolding ? "Save Changes" : "Add Holding"}
            </Button>
            {editingHolding && (
              <Button onClick={() => setEditingHolding(null)}>Cancel</Button>
            )}
          </Flex>

)   ;
};

export default HoldingForm;

      
    