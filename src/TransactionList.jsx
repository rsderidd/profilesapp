import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const TransactionList = ({ transactions, deleteTransaction, setEditingTransaction, tabColor }) => {
  // Calculate running totals for each account
  const calculateRunningTotals = (transactions) => {
    // Create a copy of the transactions array
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.xtn_date) - new Date(b.xtn_date)
    );

    // Create a map to store running totals for each account
    const accountTotals = {};

    // Calculate running totals
    return sortedTransactions.map(transaction => ({
      ...transaction,
      runningTotal: (accountTotals[transaction.account_id] = 
        (accountTotals[transaction.account_id] || 0) + parseFloat(transaction.amount || 0))
    }));
  };

  // Add running totals to transactions
  const transactionsWithTotals = calculateRunningTotals(transactions);

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
    { field: "accountName", headerName: "Account Name", flex: 1, minWidth: 150 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 150 },
    { field: "xtn_date", headerName: "Transaction Date", flex: 1, minWidth: 100 },
    { 
      field: "amount", 
      headerName: "Amount", 
      flex: 1, 
      type: "number", 
      minWidth: 100,
      valueFormatter: (params) => {
        const amount = typeof params === 'string' ? parseFloat(params) : params;
        if (amount == null || isNaN(amount)) return '';
        return amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        });
      }
    },
    { 
      field: "runningTotal", 
      headerName: "Running Total", 
      flex: 1, 
      type: "number", 
      minWidth: 100,
      valueFormatter: (params) => {
        const amount = typeof params === 'string' ? parseFloat(params) : params;
        if (amount == null || isNaN(amount)) return '';
        return amount.toLocaleString('en-US', {
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
      minWidth: 250,
      renderCell: (params) => {
        if (params.row.isGenerated) {
          // Hide buttons for generated transactions
          return null;
        }
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => {
              if (window.confirm('Are you sure you want to delete this transaction?')) {
                deleteTransaction(params.row.id);
              }
            }}>Delete</Button>
            <Button onClick={() => setEditingTransaction(params.row)}>Edit</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={transactionsWithTotals}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </ThemeProvider>
    </div>
  );
};

export default TransactionList;
