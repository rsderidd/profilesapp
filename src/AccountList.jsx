import React, { useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FaExclamationTriangle } from 'react-icons/fa';

const AccountList = ({ accounts, deleteAccount, setEditingAccount, handleViewHoldings, handleViewTransactions, tabColor, transactions = [], holdings = [] }) => {
  // Calculate current balance for each account
  const balances = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    
    return transactions
      .filter(transaction => transaction.xtn_date <= today)  // Only include transactions up to today
      .reduce((acc, transaction) => {
        const amount = typeof transaction.amount === 'string' 
          ? parseFloat(transaction.amount) 
          : transaction.amount;
        if (!isNaN(amount)) {
          acc[transaction.account_id] = (acc[transaction.account_id] || 0) + amount;
        }
        return acc;
      }, {});
  }, [transactions]);

  // Calculate RRIF holding totals by name
  const rrifHoldingTotals = useMemo(() => {
    const totals = {};
    holdings.forEach(holding => {
      const account = accounts.find(acc => acc.id === holding.account_id);
      if (account?.type === 'RRIF' && holding.name) {
        totals[holding.name] = (totals[holding.name] || 0) + parseFloat(holding.amount_paid || 0);
      }
    });
    return totals;
  }, [holdings, accounts]);

  // Check if account has holdings that exceed RRIF limits
  const hasExcessiveHoldings = useCallback((accountId) => {
    const accountHoldings = holdings.filter(h => h.account_id === accountId);
    return accountHoldings.some(holding => {
      const totalForHolding = rrifHoldingTotals[holding.name] || 0;
      return totalForHolding > 100000;
    });
  }, [holdings, rrifHoldingTotals]);

  // Define your custom theme
  const theme = createTheme({
    mixins: {
      MuiDataGrid: {
        containerBackground: tabColor, // Customize the background for header
      },
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-columnHeader': {
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              textOverflow: 'clip', // Prevent text truncation
              overflow: 'visible', // Ensure wrapping works
            },
          },
        },
      },
    },
  
  });

  const columns = [
    { 
      field: "id", 
      headerName: "Hidden Column", 
      hide: true,  // This makes the column invisible
      flex: 1 
    },
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => {
        const balance = balances[params.row.id] || 0;
        const isTFSAOverLimit = params.row.type === 'TFSA' && balance > 100000;
        const hasRRIFWarning = hasExcessiveHoldings(params.row.id);
        
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {(isTFSAOverLimit || hasRRIFWarning) && (
              <div style={{ 
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.5rem'
              }}>
                <FaExclamationTriangle 
                  style={{ 
                    color: 'red',
                    width: '100%',
                    height: '100%'
                  }} 
                  title={isTFSAOverLimit 
                    ? `TFSA balance exceeds $100,000 (Current: ${balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`
                    : `Account has holdings that exceed RRIF limits`} 
                />
              </div>
            )}
            <span style={{ 
              cursor: 'pointer',
              textDecoration: 'underline',
              color: isTFSAOverLimit ? 'red' : 'blue',
              fontWeight: isTFSAOverLimit ? 'bold' : 'normal'
            }}
            onClick={() => handleViewTransactions(params.row.id, params.row.name)}>
              {params.value}
            </span>
          </div>
        );
      }
    },
    { field: "type", headerName: "Type", flex: 1, minWidth: 75 },
    { field: "birthdate", headerName: "Birthdate", flex: 1, minWidth: 100 },
    { 
      field: "min_withdrawal_date", 
      headerName: "Min Withdrawal Date", 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => {
          const date = params.value; // Get the full date from the account
          if (date) {
              const month = new Date(date).toLocaleString('default', { month: 'short' }); // Get the month in short format
              const day = new Date(date).getDate(); // Get the day
              return `${month}-${day < 10 ? '0' + day : day}`; // Format as MON-DD
          }
          return ''; // Return empty if no date
      }
    },
    { field: "starting_balance", headerName: "Starting Balance", flex: 1, type: "number", minWidth: 100 },
    { 
      field: "currentBalance", 
      headerName: "Current Balance", 
      flex: 1, 
      minWidth: 100,
      type: 'number',
      renderCell: (params) => {
        const balance = balances[params.row.id] || 0;
        return balance.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      minWidth: 350,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => {
            if (window.confirm('Are you sure you want to delete this account? This will also delete all associated holdings and transactions.')) {
              deleteAccount(params.row.id);
            }
          }}>Delete</Button>
          <Button onClick={() => setEditingAccount(params.row)}>Edit</Button>
          <Button onClick={() => handleViewHoldings(params.row.id, params.row.name)}>View Holdings</Button>
        </div>
      ),
    },
  ];
  const columnVisibilityModel = {
    id: false, // Initially hidden
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={accounts}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          columnVisibilityModel={columnVisibilityModel}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [
                { field: 'name', sort: 'asc' }, 
              ],
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default AccountList;
