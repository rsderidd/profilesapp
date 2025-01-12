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
import AccountList from "./AccountList";
import HoldingList from "./HoldingList";
import AccountForm from './AccountForm';
import HoldingForm from './HoldingForm';
import TransactionList from "./TransactionList";
import TransactionForm from './TransactionForm';
import { useAccountOperations } from './accountOperations';
import { useHoldingOperations } from './HoldingOperations';
import { useTransactionOperations } from './TransactionOperations';

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
  
  
  useEffect(() => {
    fetchAccounts();
    fetchHoldings();
    fetchTransactions();
  }, []);

  // ***********************************************************
  // *******************general  
  // ***********************************************************

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [holdings, setHoldings] = useState([]);

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
  
  // ***********************************************************
  // *******************Holdings  
  // ***********************************************************

  const {
    fetchHoldings,
    addHolding,
    updateHolding,
    deleteHolding,
    editingHolding,
    setEditingHolding,
    isUpdatingHolding,
  } = useHoldingOperations({
    holdings,
    setHoldings,
    client,
    setSelectedAccount, 
    selectedAccount,
    handleViewHoldings
  });

    // ***********************************************************
  // *******************accounts 
  // ***********************************************************
  const [accounts, setAccounts] = useState([]);

  const {
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    editingAccount,
    setEditingAccount,
    isUpdating,
  } = useAccountOperations({
    accounts,
    setAccounts,
    client,
  });

  // Map holdings with account names
  const modifiedHoldings = holdings.map((holding) => {
    const account = accounts.find((acc) => acc.id === holding.account_id); // Find the account by ID
    const accountName = account ? account.name : "Unknown Account"; // Fallback if account is not found
    // console.log(`Mapping holding: ${holding.id}, accountName: ${accountName}`); // Debugging log
    return { ...holding, accountName }; // Add accountName to the holding
  });

  
  // ***********************************************************
  //  *******************Transactions
  // ***********************************************************
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionAccount, setSelectedTransactionAccount] = useState(null);

  
  // Map transactions with account names
  const modifiedTransactions = transactions.map((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.account_id); // Find the account by ID
    const accountName = account ? account.name : "Unknown Account"; // Fallback if account is not found
    // console.log(`Mapping holding: ${holding.id}, accountName: ${accountName}`); // Debugging log
    return { ...transaction, accountName }; // Add accountName to the holding
  });


  const handleViewTransactions = async (accountId, accountName) => {
    try {
      if (accountId === 'all' || accountId === null) {
        setSelectedTransactionAccount(null);  // You can also reset it to { id: null, name: "All Holdings" } if you prefer
      } else {
        setSelectedTransactionAccount({ id: accountId, name: accountName });
      }
      //setActiveTab("Transactions");
      openPage("Ledger");

      const filter = accountId && accountId !== 'all' 
      ? { account_id: { eq: accountId } } 
      : {};  // No filter for "All Transactions"

      // Filter Transactions by account ID
      const { data } = await client.models.Transactions.list({
        filter,
      });

      setTransactions(data);
    } catch (err) {
      console.error("Error filtering Transactions:", err);
    }
  };

  const {
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    editingTransaction,
    setEditingTransaction,
    isUpdatingTransaction,
  } = useTransactionOperations({
    transactions,
    setTransactions,
    client,
    setSelectedTransactionAccount,
    selectedTransactionAccount,
    handleViewTransactions
  });
  
  // ***********************************************************
  //  ******************* MAIN LAYOUT
  // ***********************************************************
 

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
        <Flex key="ldg" direction="column" gap="1rem">
          <Heading level={2}>Ledger</Heading>
    
            <SelectField
              key="sctaccnt"
              label="Select Account"
              value={selectedTransactionAccount ? selectedTransactionAccount.id : 'all'}
              onChange={(e) => {
                const selectedTransactionAccountId = e.target.value;
                const selectedTransactionAccountName = selectedTransactionAccountId === 'all' ? null : accounts.find(account => account.id === selectedTransactionAccountId)?.name;
                handleViewTransactions(selectedTransactionAccountId, selectedTransactionAccountName);
              }}
            >
              <option key="all" value="all">All Transactions</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </SelectField>

            <TransactionList 
                key ="ldglst"
                Transactions={modifiedTransactions} 
                deleteTransaction={deleteTransaction} 
                setEditingTransaction={setEditingTransaction} 
                tabColor={tabColor} 
            />
              
          <Divider />

          <TransactionForm 
              editingTransaction={editingTransaction} 
              setEditingTransaction={setEditingTransaction} 
              isUpdatingTransaction={isUpdatingTransaction} 
              updateTransaction={updateTransaction} 
              addTransaction={addTransaction} 
              selectedTransactionAccount={selectedTransactionAccount}
              accounts={accounts}
            />

        </Flex>
      </div>
    
      <div id="About" className={`tabcontent ${activeTab === 'About' ? 'active' : ''}`}>
        <h3>About</h3>
        <p>Who we are and what we do.</p>
      </div>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
