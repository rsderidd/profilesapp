import React, { useState, useEffect } from 'react';
import { Button, Flex, Heading, TextField } from '@aws-amplify/ui-react';

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
  };

  return (
    <Flex direction="column" gap="1rem">
      {editing ? (
        <>
          <Heading level={3}>Edit Account</Heading>
          <TextField
            label="Name"
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount({ ...newAccount, name: e.target.value })
            }
          />
          <TextField
            label="Type"
            value={newAccount.type}
            onChange={(e) =>
              setNewAccount({ ...newAccount, type: e.target.value })
            }
          />
          <TextField
            label="Birthdate"
            value={newAccount.birthdate}
            onChange={(e) =>
              setNewAccount({ ...newAccount, birthdate: e.target.value })
            }
          />
          <TextField
            label="Min Withdrawal Date"
            value={newAccount.min_withdrawal_date}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                min_withdrawal_date: e.target.value
              })
            }
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
          <Button onClick={handleUpdateAccount} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => setEditing(false)}>Cancel</Button>
        </>
      ) : (
        <>
          <Heading level={3}>Add New Account</Heading>
          <TextField
            label="Name"
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount({ ...newAccount, name: e.target.value })
            }
          />
          <TextField
            label="Type"
            value={newAccount.type}
            onChange={(e) =>
              setNewAccount({ ...newAccount, type: e.target.value })
            }
          />
          <TextField
            label="Birthdate"
            value={newAccount.birthdate}
            onChange={(e) =>
              setNewAccount({ ...newAccount, birthdate: e.target.value })
            }
          />
          <TextField
            label="Min Withdrawal Date"
            value={newAccount.min_withdrawal_date}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                min_withdrawal_date: e.target.value
              })
            }
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
          <Button onClick={handleAddAccount}>Add Account</Button>
        </>
      )}
    </Flex>
  );
};

export default AccountForm;
