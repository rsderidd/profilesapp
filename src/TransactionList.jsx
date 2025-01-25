import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const TransactionList = ({ transactions, deleteTransaction, setEditingTransaction, tabColor, allTransactions }) => {
  // Calculate running totals for each account using ALL transactions
  const calculateRunningTotals = (displayTransactions, allTransactions) => {
    // First sort all transactions by date and then by ID to handle same-date transactions
    const sortedAllTransactions = [...allTransactions].sort((a, b) => {
      const dateCompare = new Date(a.xtn_date) - new Date(b.xtn_date);
      return dateCompare !== 0 ? dateCompare : a.id.localeCompare(b.id);
    });

    // Create a map to store running totals for each account
    const accountTotals = {};

    // Create a map of running totals at each transaction for each account
    const runningTotalsByKey = {};
    sortedAllTransactions.forEach(transaction => {
      const accountId = transaction.account_id;
      accountTotals[accountId] = (accountTotals[accountId] || 0) + parseFloat(transaction.amount || 0);
      // Use both date and ID as key to handle same-date transactions
      runningTotalsByKey[`${accountId}-${transaction.xtn_date}-${transaction.id}`] = accountTotals[accountId];
    });

    // Map the running totals to the displayed transactions
    return displayTransactions.map(transaction => ({
      ...transaction,
      runningTotal: runningTotalsByKey[`${transaction.account_id}-${transaction.xtn_date}-${transaction.id}`] || 0
    }));
  };

  // Add running totals to transactions
  const transactionsWithTotals = calculateRunningTotals(transactions, allTransactions);

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
    <ThemeProvider theme={theme}>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={transactionsWithTotals}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: 'xtn_date', sort: 'asc' }],
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default TransactionList;
