import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@aws-amplify/ui-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FaExclamationTriangle } from 'react-icons/fa';

const HoldingList = ({ holdings, deleteHolding, setEditingHolding, tabColor }) => {
  // Calculate total purchase amount for each holding name across RRIF accounts
  const holdingTotals = useMemo(() => {
    const totals = {};
    holdings.forEach(holding => {
      // Only include holdings from RRIF accounts
      if (holding.accountType === 'RRIF' && holding.name) {
        totals[holding.name] = (totals[holding.name] || 0) + parseFloat(holding.amount_paid || 0);
      }
    });
    return totals;
  }, [holdings]);

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
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const isRRIF = params.row.accountType === 'RRIF';
        const totalAmount = holdingTotals[params.row.name] || 0;
        const exceedsLimit = isRRIF && totalAmount > 100000;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {exceedsLimit && (
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
                  title={`Total value across RRIF accounts exceeds $100,000 (Current: ${totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`} 
                />
              </div>
            )}
            <span style={{ 
              color: exceedsLimit ? 'red' : 'inherit',
              fontWeight: exceedsLimit ? 'bold' : 'normal'
            }}>
              {params.value}
            </span>
          </div>
        );
      }
    },
    { field: "purchase_date", headerName: "Purchase Date", flex: 1, minWidth: 100 },
    { field: "amount_paid", headerName: "Amount Paid", flex: 1, type: "number", minWidth: 100  },
    { field: "maturity_date", headerName: "Maturity Date", flex: 1, minWidth: 100 },
    { field: "rate", headerName: "Rate", flex: 1 ,type: "number", minWidth: 100 },
    { field: "amount_at_maturity", headerName: "Amount At Maturity", flex: 1 ,type: "number", minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      filterable: false,
      minWidth: 250,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => {
            if (window.confirm('Are you sure you want to delete this holding? This will also delete any associated transactions.')) {
              deleteHolding(params.row.id);
            }
          }}>Delete</Button>
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
          disableRowSelectionOnClick
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

export default HoldingList;
