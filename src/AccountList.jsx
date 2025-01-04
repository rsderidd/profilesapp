import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const AccountList = ({ accounts, deleteAccount, setEditingAccount, handleViewHoldings, tabColor }) => {
  // Define your custom theme
  const theme = createTheme({
    mixins: {
      MuiDataGrid: {
        containerBackground: tabColor, // Customize the background for header
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
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "birthdate", headerName: "Birthdate", flex: 1 },
    { field: "min_withdrawal_date", headerName: "Min Withdrawal Date", flex: 1 },
    { field: "starting_balance", headerName: "Starting Balance", flex: 1, type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      minWidth: 350,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => deleteAccount(params.row.id)}>Delete</Button>
          <Button onClick={() => setEditingAccount(params.row)}>Edit</Button>
          <Button onClick={() => handleViewHoldings(params.row.id, params.row.name)}>View Holdings</Button>
        </div>
      ),
    },
  ];
  const columnVisibilityModel = {
    id: false, // Initially hidden
  };
  console.log("Accounts data:", accounts);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={accounts}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          columnVisibilityModel={columnVisibilityModel} // This controls visibility
        />
      </div>
    </ThemeProvider>
  );
};

export default AccountList;
