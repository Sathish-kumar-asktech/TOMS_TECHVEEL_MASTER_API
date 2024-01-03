import {
  Stack,
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  LinearProgress,
  FormControl,
  Autocomplete,
  Grow,
  Collapse,
  Snackbar,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slide,
  IconButton,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LockResetIcon from "@mui/icons-material/LockReset";
import numeral from "numeral";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "../../axios";

function formatDate(inputDateTime) {
  const isoDate = new Date(inputDateTime);

  const day = isoDate.getUTCDate().toString().padStart(2, "0");
  const month = (isoDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = isoDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: "#DDE6ED",
  fontWeight: "800",
  textAlign: "center",
  backgroundColor: "#3081D0",
  padding: "none",
  whiteSpace: "nowrap",
});

const formatDateToinitialValues = (date) => {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calculateOverallNetAmount = (invoices) => {
  let overallNetAmount = 0;
  invoices.forEach((invoice) => {
    overallNetAmount += parseFloat(invoice.netAmount);
  });
  return overallNetAmount;
};

const MISSalesInvoice = () => {
  // eslint-disable-next-line no-restricted-globals
  const [tokent, settokent] = useState(
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ"
  );

  const [openLoader, setOpenLoader] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setopenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [openPreview, setopenPreview] = useState(false);
  const [showNoResultsSnackbar, setShowNoResultsSnackbar] = useState(false);
  const noResultsMessage = "No results found for the applied filters.";

  const [SalesInvoiceData, setSalesInvoiceData] = useState([]);
  const [OneSalesInvoiceData, setOneSalesInvoiceData] = useState([]);
  const [SalesDetailsData, setSalesDetailsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [CustomerName, setCustomerName] = useState({
    initialCustomerName: "All Customers",
  });
  const [allCustomerData, setallCustomerData] = React.useState([]);
  const [overallNetAmount, setOverallNetAmount] = useState(0);
  const [TotalBills, setTotalBills] = useState(0);
  const [checked, setChecked] = React.useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [dateValidation, setDateValidation] = useState({
    fromDate: false,
    toDate: false,
  });

  const currentDate = new Date();
  const fromDateOnCurrentMonth = new Date(currentDate);
  fromDateOnCurrentMonth.setDate(1);

  const initialFromDate = formatDateToinitialValues(fromDateOnCurrentMonth);
  const initialToDate = formatDateToinitialValues(currentDate);

  const [filters, setFilters] = useState({
    fromDate: initialFromDate,
    toDate: initialToDate,
    CustomerName: "",
  });

  const resetFilters = () => {
    console.log("Reset button clicked");
    setFilters({
      fromDate: "",
      toDate: "",
      CustomerName: "",
    });
    setFilteredData([]);
    setCustomerName(null);
    setCustomerName({ initialCustomerName: "All Customers" });
    setOverallNetAmount(0);
    setTotalBills(0);
  };

  // API Integration
  useEffect(() => {
    getAllSalesInvoice();
    GetAllCustomer();
    formatDateToinitialValues();
  }, []);

  // get all getAllSalesInvoice  Request
  const getAllSalesInvoice = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllSalesInvoiceMIS", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setSalesInvoiceData(res.data);

      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all GetAllCustomer Request
  const GetAllCustomer = async () => {
    try {
      const res = await axios.instance.get("/GetAllCustomer", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setallCustomerData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetOneSalesDetails = async (Detailsid) => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get(`/GetOneSalesDetails/${Detailsid}`, {
        headers: {
          Authorization: tokent,
          "Content-Type": "application/json",
        },
      });
      setSalesDetailsData(res.data);
      if (res.data.length > 0) setopenPreview(true);
      console.log("InvoiceData", res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const totalQuantity = SalesDetailsData.reduce(
    (total, product) => total + parseInt(product.Quantity),
    0
  );
  const totalRate = SalesDetailsData.reduce(
    (total, product) =>
      total + parseInt(product.Rate) * parseInt(product.Quantity),
    0
  );
  const totalDiscount = SalesDetailsData.reduce(
    (total, product) => total + parseInt(product.Discount),
    0
  );
  const totalNetAmount = SalesDetailsData.reduce(
    (total, product) => total + parseInt(product.netAmount),
    0
  );

  const handleCheckboxChange = (e) => {
    setShowDateInputs(e.target.checked);
    setChecked((prev) => !prev);
    resetFilters();
    if (!e.target.checked) {
      setFilters({ fromDate: "", toDate: "" });
      setDateValidation({ fromDate: false, toDate: false });
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  };

  const handleDateChange = (field, value) => {
    setFilters({ ...filters, [field]: value });

    if (showDateInputs && !isValidDate(value)) {
      setDateValidation({ ...dateValidation, [field]: true });
    } else {
      setDateValidation({ ...dateValidation, [field]: false });
    }
  };

  const applyFilters = () => {
    const dateValidation = {
      fromDate: false,
      toDate: false,
    };

    // Validate dates if date inputs are visible
    if (showDateInputs) {
      // Validate fromDate
      if (!isValidDate(filters.fromDate)) {
        dateValidation.fromDate = true;
      }

      // Validate toDate
      if (!isValidDate(filters.toDate)) {
        dateValidation.toDate = true;
      }

      // Check if To Date is not less than From Date
      if (new Date(filters.fromDate) > new Date(filters.toDate)) {
        dateValidation.fromDate = true;
        dateValidation.toDate = true;
        setDateValidation(dateValidation);
        return;
      }

      // If any date validation fails, update UI and return
      if (dateValidation.fromDate || dateValidation.toDate) {
        setDateValidation(dateValidation);
        return;
      }
    }

    setDateValidation({ fromDate: false, toDate: false });

    const filteredDataTable = SalesInvoiceData.filter((enq) => {
      const nameFilterLowerCase = filters.CustomerName;
      console.log("nameFilterLowerCase", filters.CustomerName);

      const nameFilterPassed =
        !filters.CustomerName ||
        enq.CustomerName.toLowerCase().includes(nameFilterLowerCase);

      if (showDateInputs) {
        const enqDate = new Date(enq.InvoiceDate);
        enqDate.setHours(0, 0, 0, 0);
        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(filters.toDate);
        toDate.setHours(0, 0, 0, 0);

        const dateFilterPassed =
          !filters.fromDate ||
          !filters.toDate ||
          (enqDate >= fromDate && enqDate <= toDate);

        return dateFilterPassed && nameFilterPassed;
      }

      return nameFilterPassed;
    });

    setFilteredData(filteredDataTable);
    setOverallNetAmount(calculateOverallNetAmount(filteredDataTable));
    setTotalBills(filteredDataTable.length);

    // Show Snackbar if there are no results
    if (filteredDataTable.length === 0) {
      setShowNoResultsSnackbar(true);
    } else {
      setShowNoResultsSnackbar(false);
    }
    console.log("applying filters: ", filteredDataTable);
  };

  const handleCloseSnackbar = () => {
    setShowNoResultsSnackbar(false);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const handleClosePreview = () => {
    setopenPreview(false);
    setOneSalesInvoiceData([]);
    setSalesDetailsData([]);
  };

  const ViewSalesInvoice = (data) => {
    setOneSalesInvoiceData(data);
    GetOneSalesDetails(data.SalesInvoiceID);
  };

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1));

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

      <Container
        maxWidth={"xl"}
        sx={{ pt: 2, p: 1 }}
        elevation={3}
        component={Paper}
      >
        <Snackbar
          style={{ marginTop: "45px" }}
          open={showNoResultsSnackbar}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {noResultsMessage}
          </Alert>
        </Snackbar>

        {/* table header */}
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={1}
          my={2}
        >
          <Typography variant="h3" textAlign={"left"} my={2} color="#1D5B79">
            Sales Invoice Report
          </Typography>
          <DoubleArrowIcon color="primary" />
        </Stack>

        {/* search & add button */}
        <Stack
          direction={"column"}
          justifyContent={"space-between"}
          spacing={2}
          my={3}
        >
          <Stack direction={"column"} spacing={1} my={1}>
            <FormControl size="small" fullWidth component="fieldset" required>
              <Autocomplete
                size="small"
                fullWidth
                options={[
                  { initialCustomerName: "All Customers" },
                  ...allCustomerData,
                ]}
                getOptionLabel={(data) =>
                  data.initialCustomerName ? "All Customers" : data.CustomerName
                }
                isOptionEqualToValue={(option, value) =>
                  option.Customerid === value?.Customerid
                }
                renderInput={(params) => (
                  <TextField {...params} label="Search By Customer" />
                )}
                value={CustomerName}
                onChange={(e, newValue) => {
                  setCustomerName(newValue);
                  if (
                    newValue === null ||
                    newValue.initialCustomerName === "All Customers" ||
                    newValue === "All Customers"
                  ) {
                    setFilters({ ...filters, CustomerName: "" });
                  } else {
                    setCustomerName(newValue);
                    const fullName = newValue.CustomerName.toLowerCase();
                    setFilters({ ...filters, CustomerName: fullName });
                  }
                }}
                clearText="Clear"
              />
            </FormControl>
            <FormGroup sx={{ pl: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDateInputs}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Filter by Date"
              />
            </FormGroup>
          </Stack>
          {showDateInputs && (
            <Grow in={checked}>
              <Stack direction={{ xs: "row" }} spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="From Date"
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleDateChange("fromDate", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={dateValidation.fromDate}
                  helperText={
                    dateValidation.fromDate
                      ? "Invalid date format or range"
                      : ""
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  label="To Date"
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleDateChange("toDate", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={dateValidation.toDate}
                  helperText={
                    dateValidation.toDate ? "Invalid date format or range" : ""
                  }
                />
              </Stack>
            </Grow>
          )}

          <Grid container justifyContent={"center"} alignItems={"center"}>
            {TotalBills > 0 && (
              <Grid item xs={6}>
                <Stack
                  flexDirection={"row"}
                  justifyContent={"start"}
                  alignItems={"center"}
                >
                  <Stack justifyContent={"flex-start"} direction={"row"} mr={5}>
                    <Typography variant="h5" color="GrayText" pr={1}>
                      Total Bills :
                    </Typography>
                    <Typography variant="h3" color="#655DBB">
                      {TotalBills}
                    </Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem sx={{ mr: 4 }} />
                  <Stack justifyContent={"flex-start"} direction={"row"}>
                    <Typography variant="h5" color="GrayText" pr={1}>
                      Overall Bill Amount :
                    </Typography>
                    <Typography
                      variant="h3"
                      color="#655DBB"
                      textTransform={"capitalize"}
                    >
                      ₹ {numeral(overallNetAmount).format("0,0")}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            )}
            <Grid item xs={TotalBills > 0 ? 6 : 12}>
              <Stack
                direction={{ xs: "row" }}
                spacing={1}
                justifyContent={"flex-end"}
              >
                <Stack direction={"row"} spacing={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={applyFilters}
                    startIcon={<FilterAltIcon />}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={resetFilters}
                    startIcon={<LockResetIcon />}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Collapse in={filteredData.length > 0}>
          <>
            <Paper elevation={5} sx={{ borderRadius: 1 }}>
              <TableContainer sx={{ borderRadius: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ padding: "none" }}>
                      <StyledTableCell>S.No</StyledTableCell>
                      <StyledTableCell>Bill Number</StyledTableCell>
                      <StyledTableCell>Bill Date</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                      <StyledTableCell>Gross Amount</StyledTableCell>
                      <StyledTableCell>Discount</StyledTableCell>
                      <StyledTableCell>Net Amount</StyledTableCell>
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
                      <TableRow key={data.Studentid} hover>
                        <TableCell align="center" padding="none">
                          {data.SNo}
                        </TableCell>
                        <TableCell align="center">
                          {data.InvoiceNumber}
                        </TableCell>
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
                          {data.CustomerName}
                        </TableCell>
                        <TableCell align="center">
                          ₹ {numeral(data.TotalAmount).format("0,0")}
                        </TableCell>
                        <TableCell align="center">
                          ₹ {numeral(data.Discount).format("0,0")}
                        </TableCell>
                        <TableCell align="center">
                          ₹ {numeral(data.netAmount).format("0,0")}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ padding: "0" }}
                        >
                          <IconButton
                            aria-label="Edit"
                            onClick={() => ViewSalesInvoice(data)}
                          >
                            <Chip
                              icon={<RemoveRedEyeIcon />}
                              color="info"
                              size="small"
                              label="Preview"
                              variant="filled"
                              sx={{ cursor: "pointer" }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={7} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              mt={2}
            />
          </>
        </Collapse>
      </Container>

      {/* preview popup dialog box */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth={"lg"}
        fullWidth
      >
        <Paper elevation={3} sx={{ p: 2, background: "initial" }}>
          <Typography
            variant="h5"
            color="#614BC3"
            textAlign={"left"}
            borderBottom={1}
            pb={1}
            mx={1}
          >
            Sales Details
          </Typography>

          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            p={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography variant="h6" color="GrayText" pr={1}>
                  Invoice Number :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  {OneSalesInvoiceData.InvoiceNumber}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography variant="h6" color="GrayText" pr={1}>
                  Invoice Date :
                </Typography>
                <Typography
                  variant="h6"
                  color="#655DBB"
                  textTransform={"capitalize"}
                >
                  {formatDate(OneSalesInvoiceData.InvoiceDate)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography variant="h6" color="GrayText" pr={1}>
                  Po Ref Number :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  {OneSalesInvoiceData.PoRefNumber}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography variant="h6" color="GrayText" pr={1}>
                  Po Ref Date :
                </Typography>
                <Typography
                  variant="h6"
                  color="#655DBB"
                  textTransform={"capitalize"}
                >
                  {formatDate(OneSalesInvoiceData.PoRefDate)}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography
                  variant="h6"
                  color="GrayText"
                  sx={{ whiteSpace: "nowrap" }}
                  pr={1}
                >
                  Customer Name :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  {OneSalesInvoiceData.CustomerName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
                pr={1}
              >
                <Typography variant="h6" color="GrayText" pr={1}>
                  Remarks :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  {OneSalesInvoiceData.Remarks}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography
                  variant="h6"
                  color="GrayText"
                  sx={{ whiteSpace: "nowrap" }}
                  pr={1}
                >
                  Gross Amount :
                </Typography>
                <Typography
                  variant="h6"
                  color="#655DBB"
                  textTransform={"capitalize"}
                >
                  ₹ {numeral(OneSalesInvoiceData.TotalAmount).format("0,0")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography variant="h6" color="GrayText" pr={1}>
                  Discount :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  ₹ {numeral(OneSalesInvoiceData.Discount).format("0,0")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack
                justifyContent={"flex-start"}
                direction={{ xs: "column", md: "row" }}
              >
                <Typography
                  variant="h6"
                  color="GrayText"
                  sx={{ whiteSpace: "nowrap" }}
                  pr={1}
                >
                  Invoice Amount :
                </Typography>
                <Typography
                  variant="h6"
                  color="#655DBB"
                  textTransform={"capitalize"}
                >
                  ₹ {numeral(OneSalesInvoiceData.netAmount).format("0,0")}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <TableContainer>
            <Table padding="checkbox">
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell>Product</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>UOM</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Rate</StyledTableCell>
                  <StyledTableCell>Discount</StyledTableCell>
                  <StyledTableCell>Net Amount</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? SalesDetailsData.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : SalesDetailsData
                ).map((data, index) => (
                  <TableRow
                    key={data.ProductDetailId}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">
                      {data.ProductDescription}
                    </TableCell>
                    <TableCell align="center">
                      {data.ProductCategoryName}
                    </TableCell>
                    <TableCell align="center">{data.UOM}</TableCell>
                    <TableCell align="center">{data.Quantity}</TableCell>
                    <TableCell align="center">
                      ₹ {numeral(data.Rate).format("0,0")}
                    </TableCell>
                    <TableCell align="center">
                      ₹ {numeral(data.Discount).format("0,0")}
                    </TableCell>
                    <TableCell align="center">
                      {" "}
                      ₹ {numeral(data.netAmount).format("0,0")}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Total:
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="initial">
                      {totalQuantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="initial">
                      ₹ {numeral(totalRate).format("0,0")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="initial">
                      ₹ {numeral(totalDiscount).format("0,0")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="initial">
                      ₹ {numeral(totalNetAmount).format("0,0")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Dialog>

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

export default MISSalesInvoice;
