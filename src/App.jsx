import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  TextField,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import './App.css';
// import { API } from "aws-amplify";
import { updateAccounts } from "../amplify/auth/post-confirmation/graphql/mutations";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

 
  // Function to change the active tab
  const openPage = (pageName) => {
    setActiveTab(pageName);
    console.log('Switching to tab:', pageName); // Debugging line
  
  };
  
  const [isUpdating, setIsUpdating] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "",
    birthdate: "",
    min_withdrawal_date: "",
    starting_balance: "",
  });
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await client.models.Accounts.list();
      setAccounts(data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  const addAccount = async () => {
    try {
      const createdAccount = await client.models.Accounts.create({
        ...newAccount,
        starting_balance: parseFloat(newAccount.starting_balance),
      });
      setAccounts((prevAccounts) => [...prevAccounts, createdAccount]);
      fetchAccounts(); // Refreshes the list after adding
      setNewAccount({
        name: "",
        type: "",
        birthdate: "",
        min_withdrawal_date: "",
        starting_balance: "",
      });
    } catch (err) {
      console.error("Error adding account:", err);
    }
  };

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

  const updateAccount = async () => {
    setIsUpdating(true);
    try {

      // Prepare the updated data for the account
      const updatedData = {
        id: editingAccount.id, // Required for update
        name: editingAccount.name,
        type: editingAccount.type,
        birthdate: editingAccount.birthdate,
        min_withdrawal_date: editingAccount.min_withdrawal_date,
        starting_balance: parseFloat(editingAccount.starting_balance),
      };
  
      console.log("Payload for update:", updatedData);

      // Prepare the condition for the update (if needed)
      const condition = {};  // You can add condition logic here if necessary
  
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
  
      setEditingAccount(null); // Clear the editing state
    } catch (err) {
      console.error("Error updating account:", err);
      alert("Failed to update the account. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      {/* Heading */}
      <Heading level={1}>GIC Tracker</Heading>

      {/* user info */}       
      <Flex
      className="tab-container"
      justifyContent="space-evenly"  // Distribute buttons evenly
      alignItems="center"
      width="100%"  // Ensure it spans the full width
      >
      {userprofiles.map((userprofile) => (
        <Flex
          key={userprofile.id || userprofile.email}
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="2rem"
          border="1px solid #ccc"
          padding="2rem"
          borderRadius="5%"
          className="box"
        >
          <View>
            <Heading level="3">{userprofile.email} {userprofile.profileOwner}</Heading>
          </View>
        </Flex>
      ))}
      </Flex>

      {/* Tab Buttons */}
      <Flex
        className="tab-container"
        justifyContent="space-evenly"  // Distribute buttons evenly
        alignItems="center"
        width="100%"  // Ensure it spans the full width
      >
        <button id="Accounts"
          className={`tablink ${activeTab === 'Accounts' ? 'active' : ''}`}
          onClick={() => openPage('Accounts')}
        >
          Accounts
        </button>
        <button id="Holdings"
          className={`tablink ${activeTab === 'Holdings' ? 'active' : ''}`}
          onClick={() => openPage('Holdings')}
        >
          Holdings
        </button>
        <button id="Ledger"
          className={`tablink ${activeTab === 'Ledger' ? 'active' : ''}`}
          onClick={() => openPage('Ledger')}
        >
          Ledger
        </button>

        <button id="About"
          className={`tablink ${activeTab === 'About' ? 'active' : ''}`}
          onClick={() => openPage('About')}
        >
          About
        </button>
      </Flex>

      
      <Divider />

      {/* Tab Content */}
      <div id="Accounts" className={`tabcontent ${activeTab === 'Accounts' ? 'active' : ''}`}>
          <Flex key="acnts" direction="column" gap="1rem">
            <Heading level={2}>Accounts</Heading>
            <Grid key="hdr" templateColumns="repeat(5, 1fr)" gap="1rem">
              <Heading key="header-name" level={4}>Name</Heading>
              <Heading key="header-type" level={4}>Type</Heading>
              <Heading key="header-birthdate" level={4}>Birthdate</Heading>
              <Heading key="header-min-withdrawal" level={4}>Min Withdrawal Date</Heading>
              <Heading key="header-balance" level={4}>Starting Balance</Heading>
            </Grid>
            {accounts.map((account) => (
              <Grid key={account.id} templateColumns="repeat(5, 1fr)" gap="1rem">
                <span>{account.name}</span>
                <span>{account.type}</span>
                <span>{account.birthdate}</span>
                <span>{account.min_withdrawal_date}</span>
                <span>{account.starting_balance}</span>
                <Button onClick={() => deleteAccount(account.id)}>Delete</Button>
                <Button onClick={() => setEditingAccount(account)}>Edit</Button>
              </Grid>
            ))}

            {editingAccount ? (
              <Flex direction="column" gap="1rem">
                <Heading level={3}>Edit Account</Heading>
                <TextField
                  label="Name"
                  value={editingAccount.name}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, name: e.target.value })
                  }
                />
                <TextField
                  label="Type"
                  value={editingAccount.type}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, type: e.target.value })
                  }
                />
                <TextField
                  label="Birthdate"
                  value={editingAccount.birthdate}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, birthdate: e.target.value })
                  }
                />
                <TextField
                  label="Min Withdrawal Date"
                  value={editingAccount.min_withdrawal_date}
                  onChange={(e) =>
                    setEditingAccount({
                      ...editingAccount,
                      min_withdrawal_date: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Starting Balance"
                  value={editingAccount.starting_balance}
                  onChange={(e) =>
                    setEditingAccount({
                      ...editingAccount,
                      starting_balance: e.target.value,
                    })
                  }
                />
                {editingAccount && (
                  <Button onClick={updateAccount} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                )}
              <Button onClick={() => setEditingAccount(null)}>Cancel</Button>
              </Flex>
            ) : (
              <Flex direction="column" gap="1rem">
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
                      min_withdrawal_date: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Starting Balance"
                  value={newAccount.starting_balance}
                  onChange={(e) =>
                    setNewAccount({
                      ...newAccount,
                      starting_balance: e.target.value,
                    })
                  }
                />
                <Button onClick={addAccount}>Add Account</Button>
              </Flex>
            )}
          </Flex>
      </div>
    
      <div  id="Holdings" className={`tabcontent ${activeTab === 'Holdings' ? 'active' : ''}`}>
        <h3>Holdings</h3>
        <p>Some news this fine day!</p>
      </div>
    
      <div id="Ledger" className={`tabcontent ${activeTab === 'Ledger' ? 'active' : ''}`}>
        <h3>Ledger</h3>
        <p>Get in touch, or swing by for a cup of coffee.</p>
      </div>
    
      <div id="About" className={`tabcontent ${activeTab === 'About' ? 'active' : ''}`}>
        <h3>About</h3>
        <p>Who we are and what we do.</p>
      </div>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
