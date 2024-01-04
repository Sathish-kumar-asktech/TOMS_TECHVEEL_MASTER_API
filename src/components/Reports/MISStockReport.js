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
  Collapse,
  Snackbar,
  Alert,
  Slide,
  Grid,
  Divider,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LockResetIcon from "@mui/icons-material/LockReset";
import numeral from "numeral";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
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

const calculateTotalInwards = (data) => {
  let overallInwards = 0;
  data.forEach((obj) => {
    overallInwards += parseFloat(obj.Inward);
  });
  return overallInwards;
};

const calculateTotalOutwards = (data) => {
  let overallOutwards = 0;
  data.forEach((obj) => {
    overallOutwards += parseFloat(obj.Outward);
  });
  return overallOutwards;
};

const MISStockReport = () => {
  // eslint-disable-next-line no-restricted-globals
  const [tokent, settokent] = useState(
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ"
  );

  const [openLoader, setOpenLoader] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setopenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showNoResultsSnackbar, setShowNoResultsSnackbar] = useState(false);
  const noResultsMessage = "No results found for the applied filters.";

  const [MISStockData, setMISStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [Product, setProduct] = useState({
    initialProduct: "All Products",
  });
  const [allProducts, setallProducts] = useState([]);
  const [overallInwards, setoverallInwards] = useState(0);
  const [overallOutwards, setoverallOutwards] = useState(0);
  const [TotalBills, setTotalBills] = useState(0);

  const [filters, setFilters] = useState({
    Product: "",
  });

  const resetFilters = () => {
    setFilters({
      Product: "",
    });
    setFilteredData([]);
    setProduct(null);
    setProduct({ initialProduct: "All Products" });
    setoverallInwards(0);
    setTotalBills(0);
  };

  // API Integration
  useEffect(() => {
    GetAllMISStockReport();
    getAllProducts();
    formatDateToinitialValues();
  }, []);

  // get all GetAllMISStockReport  Request
  const GetAllMISStockReport = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllMISStockReport", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setMISStockData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all Product Category  Request
  const getAllProducts = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllProductDescription", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });

      const filteredDataObj = res.data.filter(
        (item) => item.ActiveStatus === "y"
      );
      setallProducts(filteredDataObj);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const applyFilters = () => {
    const filteredDataTable = MISStockData.filter((value) => {
      const nameFilterLowerCase = filters.Product;

      const nameFilterPassed =
        !filters.Product ||
        value.ProductDescription.toLowerCase().includes(nameFilterLowerCase);

      return nameFilterPassed;
    });

    setFilteredData(filteredDataTable);
    setoverallInwards(calculateTotalInwards(filteredDataTable));
    setoverallOutwards(calculateTotalOutwards(filteredDataTable));

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
            Stock Report
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
                options={[{ initialProduct: "All Products" }, ...allProducts]}
                getOptionLabel={(data) =>
                  data.initialProduct ? "All Products" : data.ProductDescription
                }
                isOptionEqualToValue={(option, value) =>
                  option.ProductDetailId === value?.ProductDetailId
                }
                renderInput={(params) => (
                  <TextField {...params} label="Search By Product" />
                )}
                value={Product}
                onChange={(e, newValue) => {
                  setProduct(newValue);
                  if (
                    newValue === null ||
                    newValue.initialProduct === "All Products" ||
                    newValue === "All Products"
                  ) {
                    setFilters({ ...filters, Product: "" });
                  } else {
                    setProduct(newValue);
                    const prodcutChoosen =
                      newValue.ProductDescription.toLowerCase();
                    setFilters({ ...filters, Product: prodcutChoosen });
                  }
                }}
                clearText="Clear"
              />
            </FormControl>
          </Stack>

          <Grid container justifyContent={"center"} alignItems={"center"}>
            {overallInwards > 0 && (
              <Grid item md={6} sm={12}>
                <Stack
                  flexDirection={"row"}
                  justifyContent={"start"}
                  alignItems={"center"}
                  mb={2}
                >
                  <Stack
                    justifyContent={"flex-start"}
                    direction={{ md: "row", sm: "column" }}
                    mr={5}
                  >
                    <Typography variant="h5" color="GrayText" pr={1}>
                      Total Inward :
                    </Typography>
                    <Typography variant="h3" color="#655DBB">
                      {numeral(overallInwards).format("0,0")}
                    </Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem sx={{ mr: 4 }} />
                  <Stack
                    justifyContent={"flex-start"}
                    direction={{ md: "row", sm: "column" }}
                  >
                    <Typography variant="h5" color="GrayText" pr={1}>
                      Total Outward :
                    </Typography>
                    <Typography
                      variant="h3"
                      color="#655DBB"
                      textTransform={"capitalize"}
                    >
                      {numeral(overallOutwards).format("0,0")}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            )}
            <Grid item md={overallInwards > 0 ? 6 : 12} sm={12}>
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
                      <StyledTableCell>Product</StyledTableCell>
                      <StyledTableCell>Inwards</StyledTableCell>
                      <StyledTableCell>Outwards</StyledTableCell>
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
                          {`${data.ProductDescription}`}
                        </TableCell>
                        <TableCell align="center">
                          {numeral(data.Inward).format("0,0")} {data.UOM}
                        </TableCell>
                        <TableCell align="center">
                          {numeral(data.Outward).format("0,0")} {data.UOM}
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={4} />
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

export default MISStockReport;
