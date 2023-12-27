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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  Autocomplete,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "@emotion/styled";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import axios from "../../axios";
import "./animation.css";

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: "#F5F7F8",
  fontWeight: "600",
  textAlign: "center",
  backgroundColor: "#3081D0",
});

const Product = () => {
  const [tokent, settokent] = useState(
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ"
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [open, setOpen] = useState(false);
  const [openAlert, setopenAlert] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [operation, setOperation] = useState("Add");
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  // input fields state values
  const [ProductDescription, setProductDescription] = useState("");
  const [ProductCategory, setProductCategory] = useState(null);
  const [Rate, setRate] = useState(null);
  const [UomID, setUomID] = useState(null);
  const [ActiveStatus, setActiveStatus] = useState("y");
  const [allData, setallData] = useState([]);
  const [allProductCategories, setallProductCategories] = useState([]);
  const [allUOmData, setallUOmData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [openLoader, setOpenLoader] = useState(false);

  const [errors, setErrors] = useState({
    ProductDescription: false,
    ProductCategory: false,
    Rate: false,
    UomID: false,
    ActiveStatus: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    ProductDescription: "",
    ProductCategory: "",
    Rate: "",
    UomID: "",
    ActiveStatus: "",
  });

  const resetFields = () => {
    setProductDescription("");
    setProductCategory(null);
    setRate(null);
    setUomID(null);
    setActiveStatus("");

    errors.ProductDescription = false;
    errors.ProductCategory = false;
    errors.Rate = false;
    errors.UomID = false;
    errors.ActiveStatus = false;

    helperTexts.ProductDescription = "";
    helperTexts.ProductCategory = "";
    helperTexts.Rate = "";
    helperTexts.UomID = "";
    helperTexts.ActiveStatus = "";
  };

  // API Integration
  useEffect(() => {
    getData();
    getAllProductCategory();
    GetAllUOM();
  }, []);

  // Reset page to 0 when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // get all Product Category  Request
  const getAllProductCategory = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllProductCategory", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });

      const filteredData = res.data.filter((item) => item.ActiveStatus === "y");
      setallProductCategories(filteredData);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all UOM Data  Request
  const GetAllUOM = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllUOM", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      const filteredData = res.data.filter((item) => item.ActiveStatus === "y");
      setallUOmData(filteredData);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all Users Request
  const getData = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllProductDescription", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setallData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // post Request to Add new record
  const InsertData = async (newRecord) => {
    try {
      const res = await axios.instance.post(
        "/InsertProductDescription",
        newRecord,
        {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        }
      );
      getData();
      setAlertType("success");
      setAlertMessage("New Data Added Successfully!");
      setopenAlert(true);
    } catch (error) {
      console.error("Error adding Data:", error);
      setAlertType("error");
      setAlertMessage("Failed to add the Data.");
      setopenAlert(true);
    }
  };

  // put Request to edit record

  const handleEdit = (data) => {
    console.log("handleEdit", data);
    setEditID(data.ProductDetailId);
    setProductDescription(data.ProductDescription);
    const selectedProductCategory = allProductCategories.find(
      (cdata) => cdata.ProductCategoryid === data.ProductCategoryid
    );
    setProductCategory(selectedProductCategory);
    setRate(data.Rate);
    const selectedProductUOM = allUOmData.find(
      (udata) => udata.UomID === data.UomID
    );
    setUomID(selectedProductUOM);
    setActiveStatus(data.ActiveStatus);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation("Edit");
  };

  const updateData = async (editID, updatedData) => {
    try {
      await axios.instance.put(
        `/UpdateProductDescription/${editID}`,
        updatedData,
        {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        }
      );
      setopenAlert(true);
      setEditID();
      getData();
      setAlertType("success");
      setAlertMessage("Data Updated Successfully!");
    } catch (error) {
      console.error("Error updating User:", error);
      setAlertType("error");
      setAlertMessage("Failed to update the Data.");
      setopenAlert(true);
    }
  };

  // delete Request to delete record

  const handleDelete = (deleteId) => {
    setOpenDelete(true);
    setIdToDelete(deleteId);
  };

  const handleDeleteConfirmed = (deleteId) => {
    deleteUser(deleteId);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const deleteUser = async (deleteId) => {
    try {
      await axios.instance
        .delete(`/DeleteProductDescription/${deleteId}`, {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data === "") {
            getData();
            setOpenDelete(false);
            setAlertType("warning");
            setAlertMessage("Data Deleted Successfully!");
            setopenAlert(true);
          } else {
            getData();
            setOpenDelete(false);
            setAlertType("error");
            setAlertMessage(
              "Oops! Can't delete this data. It's connected to other information."
            );
            setopenAlert(true);
          }
          console.log(res.data);
        });
    } catch (error) {
      console.error("Error deleting Data:", error);
      setAlertType("error");
      setAlertMessage("Failed to delete the Data.");
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();

    const inputValidation =
      errors.ProductDescription ||
      errors.ProductCategory ||
      errors.Rate ||
      errors.UomID ||
      errors.ActiveStatus ||
      !ProductDescription ||
      !ProductCategory ||
      !Rate ||
      !UomID ||
      !ActiveStatus;

    // console.log('inputValidation',inputValidation2)

    if (inputValidation) {
      if (!ProductDescription) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ProductDescription: true,
        }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          ProductDescription: "Please Enter Product Description",
        }));
      }
      if (!ProductCategory) {
        setErrors((prevErrors) => ({ ...prevErrors, ProductCategory: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          ProductCategory: "Please Enter Product Category",
        }));
      }
      if (!Rate) {
        setErrors((prevErrors) => ({ ...prevErrors, Rate: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Rate: "Please Enter Rate",
        }));
      }
      if (!UomID) {
        setErrors((prevErrors) => ({ ...prevErrors, UomID: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          UomID: "Please Select Product UOM",
        }));
      }
      if (!ActiveStatus) {
        setErrors((prevErrors) => ({ ...prevErrors, ActiveStatus: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          ActiveStatus: "Please select Active Status",
        }));
      }
    }

    if (inputValidation) {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ProductDescription: false,
      ProductCategory: false,
      Rate: false,
      UomID: false,
      ActiveStatus: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      ProductDescription: "",
      ProductCategory: "",
      Rate: "",
      UomID: "",
      ActiveStatus: "",
    }));

    const newData = {
      ProductDescription,
      ProductCategory: ProductCategory.ProductCategoryid,
      Rate,
      UomID: UomID.UomID,
      ActiveStatus,
      [operation === "Edit" ? "ModifyBy" : "CreatedBy"]: 86,
    };

    console.log("submitted", newData);

    console.log("added data", newData);

    if (operation === "Add") {
      InsertData(newData);
    } else if (operation === "Edit") {
      console.log(editID, newData);
      updateData(editID, newData);
    }
    resetFields();
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "ProductDescription") setProductDescription(value);
    if (name === "ProductCategory") setProductCategory(value);
    if (name === "Rate") setRate(value);
    if (name === "UomID") setUomID(value);
    if (name === "ActiveStatus") setActiveStatus(value);
    validateInput(name, value);
  };

  const handleInputChangeSelect = (event, newValue) => {
    setProductCategory(newValue);

    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, ProductCategory: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        state: "Please select Product Category",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, ProductCategory: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: "" }));
    }
  };

  const handleInputChangeUOM = (event, newValue) => {
    setUomID(newValue);

    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, UomID: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        state: "Please select Product Uom",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, UomID: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: "" }));
    }
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = "";
    const isDataExists = allData.some(
      (data) =>
        data.ProductDescription.toLowerCase() === value.toLowerCase().trim()
    );
    const isDataExistsinEdit = allData.some(
      (data) =>
        data.ProductDescription.toLowerCase() === value.toLowerCase().trim() &&
        data.ProductDetailId !== editID
    );

    if (name === "ProductDescription") {
      if (!value.trim()) {
        error = true;
        helperText = "Product Description field cannot be empty";
        setIsFormSubmitted(false);
      } else if (operation === "Add" && isDataExists) {
        error = true;
        helperText = "product Description already exists";
        setIsFormSubmitted(false);
      } else if (operation === "Edit" && isDataExistsinEdit) {
        error = true;
        helperText = "product Description already exists";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "ProductCategory") {
      if (!value.trim()) {
        error = true;
        helperText = "Please select Product Category";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "Rate") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Enter Product Rate";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    }  else if (name === "UomID") {
      if (!value.trim()) {
        error = true;
        helperText = "Please select Product UOM";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "ActiveStatus") {
      if (!value.trim()) {
        error = true;
        helperText = "Please select active status";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      [name]: helperText,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (value.length > 0) {
      validateInput(name, value);
    }
  };

  const handleAddOpen = () => {
    setOpen(true);
    setOperation("Add");
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const handleClose = () => {
    resetFields();
    setOpen(false);
  };

  // search & filter
  const filteredData = allData.filter((enq) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return Object.values(enq).some((value) => {
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
        sx={{ mt: 2, pt: 4 }}
        elevation={3}
        component={Paper}
      >
        <Typography
          variant="h6"
          color="primary"
          fontWeight={600}
          mb={2}
          textAlign="center"
          sx={{ color: "#616161" }}
        >
          <Chip
            label="Product Master"
            color="primary"
            size="medium"
            variant="filled"
          />
        </Typography>

        {/* search & add button */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
          my={2}
        >
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Search"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ boxShadow: 1 }}
            onClick={handleAddOpen}
            size="small"
            startIcon={<PlaylistAddCircleIcon />}
          >
            Add New
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Product Description</StyledTableCell>
                <StyledTableCell>Product Category</StyledTableCell>
                <StyledTableCell>Rate</StyledTableCell>
                <StyledTableCell>UOM</StyledTableCell>
                <StyledTableCell>Active Status</StyledTableCell>
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
                <TableRow key={data.ProductDetailId} hover>
                  <TableCell align="center">{data.SNo}</TableCell>
                  <TableCell align="center">
                    {data.ProductDescription}
                  </TableCell>
                  <TableCell align="center">
                    {data.ProductCategoryName}
                  </TableCell>
                  <TableCell align="center">{data.Rate}</TableCell>
                  <TableCell align="center">{data.UOM}</TableCell>
                  <TableCell align="center">
                    {data.ActiveStatus === "y" ? (
                      <Chip
                        icon={<CheckCircleOutlineIcon />}
                        color="success"
                        size="small"
                        label="Active"
                      />
                    ) : (
                      <Chip
                        icon={<HighlightOffIcon />}
                        color="error"
                        size="small"
                        label="InActive"
                      />
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ padding: "0" }}>
                    <IconButton
                      aria-label="Edit"
                      onClick={() => handleEdit(data)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleDelete(data.ProductDetailId)}
                    >
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={9} />
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

      {/* add new popup form dialog box */}
      <Grid m={2}>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          fullWidth
        >
          <Container component={Paper} elevation={2} sx={{ py: 2 }}>
            <form onSubmit={handleSubmit}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mr={1}
              >
                <Typography
                  variant="h5"
                  textAlign={"left"}
                  pl={2}
                  fontWeight={600}
                  color="primary"
                >
                  {operation} Product
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction={"column"} spacing={2} p={2}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Product Description"
                  name="ProductDescription"
                  value={ProductDescription === null ? "" : ProductDescription}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.ProductDescription}
                  helperText={helperTexts.ProductDescription}
                  className={
                    isFormSubmitted && errors.ProductDescription
                      ? "shake-helper-text"
                      : ""
                  }
                />
                <Autocomplete
                  size="small"
                  name="ProductCategory"
                  options={allProductCategories}
                  getOptionLabel={(data) =>
                    data ? data.ProductCategoryName : ""
                  }
                  value={ProductCategory || null}
                  onChange={handleInputChangeSelect}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Product Category" />
                  )}
                />
                {errors.ProductCategory && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 2 }}
                    color="error"
                    className={
                      isFormSubmitted && errors.ProductCategory
                        ? "shake-helper-text"
                        : ""
                    }
                  >
                    {errors.ProductCategory && helperTexts.ProductCategory}
                  </Typography>
                )}

             

                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Rate"
                  name="Rate"
                  value={Rate === null ? "" : Rate}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.Rate}
                  helperText={helperTexts.Rate}
                  className={
                    isFormSubmitted && errors.Rate ? "shake-helper-text" : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              

                <Autocomplete
                  size="small"
                  name="UomID"
                  options={allUOmData}
                  getOptionLabel={(data) => (data ? data.UOM : "")}
                  value={UomID || null}
                  onChange={handleInputChangeUOM}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Product UOM" />
                  )}
                />
                {errors.UomID && (
                  <Typography
                    variant="caption"
                    color="error"
                    className={
                      isFormSubmitted && errors.UomID ? "shake-helper-text" : ""
                    }
                    sx={{ ml: 0 }}
                  >
                    {errors.UomID && helperTexts.UomID}
                  </Typography>
                )}

                <FormControl size="small" fullWidth component="fieldset">
                  <FormLabel component="legend">Status</FormLabel>
                  <RadioGroup
                    row
                    value={ActiveStatus}
                    name="ActiveStatus"
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value="y"
                      control={<Radio />}
                      label="Active"
                    />
                    <FormControlLabel
                      value="n"
                      control={<Radio />}
                      label="InActive"
                    />
                  </RadioGroup>
                  {errors.ActiveStatus && (
                    <Typography
                      variant="caption"
                      color="error"
                      className={
                        isFormSubmitted && errors.ActiveStatus
                          ? "shake-helper-text"
                          : ""
                      }
                    >
                      {errors.ActiveStatus && helperTexts.ActiveStatus}
                    </Typography>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ boxShadow: 1 }}
                  fullWidth
                >
                    {operation === "Add" ? 'Save' : 'Update'}               
                </Button>
              </Stack>
            </form>
          </Container>
        </Dialog>
      </Grid>

      {/* confirmation dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="responsive-dialog-title"
        fullScreen={fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to delete?
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
            onClick={() => handleDeleteConfirmed(IdToDelete)}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
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

export default Product;
