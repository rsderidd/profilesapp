import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const HoldingList = ({ holdings, deleteHolding, setEditingHolding, tabColor }) => {
  // Define your custom theme
  const theme = createTheme({
    mixins: {
      MuiDataGrid: {
        containerBackground: tabColor, // Customize the background for header
      },
    },
  });

  const columns = [
    { field: "accountName", headerName: "Account Name", flex: 1, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "purchase_date", headerName: "Purchase Date", flex: 1 },
    { field: "amount_paid", headerName: "Amount Paid", flex: 1, type: "number" },
    { field: "maturity_date", headerName: "Maturity Date", flex: 1 },
    { field: "rate", headerName: "Rate", flex: 1 },
    { field: "amount_at_maturity", headerName: "Amount At Maturity", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      minWidth: 250,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => deleteHolding(params.row.id)}>Delete</Button>
          <Button onClick={() => setEditingHolding(params.row)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={holdings}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>
    </ThemeProvider>
  );
};

export default HoldingList;
