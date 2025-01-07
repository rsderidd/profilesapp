import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Divider,
  SelectField,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import './App.css';
import { createAccounts, createHoldings, deleteAccounts, deleteHoldings, updateAccounts, updateHoldings } from "../amplify/auth/post-confirmation/graphql/mutations"; 
import { listAccounts, listHoldings } from "../amplify/auth/post-confirmation/graphql/queries"; 
import AccountList from "./AccountList";
import HoldingList from "./HoldingList";
import AccountForm from './AccountForm';
import HoldingForm from './HoldingForm';

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
  const [tabColor, setTabColor] = useState();
  const [editingAccount, setEditingAccount] = useState(null); // Add editingAccount state

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
  
    // Dynamically fetch the CSS variable for the active tab's color
    const activeTabElement = document.getElementById(pageName);
    const tabColor = activeTabElement 
      ? getComputedStyle(activeTabElement).getPropertyValue("--tab-color").trim()
      : "#343434"; // Default fallback color
  
    setTabColor(tabColor); // Set the tab color in state
  };
  
  const [isUpdating, setIsUpdating] = useState(false);

  const [accounts, setAccounts] = useState([]);

  // Holdings State 
  const [holdings, setHoldings] = useState([]);

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
      setSelectedAccount(null)
      setHoldings(data);
    } catch (err) {
      console.error("Error fetching holdings:", err);
    }
  };

  // Map holdings with account names
  const modifiedHoldings = holdings.map((holding) => {
    const account = accounts.find((acc) => acc.id === holding.account_id); // Find the account by ID
    const accountName = account ? account.name : "Unknown Account"; // Fallback if account is not found
    // console.log(`Mapping holding: ${holding.id}, accountName: ${accountName}`); // Debugging log
    return { ...holding, accountName }; // Add accountName to the holding
  });

  const addAccount = async (addedAccount) => {
    console.log("new account:", addedAccount);   
    try {
      const createdAccount = await client.models.Accounts.create({
        ...addedAccount,
        starting_balance: parseFloat(addedAccount.starting_balance),
      });
      const caccount = createdAccount.data || createdAccount

      setAccounts((prevAccounts) => [...prevAccounts, caccount]);
      fetchAccounts(); // Refreshes the list after adding
    } catch (err) {
      console.error("Error adding account:", err);
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

  const updateAccount = async (updatedAccount) => {
    setIsUpdating(true);
    try {

      // Prepare the updated data for the account
      const updatedData = {
        id: updatedAccount.id, // Required for update
        name: updatedAccount.name,
        type: updatedAccount.type,
        birthdate: updatedAccount.birthdate,
        min_withdrawal_date: updatedAccount.min_withdrawal_date,
        starting_balance: parseFloat(updatedAccount.starting_balance),
      };
  
      console.log("Payload for update:", updatedData);

      // Prepare the condition for the update (if needed)
      // const condition = {};  // You can add condition logic here if necessary
  
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
  
     } catch (err) {
      console.error("Error updating account:", err);
      alert("Failed to update the account. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleViewHoldings = async (accountId, accountName) => {
    try {
      if (accountId === 'all' || accountId === null) {
        setSelectedAccount(null);  // You can also reset it to { id: null, name: "All Holdings" } if you prefer
      } else {
        setSelectedAccount({ id: accountId, name: accountName });
      }
      //setActiveTab("Holdings");
      openPage("Holdings");

      const filter = accountId && accountId !== 'all' 
      ? { account_id: { eq: accountId } } 
      : {};  // No filter for "All Holdings"

      // Filter holdings by account ID
      const { data } = await client.models.Holdings.list({
        filter,
      });

      setHoldings(data);
    } catch (err) {
      console.error("Error filtering holdings:", err);
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
            <AccountList 
              accounts={accounts} 
              deleteAccount={deleteAccount} 
              setEditingAccount={setEditingAccount} 
              handleViewHoldings={handleViewHoldings}
              tabColor={tabColor} 
            />
            <AccountForm 
              editingAccount={editingAccount} 
              setEditingAccount={setEditingAccount} 
              isUpdating={isUpdating} 
              updateAccount={updateAccount} 
              addAccount={addAccount} 
            />
          </Flex>
      </div>
    
      <div  id="Holdings" className={`tabcontent ${activeTab === 'Holdings' ? 'active' : ''}`}>
        <Flex key="hld" direction="column" gap="1rem">
          <Heading level={2}>Holdings</Heading>
          
          {/** 
          {selectedAccount && (
            <Heading level={3}>
              {selectedAccount ? `Holdings for ${selectedAccount.name} ${selectedAccount.id}` : "All Holdings"} 
              <Button onClick={fetchHoldings}>View All Holdings</Button>
            </Heading>
          )}
          **/}

            <SelectField
              key="sctaccnt"
              label="Select Account"
              value={selectedAccount ? selectedAccount.id : 'all'}
              onChange={(e) => {
                const selectedAccountId = e.target.value;
                const selectedAccountName = selectedAccountId === 'all' ? null : accounts.find(account => account.id === selectedAccountId)?.name;
                handleViewHoldings(selectedAccountId, selectedAccountName);
              }}
            >
              <option key="all" value="all">All Holdings</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </SelectField>

            <HoldingList 
                key ="hldlst"
                holdings={modifiedHoldings} 
                deleteHolding={deleteHolding} 
                setEditingHolding={setEditingHolding} 
                tabColor={tabColor} 
            />
              
          <Divider />

          <HoldingForm 
              editingHolding={editingHolding} 
              setEditingHolding={setEditingHolding} 
              isUpdatingHolding={isUpdatingHolding} 
              updateHolding={updateHolding} 
              addHolding={addHolding} 
              selectedAccount={selectedAccount}
              accounts={accounts}
            />

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
