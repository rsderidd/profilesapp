import React, { useState, useEffect } from 'react';
import { Button, Flex, Heading, TextField, SelectField } from '@aws-amplify/ui-react';

const TransactionForm = ({
    editingTransaction,
    setEditingTransaction,
    isUpdatingTransaction,
    updateTransaction,
    addTransaction,
    selectedTransactionAccount,
    accounts
}) => {
    const [newTransaction, setNewTransaction] = useState({
      account_id: "",
      type: "",
      xtn_date: "",
      amount: "",
    });

    const [editing, setEditing] = useState(false);
    
    // If editingTransaction is passed from parent, initialize state with editingAccount values
    useEffect(() => {
    if (editingTransaction) {
        setEditing(true);
        setNewTransaction({
            id: editingTransaction.id,
            account_id: editingTransaction.account_id,
            type: editingTransaction.type,
            xtn_date: editingTransaction.xtn_date,
            amount: parseFloat(editingTransaction.amount),
        });
    } else {
        setEditing(false);
        setNewTransaction({
            account_id: "",
            type: "",
            xtn_date: "",
            amount: "",
        });
    }
    }, [editingTransaction]);

    const handleAddTransaction= () => {
        addTransaction(newTransaction);
        setNewTransaction({
            type: "",
            xtn_date: "",
            amount: "",
        });
      };

      const handleUpdateTransaction = () => {
        updateTransaction(newTransaction);
        setEditingTransaction(null); // Clear the editing state
        setNewTransaction({
          type: "",
          xtn_date: "",
          amount: "",
        });      
      };

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
    
        setNewTransaction((prev) => ({ ...prev, [field]: formattedValue }));
      };

      const handleCancel = () => {
        setEditing(false)
        setEditingTransaction(null); // Clear the editing state
        setNewTransaction({
            type: "",
            xtn_date: "",
            amount: "",
        });
      }
      
      return (

        <Flex key="edtldg" direction="column" gap="1rem">
            <Heading level={3}>
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </Heading>
              
              {/* Account ID Section */}
              {
                selectedTransactionAccount && selectedTransactionAccount.name ? (
                  
                  <div>
                  <label>Account</label>
                  <div>{selectedTransactionAccount.name}</div> 
                  {/* Set the account_id in newTransaction */}
                  {newTransaction.account_id !== selectedTransactionAccount.id && setNewTransaction({...newTransaction, account_id: selectedTransactionAccount.id,})}
                  </div>
                 
                ) : (
                  // If no account is selected, show the dropdown for selecting an account
                  <SelectField
                    label="Select Account"
                    value={newTransaction.account_id}
                    onChange={(e) =>
                      setNewTransaction({...newTransaction,account_id: e.target.value,})
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
              label="Type"
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({...newTransaction,type: e.target.value,})
              }
            />
            <TextField
              label="Transaction Date (yyyy-mm-dd)"
              value={newTransaction.xtn_date}
              onChange={(e) => handleDateChange("xtn_date", e.target.value)}
              maxLength={10}  // Limit input to 10 characters (yyyy-mm-dd)
              placeholder="yyyy-mm-dd"                    
            />
            <TextField
              label="Amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({...newTransaction,amount: parseFloat(e.target.value),})
              }
            />

            <Button onClick={editingTransaction ? 
              handleUpdateTransaction : 
              handleAddTransaction}>
              {editingTransaction ? "Save Changes" : "Add Transaction"}
            </Button>
            {editingTransaction && (
              <Button onClick={() => 
                handleCancel()}>Cancel</Button>
            )}
          </Flex>

)   ;
};

export default TransactionForm;

      
    