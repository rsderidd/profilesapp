import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Divider,
  SelectField,
  TextField,
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
import MaturingChart from './MaturingChart';

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
  const { user, signOut } = useAuthenticator();
  const [tabColor, setTabColor] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransactionAccount, setSelectedTransactionAccount] = useState(null);
  const [isDateFilterApplied, setIsDateFilterApplied] = useState(false);
  const [futurePayments, setFuturePayments] = useState(1); // Default to 1

  // Format the owner ID once
  const ownerId = user?.userId ? `${user.userId}::${user.userId}` : null;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Owner ID:", ownerId);  // Updated to log the formatted owner ID
  }, [user, ownerId]);

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
    const initializeData = async () => {
        try {
            await fetchAccounts();
            await fetchHoldings();
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    };
    initializeData();
}, []);

  
  // ***********************************************************
  // *******************general  
  // ***********************************************************


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
    handleViewHoldings,
    accounts,
    userId: ownerId,
 
  });

    // ***********************************************************
  // *******************accounts 
  // ***********************************************************

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
    userId: ownerId,
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

  const [dateFrom, setDateFrom] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  
  const [dateTo, setDateTo] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    nextYear.setMonth(11); // December
    nextYear.setDate(31); // End of the year
    return nextYear.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  
  useEffect(() => {
    const today = new Date();
    const endOfNextYear = new Date(today.getFullYear() + 1, 11, 31);
  
    // Set default date range
    setDateFrom(today.toISOString().split("T")[0]);
    setDateTo(endOfNextYear.toISOString().split("T")[0]);
  }, []);
  
  /*
  useEffect(() => {
    if (dateFrom && dateTo) {
      handleViewTransactions(
        selectedTransactionAccount?.id || 'all',
        selectedTransactionAccount?.name || null
      );
    }
  }, [dateFrom, dateTo]);
*/

  const [transactionFilterOption, setTransactionFilterOption] = useState('allTransactions'); // Default to 'All Transactions'

  const handleFilterChange = (event) => {
    setTransactionFilterOption(event.target.value);
    setIsDateFilterApplied(false);
    
    if (event.target.value === 'dateRange') {
        // When switching to date range, use existing dates or set defaults
        if (!dateFrom || !dateTo) {
            const today = new Date();
            const nextYear = new Date(today.getFullYear() + 1, 11, 31);
            setDateFrom(today.toISOString().split('T')[0]);
            setDateTo(nextYear.toISOString().split('T')[0]);
        }
    } else {
        // If 'All Transactions' is selected, filter by account if one is selected
        const filteredByAccount = selectedTransactionAccount?.id 
            ? allTransactions.filter(transaction => transaction.account_id === selectedTransactionAccount.id)
            : allTransactions;

        const transactionsWithAccounts = filteredByAccount.map((transaction) => {
            const account = accounts.find((acc) => acc.id === transaction.account_id);
            const accountName = account ? account.name : "Unknown Account";
            return { ...transaction, accountName };
        });
        setFilteredTransactions(transactionsWithAccounts);
    }
  };

  const handleApplyDateFilter = () => {

    // Do the filtering directly here instead of relying on state updates
    const filterCriteria = {
        accountId: selectedTransactionAccount?.id !== 'all' ? selectedTransactionAccount?.id : null,
        dateRange: { 
            from: dateFrom,
            to: dateTo
        }
    };

    // First filter the transactions
    const filtered = filterTransactions(allTransactions, filterCriteria);
    
    // Then add account names to the filtered transactions
    const filteredWithAccounts = filtered.map((transaction) => {
        const account = accounts.find((acc) => acc.id === transaction.account_id);
        const accountName = account ? account.name : "Unknown Account";
        return { ...transaction, accountName };
    });

    setFilteredTransactions(filteredWithAccounts);
    setIsDateFilterApplied(true);
  };

  // Map transactions with account names
  const modifiedTransactions = allTransactions.map((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.account_id); // Find the account by ID
    const accountName = account ? account.name : "Unknown Account"; // Fallback if account is not found
    // console.log(`Mapping holding: ${holding.id}, accountName: ${accountName}`); // Debugging log
    return { ...transaction, accountName }; // Add accountName to the holding
  });

  const handleViewTransactions = async (accountId, accountName) => {
    try {
        setSelectedTransactionAccount(
            accountId === 'all' || accountId === null
                ? null
                : { id: accountId, name: accountName }
        );
        
        openPage("Ledger");

        // Create filter criteria
        const filterCriteria = {
            accountId: accountId !== 'all' ? accountId : null,
            dateRange: (transactionFilterOption === 'dateRange' && isDateFilterApplied)
                ? { 
                    from: dateFrom,
                    to: dateTo
                }
                : null
        };

        // First filter the transactions
        const filtered = filterTransactions(allTransactions, filterCriteria);
        
        // Then add account names to the filtered transactions
        const filteredWithAccounts = filtered.map((transaction) => {
            const account = accounts.find((acc) => acc.id === transaction.account_id);
            const accountName = account ? account.name : "Unknown Account";
            return { ...transaction, accountName };
        });

        setFilteredTransactions(filteredWithAccounts);
    } catch (err) {
        console.error("Error filtering Transactions:", err);
    }
  };

  const transactionOperations = useTransactionOperations({
    transactions: allTransactions,
    setAllTransactions,
    setFilteredTransactions,
    client,
    setSelectedTransactionAccount,
    selectedTransactionAccount,
    handleViewTransactions,
    accounts,
    transactionFilterOption,
    isDateFilterApplied,
    dateFrom,
    dateTo,
    futurePayments,
    holdings,
    userId: ownerId,
 
  });

  // Destructure deleteTransaction from the hook
  const { 
    editingTransaction, 
    setEditingTransaction, 
    isUpdatingTransaction, 
    fetchTransactions, 
    filterTransactions, 
    addTransaction, 
    deleteTransaction,  // Add this
    updateTransaction 
  } = transactionOperations;

  // ***********************************************************
  //  ******************* Reports
  // ***********************************************************

  const prepareChartData = (accounts, holdings) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const labels = []; // Array to hold month labels
    const datasets = []; // Array to hold datasets for each account

    // Generate month labels
    for (let i = 0; i < 12; i++) {
        const month = new Date(currentYear, (currentMonth + i) % 12, 1).toLocaleString('default', { month: 'long' });
        labels.push(month);
    }

    // Prepare datasets for each account
    accounts.forEach((account) => {
        const accountData = {
            accountName: account.name,
            amounts: new Array(12).fill(0), // Initialize amounts for each month
            color: account.color || 'rgba(75, 192, 192, 0.2)', // Default color
        };

        holdings.forEach((holding) => {
            const transactionDate = new Date(holding.maturity_date);
            const monthIndex = transactionDate.getMonth() - currentMonth + 12; // Adjust index based on current month
            if (monthIndex >= 0 && monthIndex < 12) {
                accountData.amounts[monthIndex] += parseFloat(holding.amount_at_maturity); // Sum amounts for the month
            }
        });

        datasets.push(accountData);
    });

    return { labels, datasets };
  };

  const chartData = prepareChartData(accounts, holdings);

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
            <Heading level="3">{userprofile.email} </Heading>
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
              handleViewTransactions={handleViewTransactions}
              tabColor={tabColor}
              transactions={allTransactions}
              holdings={holdings}
              userId={ownerId}
            />
            <AccountForm 
              editingAccount={editingAccount} 
              setEditingAccount={setEditingAccount} 
              isUpdating={isUpdating} 
              updateAccount={updateAccount} 
              addAccount={addAccount} 
            />
            <div>
               <h2>Account Maturing Amounts</h2>
               <MaturingChart data={chartData} />
               {/* Other account list content */}
            </div>
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
              <option key="all" value="all">All Accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </SelectField>

            <div>
              <input
                type="radio"
                id="allTransactions"
                name="transactionFilter"
                value="allTransactions"
                checked={transactionFilterOption === 'allTransactions'}
                onChange={handleFilterChange}
              />
              <label htmlFor="allTransactions">All Transactions</label>

              <input
                type="radio"
                id="dateRange"
                name="transactionFilter"
                value="dateRange"
                checked={transactionFilterOption === 'dateRange'}
                onChange={handleFilterChange}
              />
              <label htmlFor="dateRange">Date Range</label>
            </div>

            {transactionFilterOption === 'dateRange' && (
              <Flex direction="column" gap="1rem">
                <Flex gap="1rem">
                    <label>
                        From:
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </label>

                    <label>
                        To:
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </label>
                </Flex>
                <Button onClick={handleApplyDateFilter}>Apply Date Filter</Button>
              </Flex>
            )}

            <div style={{ marginTop: '1rem' }}>
              <label style={{ marginRight: '1rem' }}>
                Future Minimum Payments:
                <input
                  type="number"
                  min="0"
                  value={futurePayments}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1; // Ensure at least 1
                    setFuturePayments(value);
                  }}
                  style={{ marginLeft: '0.5rem', width: '60px' }}
                />
              </label>
            </div>

            <TransactionList 
                transactions={filteredTransactions}
                allTransactions={allTransactions}
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
        <p>Alerts for: </p>
          <ul>
            <li>TSFA account over 100k </li>
            <li>Holdings over 100k, totalled across all RRIF accounts, same Holding name</li>
          </ul>
        <p>Notes:</p>
          <ul>
            <li>Birthdate is for minimum withdrawl calculation</li>
            <li>Minimum withdrawl is for RRIFs after age 65</li>
          </ul>
      </div>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
