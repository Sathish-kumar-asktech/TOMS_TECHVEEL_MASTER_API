import {
  Stack,
  TextField,
  useTheme,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  InputAdornment,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link, useNavigate } from "react-router-dom";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../axios";
import "./animation.css";

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: "white",
  fontWeight: "800",
  textAlign: "center",
  backgroundColor: "#4942E4",
  padding: "none",
  whiteSpace: "nowrap",
});

function formatDate(inputDateTime) {
  const isoDate = new Date(inputDateTime);

  const day = isoDate.getUTCDate().toString().padStart(2, "0");
  const month = (isoDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = isoDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

const ManageSalesInvoice = () => {
  // eslint-disable-next-line no-restricted-globals
  const navigate = useNavigate();
  const [tokent, settokent] = useState(
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ"
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  // handle snackbar & alert messages on save
  const [openAlert, setopenAlert] = useState(false);
  // At the beginning of the component
  const [openDelete, setOpenDelete] = useState(false);
  const [stateIdToDelete, setStateIdToDelete] = useState(null);
  const [InvoiceData, setInvoiceData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // alert messages on operations
  const [alertType, setAlertType] = useState("success"); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState("");
  const [openLoader, setOpenLoader] = useState(false);

  // API Integration
  useEffect(() => {
    getAllSalesInvoice();
  }, []);

  // get all Product Category  Request
  const getAllSalesInvoice = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllSalesInvoice", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setInvoiceData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // delete Request to delete state
  const deleteInvoice = async (DataId) => {
    try {
      await axios.instance
        .delete(`/DeleteSalesInvoice/${DataId}`, {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data === "") {
            getAllSalesInvoice();
            setOpenDelete(false);
            setAlertType("warning");
            setAlertMessage("Invoice Record Deleted, Successfully!");
            setopenAlert(true);
          } else {
            getAllSalesInvoice();
            setOpenDelete(false);
            setAlertType("error");
            setAlertMessage(
              "Oops! Can't delete this data. It's connected to other information."
            );
            setopenAlert(true);
          }
        });
    } catch (error) {
      console.error("Error deleting Record:", error);
      setAlertType("error");
      setAlertMessage("Failed to delete the Record.");
      setopenAlert(true);
    }
  };

  // new invoice handle
  const handleNewInvoice = () => {
    navigate("/transacation/SalesInvoice");
  };

  const EditSalesInvoice = (editID) => {
    // navigate(`/transacation/SalesInvoice/${editID}`);
  };

  // handle delete popup dialog
  const handleDelete = (admId) => {
    setOpenDelete(true);
    setStateIdToDelete(admId);
  };

  const handleDeleteConfirmed = (DataId) => {
    deleteInvoice(DataId);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  // search & filter
  const filteredData = InvoiceData.filter((enq) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return Object.values(enq.InvoiceNumber).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTermLowerCase);
      }
      return false;
    });
  });

  // pagination
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1));
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <>
      <Snackbar
        style={{ marginTop: "45px" }}
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={(props) => (
          <Slide {...props} direction={"right"} />
        )}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Container maxWidth={"xl"} sx={{ pt: 2 }} elevation={3} component={Paper}>
        {/* table header */}
        <Typography
          variant="h5"
          p={1}
          boxShadow={1}
          borderColor="#11009E"
          textAlign={"center"}
          border={0.5}
          borderRadius={1}
          my={2}
          color="#11009E"
        >
          Manage Sales Invoice
        </Typography>

        {/* search & add button */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
          my={3}
        >
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Search Invoice"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ boxShadow: 1, whiteSpace: "nowrap" }}
            onClick={handleNewInvoice}
            startIcon={<ReceiptIcon />}
          >
            New Sales Invoice
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ padding: "none" }}>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Invoice Number</StyledTableCell>
                <StyledTableCell>Invoice Date</StyledTableCell>
                <StyledTableCell>Supplier</StyledTableCell>
                <StyledTableCell>Po Ref Number</StyledTableCell>
                <StyledTableCell>Po Ref Date</StyledTableCell>
                <StyledTableCell>Invoice Amount</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredData
              ).map((data, index) => (
                <TableRow key={data.SalesInvoiceID} hover>
                  <TableCell align="center" padding="none">
                    {data.SNo}
                  </TableCell>
                  <TableCell align="center">{data.InvoiceNumber}</TableCell>
                  <TableCell align="center">
                    {formatDate(data.InvoiceDate)}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {data.SupplierName}
                  </TableCell>
                  <TableCell align="center">{data.PoRefNumber}</TableCell>
                  <TableCell align="center">
                    {formatDate(data.PoRefDate)}
                  </TableCell>
                  <TableCell align="center">₹ {data.netAmount}</TableCell>

                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{ padding: "0" }}
                  >
                    <IconButton
                      aria-label="Edit"
                      onClick={() =>
                        EditSalesInvoice(data.SalesInvoiceID)
                      }
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleDelete(data.SalesInvoiceID)}
                    >
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={currentPage} // Use the calculated currentPage value
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0); // Reset the page when rowsPerPage changes
          }}
          mt={2}
        />
      </Container>

      <Grid m={2}>
        {/* delete confirmation popup dialog box */}
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen={fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure want to Delete?"}
          </DialogTitle>
          <DialogActions>
            <Button
              variant="contained"
              autoFocus
              onClick={handleCloseDelete}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleDeleteConfirmed(stateIdToDelete)}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      {/* loader popup dialog box */}
      <Dialog
        open={openLoader}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <LinearProgress />
      </Dialog>
    </>
  );
};

export default ManageSalesInvoice;
