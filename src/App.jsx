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
import { createAccounts, createHoldings, deleteAccounts, deleteHoldings, updateAccounts, updateHoldings } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listAccounts, listHoldings } from "../amplify/auth/post-confirmation/graphql/queries"; 

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

  // Holdings State 
  const [holdings, setHoldings] = useState([]);
  const [newHolding, setNewHolding] = useState({
    account_id: "",
    name: "",
    purchase_date: "",
    amount_paid: "",
    maturity_date: "",
    rate: "",
    amount_at_maturity: "",
  });
  const [editingHolding, setEditingHolding] = useState(null);
  const [isUpdatingHolding, setIsUpdatingHolding] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchHoldings();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await client.models.Accounts.list();
      setAccounts(data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  const fetchHoldings = async () => { 
    try {
      const {data} = await  client.models.Holdings.list(); // Amplify.API.graphql({ query: listHoldings });
      setHoldings(data);
    } catch (err) {
      console.error("Error fetching holdings:", err);
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

  const addHolding = async () => { // HOLDINGS: Added
    try {
      const createdHolding = await client.models.Holdings.create({
        account_id: newHolding.account_id,
        name: newHolding.name,
        purchase_date: newHolding.purchase_date,
        amount_paid: parseFloat(newHolding.amount_paid),
        maturity_date: newHolding.maturity_date,
        rate: parseFloat(newHolding.rate),
        amount_at_maturity: parseFloat(newHolding.amount_at_maturity),
    });
      setHoldings((prevHoldings) => [...prevHoldings, createdHolding]);
      fetchHoldings();
      setNewHolding({
        account_id: "",
        name: "",
        purchase_date: "",
        amount_paid: "",
        maturity_date: "",
        rate: "",
        amount_at_maturity: "",
      });
    } catch (err) {
      console.error("Error adding holding:", err);
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

  const deleteHolding = async (id) => { // HOLDINGS: Added
    try {
      client.models.Holdings.delete({id});
      setHoldings((prevHoldings) => prevHoldings.filter((holding) => holding.id !== id));
    } catch (err) {
      console.error("Error deleting holding:", err);
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


  const updateHolding = async () => {
    setIsUpdatingHolding(true);
    try {
      const updatedData = {
        id: editingHolding.id,
        account_id: editingHolding.account_id,
        name: editingHolding.name,
        purchase_date: editingHolding.purchase_date,
        amount_paid: parseFloat(editingHolding.amount_paid),
        maturity_date: editingHolding.maturity_date,
        rate: parseFloat(editingHolding.rate),
        amount_at_maturity: parseFloat(editingHolding.amount_at_maturity),  
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

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="100%"
      margin="0 auto"
    >
      {/* Heading */}
      <Heading level={1}>GIC Tracker</Heading>

      {/* user info */}       
      <Flex
      className="tab-container"
      justifyContent="space-evenly"  // Distribute Buttons evenly
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
        justifyContent="space-evenly"  // Distribute Buttons evenly
        alignItems="center"
        width="100%"  // Ensure it spans the full width
      >
        <Button id="Accounts"
          className={`tablink ${activeTab === 'Accounts' ? 'active' : ''}`}
          onClick={() => openPage('Accounts')}
        >
          Accounts
        </Button>
        <Button id="Holdings"
          className={`tablink ${activeTab === 'Holdings' ? 'active' : ''}`}
          onClick={() => openPage('Holdings')}
        >
          Holdings
        </Button>
        <Button id="Ledger"
          className={`tablink ${activeTab === 'Ledger' ? 'active' : ''}`}
          onClick={() => openPage('Ledger')}
        >
          Ledger
        </Button>

        <Button id="About"
          className={`tablink ${activeTab === 'About' ? 'active' : ''}`}
          onClick={() => openPage('About')}
        >
          About
        </Button>
      </Flex>

      
      <Divider />

      {/* Tab Content */}
      <div id="Accounts" className={`tabcontent ${activeTab === 'Accounts' ? 'active' : ''}`}>
          <Flex key="acnts" direction="column" gap="1rem">
            <Heading level={2}>Accounts</Heading>
            <table>
            <thead>
              <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Birthdate</th>
              <th>Min Withdrawal Date</th>
              <th>Starting Balance</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.type}</td>
                <td>{account.birthdate}</td>
                <td>{account.min_withdrawal_date}</td>
                <td>{account.starting_balance}</td>
                <td><Button onClick={() => deleteAccount(account.id)}>Delete</Button>
                <Button onClick={() => setEditingAccount(account)}>Edit</Button>
                </td>
                </tr>
            ))}
            </tbody>
            </table>
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
        <Flex key="hld" direction="column" gap="1rem">
          <Heading level={2}>Holdings</Heading>
          <table>
            <thead>
              <tr>
              <th>Account ID</th>
              <th>Name</th>
              <th>Purchase Date</th>
              <th>Amount Paid</th>
              <th>Maturity Date</th>
              <th>Rate</th>
              <th>Amount at Maturity</th>
              <th>Actions</th>
              </tr>
            </thead>
            <tbody>

          {holdings.map((holding) => (
            <tr key={holding.id}>
              <td>{holding.account_id}</td>
              <td>{holding.name}</td>
              <td>{holding.purchase_date}</td>
              <td>{holding.amount_paid}</td>
              <td>{holding.maturity_date}</td>
              <td>{holding.rate}</td>
              <td>{holding.amount_at_maturity}</td>
              <td><Button onClick={() => setEditingHolding(holding)}>Edit</Button>
              <Button onClick={() => deleteHolding(holding.id)}>Delete</Button>
              </td>
            </tr>
          ))}

            </tbody>
          </table>
          <Divider />

          <Flex direction="column" gap="1rem">
            <Heading level={3}>
              {editingHolding ? "Edit Holding" : "Add New Holding"}
            </Heading>
            <TextField
              label="Account ID"
              value={editingHolding ? editingHolding.account_id : newHolding.account_id}
              onChange={(e) =>
                editingHolding
                  ? setEditingHolding({
                      ...editingHolding,
                      account_id: e.target.value,
                    })
                  : setNewHolding({
                      ...newHolding,
                      account_id: e.target.value,
                    })
              }
            />
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
        </Flex>
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
