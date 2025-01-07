import React, { useState, useEffect } from 'react';
import { Button, Flex, Heading, TextField, SelectField } from '@aws-amplify/ui-react';

const AccountForm = ({
  editingAccount,
  setEditingAccount,
  isUpdating,
  updateAccount,
  addAccount
}) => {
  // Local state for newAccount, managed inside the form
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: '',
    birthdate: '',
    min_withdrawal_date: '',
    starting_balance: ''
  });

  const [editing, setEditing] = useState(false);

  // If editingAccount is passed from parent, initialize state with editingAccount values
  useEffect(() => {
    if (editingAccount) {
      setEditing(true);
      setNewAccount({
        id: editingAccount.id,
        name: editingAccount.name,
        type: editingAccount.type,
        birthdate: editingAccount.birthdate,
        min_withdrawal_date: editingAccount.min_withdrawal_date,
        starting_balance: editingAccount.starting_balance
      });
    } else {
      setEditing(false);
      setNewAccount({
        name: '',
        type: '',
        birthdate: '',
        min_withdrawal_date: '',
        starting_balance: ''
      });
    }
  }, [editingAccount]);

  const handleAddAccount = () => {
    addAccount(newAccount);
    setNewAccount({
        name: '',
        type: '',
        birthdate: '',
        min_withdrawal_date: '',
        starting_balance: ''
    });
  };

  const handleUpdateAccount = () => {
    updateAccount(newAccount);
    setEditingAccount(null); // Clear the editing state
    setNewAccount({
      name: '',
      type: '',
      birthdate: '',
      min_withdrawal_date: '',
      starting_balance: ''
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

    setNewAccount((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleCancel = () => {
    setEditing(false)
    setEditingAccount(null); // Clear the editing state
    setNewAccount({
      name: '',
      type: '',
      birthdate: '',
      min_withdrawal_date: '',
      starting_balance: ''
    });    
  }
  
  return (
    <Flex direction="column" gap="1rem">
      <Heading level={3}>
        {editing ? "Edit Account" : "Add New Account"}
      </Heading>

           <TextField
            label="Name"
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount({ ...newAccount, name: e.target.value })
            }
          />
          <SelectField
            label="Type"
            value={newAccount.type}
            onChange={(e) =>
              setNewAccount({ ...newAccount, type: e.target.value })
            }
          >
            <option value="" disabled>
                Select Account Type
            </option>
            <option value="RRSP">RRSP</option>
            <option value="RRIF">RRIF</option>
            <option value="TFSA">TFSA</option>
            </SelectField>

            <TextField
              label="Birthdate (yyyy-mm-dd)"
              value={newAccount.birthdate}
              onChange={(e) => handleDateChange("birthdate", e.target.value)}
              maxLength={10}  // Limit input to 10 characters (yyyy-mm-dd)
              placeholder="yyyy-mm-dd"
            />

          <TextField
            label="Min Withdrawal Date (yyyy-mm-dd)"
            value={newAccount.min_withdrawal_date}
            onChange={(e) => handleDateChange("min_withdrawal_date:", e.target.value)}
            maxLength={10}  // Limit input to 10 characters (yyyy-mm-dd)
            placeholder="yyyy-mm-dd"
        />

          <TextField
            label="Starting Balance"
            value={newAccount.starting_balance}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                starting_balance: e.target.value
              })
            }
          />
          <Button onClick={editing ? (handleUpdateAccount) : (handleAddAccount )} disabled={isUpdating}>
            {editing ? (isUpdating ? 'Saving...' : 'Save' ) : ('Add Account')}
          </Button>
          <Button onClick={() => handleCancel()}>Cancel</Button>

    </Flex>
  );
};

export default AccountForm;
