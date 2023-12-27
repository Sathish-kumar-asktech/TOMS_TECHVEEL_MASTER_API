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
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import axios from "../../axios";
import "./animation.css";

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: "#F5F7F8",
  fontWeight: "600",
  textAlign: "center",
  backgroundColor: "#016A70",
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

// Get the current date and 30 days before the current date
const currentDate = new Date();

const initialDate = formatDateToinitialValues(currentDate);

const PurchaseInvoice = () => {
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
  const [ProductCategory, setProductCategory] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [Discount, setDiscount] = useState(null);
  const [NetAmount, setNetAmount] = useState(null);
  const [Remarks, setRemarks] = useState("");
  const [SelectedProductsData, setSelectedProductsData] = useState([]);
  const [allProducts, setallProducts] = useState([]);
  const [InvoiceNumber, setInvoiceNumber] = useState(2255441);
  const [InvoiceDate, setInvoiceDate] = useState(initialDate);
  const [PINumber, setPINumber] = useState(null);
  const [PIDate, setPIDate] = useState(null);
  const [allProductCategories, setallProductCategories] = useState([]);

  const totalQuantity = SelectedProductsData.reduce(
    (total, product) => total + parseInt(product.Quantity),
    0
  );
  const totalRate = SelectedProductsData.reduce(
    (total, product) => total + product.Rate,
    0
  );
  const totalDiscount = SelectedProductsData.reduce(
    (total, product) => total + product.Discount,
    0
  );
  const totalNetAmount = SelectedProductsData.reduce(
    (total, product) => total + product.NetAmount,
    0
  );

  const [selectedSupplier, setselectedSupplier] = useState(null);
  const [allSupplierDate, setallSupplierDate] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [openLoader, setOpenLoader] = useState(false);

  const calculateMaxDate = () => {
    const currentDate = new Date();
    // currentDate.setFullYear(currentDate.getFullYear() - 18);
    return currentDate.toISOString().split("T")[0];
  };

  const [errors, setErrors] = useState({
    ProductDescription: false,
    Quantity: false,
    selectedSupplier: false,
    Remarks: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    ProductDescription: "",
    Quantity: "",
    selectedSupplier: "",
    Remarks: "",
  });

  const resetFields = () => {
    setProductDescription("");
    setQuantity(1);
    setselectedSupplier(null);
    setRemarks("");

    errors.ProductDescription = false;
    errors.Quantity = false;
    errors.selectedSupplier = false;
    errors.Remarks = false;

    helperTexts.ProductDescription = "";
    helperTexts.Quantity = "";
    helperTexts.selectedSupplier = "";
    helperTexts.Remarks = "";
  };

  // API Integration
  useEffect(() => {
    // getData();
    getAllProducts();
    GetAllSupplier();
  }, []);

  // Reset page to 0 when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // get all Product Category  Request
  const getAllProducts = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllProductDescription", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });

      const filteredData = res.data.filter((item) => item.ActiveStatus === "y");
      setallProducts(filteredData);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all UOM Data  Request
  const GetAllSupplier = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllSupplier", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      const filteredData = res.data.filter((item) => item.ActiveStatus === "y");
      setallSupplierDate(filteredData);
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
      // getData();
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
    setQuantity(data.Quantity);
    const selectedProductUOM = allSupplierDate.find(
      (udata) => udata.UomID === data.UomID
    );
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
      // getData();
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
            // getData();
            setOpenDelete(false);
            setAlertType("warning");
            setAlertMessage("Data Deleted Successfully!");
            setopenAlert(true);
          } else {
            // getData();
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
      errors.Quantity ||
      !ProductDescription ||
      !Quantity;

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
      if (!Quantity) {
        setErrors((prevErrors) => ({ ...prevErrors, Quantity: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Quantity: "Please Enter Quantity",
        }));
      }
      if (!selectedSupplier) {
        setErrors((prevErrors) => ({ ...prevErrors, selectedSupplier: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          selectedSupplier: "Please Select Supplier",
        }));
      }
    }

    if (inputValidation) {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ProductDescription: false,
      Quantity: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      ProductDescription: "",
      Quantity: "",
    }));

    const newData = {
      ProductDescription,
      Quantity,
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

  const handleAddProduct = (event) => {
    event.preventDefault();

    const inputValidation =
      errors.ProductDescription ||
      errors.Quantity ||
      errors.Quantity ||
      !ProductDescription ||
      !Quantity;

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
      if (!Quantity) {
        setErrors((prevErrors) => ({ ...prevErrors, Quantity: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Quantity: "Please Enter Quantity",
        }));
      }
      if (!selectedSupplier) {
        setErrors((prevErrors) => ({ ...prevErrors, selectedSupplier: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          selectedSupplier: "Please Select Supplier",
        }));
      }
    }

    if (inputValidation) {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ProductDescription: false,
      Quantity: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      ProductDescription: "",
      Quantity: "",
    }));

    const newProduct = {
      InvoiceNumber: InvoiceNumber,
      ProductID: ProductDescription.ProductDetailId,
      ProductDescription: ProductDescription.ProductDescription,
      ProductCategoryName: ProductDescription.ProductCategoryName,
      Rate: ProductDescription.Rate,
      UOM: ProductDescription.UOM,
      Quantity,
      Discount,
      NetAmount: Quantity * ProductDescription.Rate - Discount || 0,
    };

    // Add the new object to the existing array in the state
    setSelectedProductsData((prevData) => [...prevData, newProduct]);

    // resetFields();
    setProductDescription(null);
    setQuantity(1);
    handleCloseProduct();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "ProductDescription") setProductDescription(value);
    if (name === "Quantity") setQuantity(value);
    validateInput(name, value);
  };

  const handleInputChangeSelect = (event, newValue) => {
    setProductDescription(newValue);
    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, ProductDescription: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        state: "Please select Product Category",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, ProductDescription: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: "" }));
    }
  };

  const handleInputChangeSupplier = (event, newValue) => {
    setselectedSupplier(newValue);

    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedSupplier: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        selectedSupplier: "Please select Supplier",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, selectedSupplier: false }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        selectedSupplier: "",
      }));
    }
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = "";
    const isDataExists = SelectedProductsData.some(
      (data) =>
        data.ProductDescription.toLowerCase() === value.toLowerCase().trim()
    );
    const isDataExistsinEdit = SelectedProductsData.some(
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
    } else if (name === "Quantity") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Enter Product Quantity";
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

  const handleQuantityChange = (event, index) => {
    const currentIndex = page * rowsPerPage + index;
    const newQuantity = parseInt(event.target.value, 10) || 0;

    setSelectedProductsData((prevData) =>
      prevData.map((product, i) =>
        i === currentIndex
          ? {
              ...product,
              Quantity: newQuantity,
              NetAmount: newQuantity * product.Rate - product.Discount || 0,
            }
          : product
      )
    );
  };

  const handleDiscountChange = (event, index) => {
    const currentIndex = page * rowsPerPage + index;
    const newDiscount = parseInt(event.target.value, 10) || 0;

    setSelectedProductsData((prevData) =>
      prevData.map((product, i) =>
        i === currentIndex
          ? {
              ...product,
              Discount: newDiscount,
              NetAmount: product.Quantity * product.Rate - newDiscount || 0,
            }
          : product
      )
    );
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

  const handleCloseProduct = () => {
    setOpen(false);
  };

  // search & filter
  const filteredData = SelectedProductsData.filter((enq) => {
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
        sx={{ mt: 2, pt: 4, pb: 4 }}
        elevation={3}
        component={Paper}
      >
        <Typography
          variant="h5"
          color="blue"
          fontWeight={600}
          mb={2}
          textAlign="center"
          sx={{ color: "#616161" }}
        >
          Purchase Invoice
          {/* <Chip
            label="Purchase Invoice"
            color="success"
            size="medium"
            variant="filled"
          /> */}
        </Typography>

        {/* search & add button */}
        <Stack
          direction={{ sm: "row", xs: "column" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
          my={2}
        >
          <Stack
            direction={{ md: "row", sm: "column" }}
            justifyContent={"start"}
            alignItems={"center"}
            spacing={2}
          >
            <FormControl size="small" fullWidth>
              <FormLabel component="legend">Invoice Number:</FormLabel>
              <TextField
                id=""
                label=""
                value={InvoiceNumber}
                // onChange={}
                size="small"
                disabled
              />
            </FormControl>
            {/* <Button variant="text" color="info">
              Invoice Number: {InvoiceNumber}
            </Button> */}
            <FormControl size="small" fullWidth>
              <FormLabel component="legend">Invoice Date : </FormLabel>

              <TextField
                size="small"
                fullWidth
                type="date"
                // label="Invoice Date"
                value={InvoiceDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  console.log(newDate);
                  // setDob(newDate);
                  // const isValidDate = newDate.trim() !== "";
                  // const isAgeBelow18 = new Date(newDate) > calculateMaxDate();
                  // setFieldErrors((prevFieldErrors) => ({
                  //   ...prevFieldErrors,
                  //   dob: !isValidDate,
                  //   ageBelow18: isAgeBelow18,
                  // }));
                }}
                // error={fieldErrors.dob || fieldErrors.ageBelow18}
                // helperText={
                //   (fieldErrors.dob && "Invalid date of birth") ||
                //   (fieldErrors.ageBelow18 && "Age must be 18 or above")
                // }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: calculateMaxDate(),
                }}
              />
            </FormControl>
          </Stack>

          <Stack
            direction={{ md: "row", sm: "column" }}
            justifyContent={"start"}
            alignItems={"center"}
            spacing={2}
          >
            <FormControl size="small" fullWidth>
              <FormLabel component="legend">PI Number: </FormLabel>
              <TextField
                id=""
                label=""
                value={PINumber}
                // onChange={}
                size="small"
                disabled
              />
            </FormControl>
            {/* <Button variant="text" color="info">
              Invoice Number: {InvoiceNumber}
            </Button> */}
            <FormControl size="small" fullWidth>
              <FormLabel component="legend">PI Date : </FormLabel>

              <TextField
                size="small"
                type="date"
                disabled
                // label="Invoice Date"
                value={PIDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  console.log(newDate);
                  // setDob(newDate);
                  // const isValidDate = newDate.trim() !== "";
                  // const isAgeBelow18 = new Date(newDate) > calculateMaxDate();
                  // setFieldErrors((prevFieldErrors) => ({
                  //   ...prevFieldErrors,
                  //   dob: !isValidDate,
                  //   ageBelow18: isAgeBelow18,
                  // }));
                }}
                // error={fieldErrors.dob || fieldErrors.ageBelow18}
                // helperText={
                //   (fieldErrors.dob && "Invalid date of birth") ||
                //   (fieldErrors.ageBelow18 && "Age must be 18 or above")
                // }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Stack>
        </Stack>

        <Stack
          direction={{ md: "row", sm: "column" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
          my={2}
        >
          <>
            <FormControl size="small" fullWidth>
              <Autocomplete
                size="small"
                fullWidth
                name="ProductCategory"
                options={allSupplierDate}
                getOptionLabel={(data) => (data ? data.SupplierName : "")}
                value={selectedSupplier || null}
                onChange={handleInputChangeSupplier}
                renderInput={(params) => (
                  <TextField {...params} label="Select Supplier" />
                )}
              />
              {errors.selectedSupplier && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2 }}
                  color="error"
                  className={
                    isFormSubmitted && errors.selectedSupplier
                      ? "shake-helper-text"
                      : ""
                  }
                >
                  {errors.selectedSupplier && helperTexts.selectedSupplier}
                </Typography>
              )}
            </FormControl>
          </>
          {selectedSupplier && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ boxShadow: 1, whiteSpace: "nowrap", p: 1, px: 2 }}
              onClick={handleAddOpen}
              size="small"
              startIcon={<PlaylistAddCircleIcon />}
            >
              Add Product
            </Button>
          )}
        </Stack>
        {selectedSupplier && (
          <>
            {/* table  */}
            <TableContainer>
              <Table padding="checkbox">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>Product</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>UOM</StyledTableCell>
                    <StyledTableCell>Rate</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Discount</StyledTableCell>
                    <StyledTableCell>Net Amount</StyledTableCell>
                    {/* <StyledTableCell>Actions</StyledTableCell> */}
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
                      <TableCell align="center">{data.Rate}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          variant="standard"
                          color="primary"
                          name="Quantity"
                          value={
                            SelectedProductsData[page * rowsPerPage + index]
                              .Quantity
                          }
                          onBlur={handleBlur}
                          onChange={(e) => handleQuantityChange(e, index)}
                          fullWidth
                          size="small"
                          error={errors.Quantity}
                          helperText={helperTexts.Quantity}
                          className={
                            isFormSubmitted && errors.Quantity
                              ? "shake-helper-text"
                              : ""
                          }
                          sx={{ textAlign: "center" }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <TextField
                          sx={{ textAlign: "center" }}
                          type="number"
                          variant="standard"
                          color="primary"
                          name="Discount"
                          value={
                            SelectedProductsData[page * rowsPerPage + index]
                              .Discount
                          }
                          onBlur={handleBlur}
                          onChange={(e) => handleDiscountChange(e, index)}
                          fullWidth
                          size="small"
                          error={errors.Discount}
                          helperText={helperTexts.Discount}
                          className={
                            isFormSubmitted && errors.Discount
                              ? "shake-helper-text"
                              : ""
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{data.NetAmount}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right" padding="1">
                      Total:
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color="initial">
                        ₹{totalRate}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="h6" color="initial">
                        {totalQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="h6" color="initial">
                        ₹{totalDiscount}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color="initial">
                        ₹{totalNetAmount}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )} */}
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

            <Stack
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={2}
              my={2}
            >
              <TextField
                type="number"
                variant="outlined"
                color="primary"
                label="Remarks if any..."
                name="Remarks"
                value={Remarks === null ? "" : Remarks}
                onChange={(e) => setRemarks(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
                error={errors.Remarks}
                helperText={helperTexts.Remarks}
                className={
                  isFormSubmitted && errors.Remarks ? "shake-helper-text" : ""
                }
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ boxShadow: 1 }}
                onClick={handleAddOpen}
                size="small"
                // startIcon={<PlaylistAddCircleIcon />}
              >
                Save & Submit
              </Button>
            </Stack>
          </>
        )}
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
            <form onSubmit={handleAddProduct}>
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
                <Autocomplete
                  size="small"
                  name="ProductDescription"
                  options={allProducts}
                  getOptionLabel={(data) =>
                    data ? data.ProductDescription : ""
                  }
                  value={ProductDescription || null}
                  onChange={handleInputChangeSelect}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Product" />
                  )}
                />
                {errors.ProductDescription && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 2 }}
                    color="error"
                    className={
                      isFormSubmitted && errors.ProductDescription
                        ? "shake-helper-text"
                        : ""
                    }
                  >
                    {errors.ProductDescription &&
                      helperTexts.ProductDescription}
                  </Typography>
                )}

                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Quantity"
                  name="Quantity"
                  value={Quantity === null ? "" : Quantity}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.Quantity}
                  helperText={helperTexts.Quantity}
                  className={
                    isFormSubmitted && errors.Quantity
                      ? "shake-helper-text"
                      : ""
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ boxShadow: 1 }}
                  fullWidth
                >
                  {operation === "Add" ? "Save" : "Update"}
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

export default PurchaseInvoice;
