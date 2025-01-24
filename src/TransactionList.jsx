import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const TransactionList = ({ Transactions, deleteTransaction, setEditingTransaction, tabColor }) => {
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
    { field: "accountName", headerName: "Account Name", flex: 1, minWidth: 150 },
    { field: "type", headerName: "Type", flex: 1, minWidth: 150 },
    { field: "xtn_date", headerName: "Transaction Date", flex: 1, minWidth: 100 },
    { field: "amount", headerName: "Amount", flex: 1, type: "number", minWidth: 100  },
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

  // Calculate total amount
  const totalAmount = Transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={Transactions}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [
                { field: 'xtn_date', sort: 'asc' }, // Sort by 'Transaction Date' in descending order
              ],
            },
          }}
        />
      </div>
      {/* Total Line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #ccc",
          marginTop: "-1px", // Optional to align with DataGrid border
        }}
      >
        <strong>Total Transactions: {Transactions.length}</strong>
        <strong>Total Amount: ${totalAmount.toFixed(2)}</strong>
      </div>

    </ThemeProvider>
  );
};

export default TransactionList;
