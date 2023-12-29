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
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "../../axios";
import "./animation.css";
import { useParams } from "react-router-dom";
import { DiscFull } from "@mui/icons-material";

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: "#F5F7F8",
  fontWeight: "600",
  textAlign: "center",
  backgroundColor: "#4942E4",
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

const SalesInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [operation, setOperation] = useState(id ? "Edit" : "Add");
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  // input fields state values
  const [ProductDescription, setProductDescription] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [Discount, setDiscount] = useState(null);
  const [Remarks, setRemarks] = useState("");
  const [SelectedProductsData, setSelectedProductsData] = useState([]);
  const [allProducts, setallProducts] = useState([]);
  const [InvoiceNumber, setInvoiceNumber] = useState();
  const [InvoiceDate, setInvoiceDate] = useState(initialDate);
  const [PoRefNumber, setPoRefNumber] = useState();
  const [PoRefDate, setPoRefDate] = useState(initialDate);
  const [Rate, setRate] = useState(null);
  const [DiscountValue, setDiscountValue] = useState(0);
  const [selectedSupplier, setselectedSupplier] = useState(null);
  const [allSupplierData, setallSupplierDate] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState(id);
  const [openLoader, setOpenLoader] = useState(false);

  const totalQuantity = SelectedProductsData.reduce(
    (total, product) => total + parseInt(product.Quantity),
    0
  );
  const totalRate = SelectedProductsData.reduce(
    (total, product) => total + parseInt(product.Rate),
    0
  );
  const totalDiscount = SelectedProductsData.reduce(
    (total, product) => total + parseInt(product.Discount),
    0
  );
  const totalNetAmount = SelectedProductsData.reduce(
    (total, product) => total + parseInt(product.netAmount),
    0
  );

  const calculateMaxDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
  };

  const [errors, setErrors] = useState({
    ProductDescription: false,
    Quantity: false,
    InvoiceNumber: false,
    InvoiceDate: false,
    PoRefNumber: false,
    PoRefDate: false,
    selectedSupplier: false,
    TotalAmount: false,
    Discount: false,
    Rate: false,
    DiscountValue: false,
    netAmount: false,
    Remarks: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    ProductDescription: "",
    Quantity: "",
    InvoiceNumber: "",
    InvoiceDate: "",
    PoRefNumber: "",
    PoRefDate: "",
    selectedSupplier: "",
    TotalAmount: "",
    Rate: "",
    DiscountValue: "",
    Discount: "",
    netAmount: "",
    Remarks: "",
  });

  const resetFieldsProducts = () => {
    setProductDescription("");
    setQuantity(1);
    setRate(null);
    setDiscountValue(0);

    errors.ProductDescription = false;
    errors.Quantity = false;
    errors.Rate = false;
    errors.DiscountValue = false;

    helperTexts.ProductDescription = "";
    helperTexts.Quantity = "";
    helperTexts.Rate = "";
    helperTexts.DiscountValue = "";
  };

  const resetFieldSummary = () => {
    setselectedSupplier(null);
    setInvoiceNumber(null);
    setInvoiceDate(initialDate);
    setPoRefNumber(null);
    setPoRefDate(initialDate);
    setRemarks("");
    setSelectedProductsData([]);

    errors.selectedSupplier = false;
    errors.InvoiceNumber = false;
    errors.InvoiceDate = false;
    errors.PoRefNumber= false;
    errors.PoRefDate = false;
    errors.selectedSupplier = false;
    errors.TotalAmount = false;
    errors.Discount = false;
    errors.Rate = false;
    errors.DiscountValue = false;
    errors.netAmount = false;
    errors.Remarks = false;

    helperTexts.selectedSupplier = "";
    helperTexts.InvoiceNumber = "";
    helperTexts.InvoiceDate = "";
    helperTexts.PoRefNumber= "";
    helperTexts.PoRefDate = "";
    helperTexts.selectedSupplier = "";
    helperTexts.TotalAmount = "";
    helperTexts.Discount = "";
    helperTexts.netAmount = "";
    helperTexts.Rate = "";
    helperTexts.DiscountValue = "";
    helperTexts.Remarks = "";
  };

  const handleInputChangeSummary = (event) => {
    const { name, value } = event.target;
    if (name === "PoRefNumber") setPoRefNumber(value);
    if (name === "PoRefDate") setPoRefDate(value);
    if (name === "InvoiceNumber") setInvoiceNumber(value);
    if (name === "InvoiceDate") setInvoiceDate(value);
    validateInput(name, value);
  };

  // API Integration
  useEffect(() => {
    getAllProducts();
    GetAllSupplier();
    if (id) {
      getOneSalesInvoice();
      GetOneSalesDetails();
    }
  }, []);

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

  // get all UOM Data  Request
  const GetAllSupplier = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllSupplier", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      const filteredDataObj = res.data.filter(
        (item) => item.ActiveStatus === "y"
      );
      setallSupplierDate(filteredDataObj);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get one  Sales Invoice  Request
  const getOneSalesInvoice = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get(`/GetOneSalesInvoice/${id}`, {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      const InvoiceData = res.data[0];

      setselectedSupplier({
        Supplierid: InvoiceData.Supplierid,
        SupplierName: InvoiceData.SupplierName,
      });

      setInvoiceNumber(InvoiceData.InvoiceNumber);
      setPoRefNumber(InvoiceData.PoRefNumber);
      setInvoiceDate(InvoiceData.InvoiceDate.substring(0, 10));
      setPoRefDate(InvoiceData.PoRefDate.substring(0, 10));
      setRemarks(InvoiceData.Remarks);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get one  Sales Details  Request
  const GetOneSalesDetails = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get(`/GetOneSalesDetails/${id}`, {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setSelectedProductsData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const InsertData = async (newRecord) => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.post(
        "/InsertSalesInvoice",
        newRecord,
        {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        }
      );

      // Extract SalesInvoiceID from the response
      const SalesInvoiceID = res.data[0].SalesInvoiceID;
      console.log(res.data[0].SalesInvoiceID);

      // Map over selectedProductsData and perform the second API call for each object
      const uploadPromises = SelectedProductsData.map(async (productData) => {
        const ProductDetail = {
          SalesInvoiceID: SalesInvoiceID,
          ProductDetailId: productData.ProductDetailId,
          Quantity: productData.Quantity,
          Rate: productData.Rate,
          Discount: productData.Discount === null ? 0 : productData.Discount,
          netAmount: productData.netAmount,
          CreatedBy: 86,
        };

        console.log("ProductDetail", ProductDetail);

        return await axios.instance.post(
          "/InsertSalesDetails",
          ProductDetail,
          {
            headers: {
              Authorization: tokent,
              "Content-Type": "application/json",
            },
          }
        );
      });

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      // If all API calls succeed
      setAlertType("success");
      setAlertMessage("New Data Added Successfully!");
      setopenAlert(true);
      resetFieldSummary();
      setTimeout(() => {
        navigate("/transacation/ManageSalesInvoice");
        setOpenLoader(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding Data:", error);
      setAlertType("error");
      setAlertMessage("Failed to add the Data.");
      setopenAlert(true);
      setOpenLoader(false);
    }
  };

  const updateData = async (editID, updatedData) => {
    setOpenLoader(true);
    try {
      await axios.instance
        .put(`/UpdateSalesInvoice/${editID}`, updatedData, {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data === "") {
            const SalesInvoiceID = id;
            console.log("Edit id inside loop ", SalesInvoiceID);
            try {
              axios.instance
                .delete(`/DeleteSalesDetails/${SalesInvoiceID}`, {
                  headers: {
                    Authorization: tokent,
                    "Content-Type": "application/json",
                  },
                })
                .then((res) => {
                  if (res.data === "") {
                    const uploadPromises = SelectedProductsData.map(
                      async (productData) => {
                        const ProductDetail = {
                          SalesInvoiceID: SalesInvoiceID,
                          ProductDetailId: productData.ProductDetailId,
                          Quantity: productData.Quantity,
                          Rate: productData.Rate,
                          Discount:
                            productData.Discount === null
                              ? 0
                              : productData.Discount,
                          netAmount: productData.netAmount,
                          CreatedBy: 86,
                        };

                        console.log("ProductDetail", ProductDetail);

                        return await axios.instance.post(
                          "/InsertSalesDetails",
                          ProductDetail,
                          {
                            headers: {
                              Authorization: tokent,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                      }
                    );

                    Promise.all(uploadPromises);

                    // If all API calls succeed
                    if (Promise.all(uploadPromises)) {
                      setAlertType("success");
                      setAlertMessage("Invoice Data Updated Successfully!");
                      setopenAlert(true);
                      resetFieldSummary();

                      setTimeout(() => {
                        navigate("/transacation/ManageSalesInvoice");
                        setOpenLoader(false);
                      }, 2000);
                    }
                  }
                });
            } catch (error) {
              console.error("Error updating Record:", error);
              setAlertType("error");
              setAlertMessage("Failed to update the Record.");
              setopenAlert(true);
            }
          }
        });
    } catch (error) {
      // If there's an error in any API call
      console.error("Error adding Data:", error);
      setAlertType("error");
      setAlertMessage("Failed to add the Data.");
      setopenAlert(true);
      setOpenLoader(false);
    }
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
  const handleSubmitSummary = (event) => {
    event.preventDefault();

    const inputValidation =
      errors.InvoiceDate ||
      errors.PoRefNumber||
      errors.PoRefDate ||
      !InvoiceDate ||
      !PoRefNumber||
      !PoRefDate;

    if (inputValidation) {
      if (!InvoiceDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          InvoiceDate: true,
        }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          InvoiceDate: "Please Select Invoice Date",
        }));
      }
      if (!PoRefNumber) {
        setErrors((prevErrors) => ({ ...prevErrors, PoRefNumber: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          PoRefNumber: "Please Enter Po Ref Number",
        }));
      }
      if (!PoRefDate) {
        setErrors((prevErrors) => ({ ...prevErrors, PoRefDate: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          PoRefDate: "Please Select Po Ref Date",
        }));
      }
    }

    if (inputValidation) {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedSupplier: false,
      InvoiceNumber: false,
      InvoiceDate: false,
      PoRefNumber: false,
      PoRefDate: false,
      TotalAmount: false,
      Discount: false,
      netAmount: false,
      Remarks: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      selectedSupplier: "",
      InvoiceNumber: "",
      InvoiceDate: "",
      PoRefNumber: "",
      PoRefDate: "",
      TotalAmount: "",
      Discount: "",
      netAmount: "",
      Remarks: "",
    }));

    const newData = {
      InvoiceDate: InvoiceDate,
      PoRefNumber: PoRefNumber,
      PoRefDate: PoRefDate,
      Supplierid: selectedSupplier.Supplierid,
      TotalAmount: totalRate,
      Discount: totalDiscount,
      netAmount: totalNetAmount,
      Remarks: Remarks,
      [operation === "Edit" ? "ModifyBy" : "CreatedBy"]: 86,
    };

    if (operation === "Add") {
      InsertData(newData);
    } else if (operation === "Edit") {
      console.log(editID, newData);
      updateData(editID, newData);
    }
    handleClose();
  };

  const handleAddProduct = (event) => {
    event.preventDefault();

    const inputValidation =
      errors.ProductDescription ||
      errors.Quantity ||
      errors.Rate ||
      errors.DiscountValue ||
      !ProductDescription ||
      !Quantity;
    !Rate;
    !DiscountValue;

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
      if (!Rate) {
        setErrors((prevErrors) => ({ ...prevErrors, Rate: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Rate: "Please Enter Rate",
        }));
      }
      if (!DiscountValue) {
        setErrors((prevErrors) => ({ ...prevErrors, DiscountValue: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          DiscountValue: "Please Enter Discount",
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
      ProductDetailId: ProductDescription.ProductDetailId,
      ProductDescription: ProductDescription.ProductDescription,
      ProductCategoryName: ProductDescription.ProductCategoryName,
      Rate: Rate,
      UOM: ProductDescription.UOM,
      Quantity,
      Discount: DiscountValue === null ? 0 : DiscountValue,
      netAmount:
        parseInt(Quantity) * parseInt(Rate) -
          parseInt(DiscountValue === null ? 0 : DiscountValue) || 0,
    };

    // Add the new object to the existing array in the state
    setSelectedProductsData((prevData) => [...prevData, newProduct]);
    console.log("SelectedProductsData", newProduct);
    // resetfields();
    setProductDescription(null);
    setQuantity(1);
    setRate(null);
    setDiscountValue(0);
    handleCloseProduct();
  };

  const handleRemoveProduct = (index) => {
    const updatedData = [...SelectedProductsData];
    updatedData.splice(index, 1);
    setSelectedProductsData(updatedData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "ProductDescription") setProductDescription(value);
    if (name === "Quantity") setQuantity(value);
    if (name === "Rate") setRate(value);
    if (name === "DiscountValue") setDiscountValue(value);
    validateInput(name, value);
  };

  const handleInputChangeSelect = (event, newValue) => {
    setProductDescription(newValue);
    setRate(newValue.Rate);
    validateInput(ProductDescription, newValue);
    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, ProductDescription: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        state: "Please select Product Description",
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

    if (name === "ProductDescription") {
      if (!value.trim()) {
        error = true;
        helperText = "Product Description field cannot be empty";
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
    } else if (name === "Rate") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Enter Product Rate";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "DiscountValue") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Enter DiscountV";
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

  const handleRateChange = (event, index) => {
    const currentIndex = page * rowsPerPage + index;
    const newRate = parseInt(event.target.value, 10) || 0;

    setSelectedProductsData((prevData) =>
      prevData.map((product, i) =>
        i === currentIndex
          ? {
              ...product,
              Rate: newRate,
              netAmount: newRate * product.Rate - product.Discount || 0,
            }
          : product
      )
    );
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
              netAmount: newQuantity * product.Rate - product.Discount || 0,
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
              netAmount: product.Quantity * product.Rate - newDiscount || 0,
            }
          : product
      )
    );
  };

  const handleAddOpen = () => {
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const handleClose = () => {
    resetFieldsProducts();
    setOpen(false);
  };

  const handleCloseProduct = () => {
    setOpen(false);
  };

  const totalRows = SelectedProductsData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1));
  useEffect(() => {
    setPage(0);
  }, []);

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
          Sales Invoice
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
            {id && (
              <FormControl size="small" fullWidth>
                <FormLabel component="legend">Invoice Number</FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  name="InvoiceNumber"
                  value={InvoiceNumber === null ? "" : InvoiceNumber}
                  onChange={handleInputChangeSummary}
                  fullWidth
                  size="small"
                  minRows={2}
                  error={errors.InvoiceNumber}
                  helperText={helperTexts.InvoiceNumber}
                  className={
                    isFormSubmitted && errors.InvoiceNumber
                      ? "shake-helper-text"
                      : ""
                  }
                  disabled
                />
              </FormControl>
            )}
            <FormControl size="small" fullWidth>
              <FormLabel component="legend">Invoice Date </FormLabel>
              <TextField
                size="small"
                fullWidth
                type="date"
                name="InvoiceDate"
                value={InvoiceDate}
                onChange={handleInputChangeSummary}
                error={errors.InvoiceDate}
                helperText={helperTexts.InvoiceDate}
                className={
                  isFormSubmitted && errors.InvoiceDate
                    ? "shake-helper-text"
                    : ""
                }
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
              <FormLabel component="legend">Po Ref Number</FormLabel>
              <TextField
                type="number"
                variant="outlined"
                color="primary"
                name="PoRefNumber"
                value={PoRefNumber=== null ? "" : PoRefNumber}
                onChange={handleInputChangeSummary}
                fullWidth
                size="small"
                minRows={2}
                error={errors.PoRefNumber}
                helperText={helperTexts.PoRefNumber}
                className={
                  isFormSubmitted && errors.PoRefNumber? "shake-helper-text" : ""
                }
              />
            </FormControl>

            <FormControl size="small" fullWidth>
              <FormLabel component="legend">Po Ref Date </FormLabel>
              <TextField
                size="small"
                fullWidth
                type="date"
                name="PoRefDate"
                value={PoRefDate}
                onChange={handleInputChangeSummary}
                error={errors.PoRefDate}
                helperText={helperTexts.PoRefDate}
                className={
                  isFormSubmitted && errors.PoRefDate ? "shake-helper-text" : ""
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: calculateMaxDate(),
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
                name="selectedSupplier"
                options={allSupplierData}
                getOptionLabel={(data) => (data ? data.SupplierName : "")}
                isOptionEqualToValue={(option, value) =>
                  option.Supplierid === value.Supplierid
                }
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
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {(rowsPerPage > 0
                    ? SelectedProductsData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : SelectedProductsData
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
                      <TableCell align="center">
                        <TextField
                          type="number"
                          variant="standard"
                          color="primary"
                          name="Rate"
                          value={
                            SelectedProductsData[page * rowsPerPage + index]
                              .Rate
                          }
                          onBlur={handleBlur}
                          onChange={(e) => handleRateChange(e, index)}
                          fullWidth
                          size="small"
                          error={errors.Rate}
                          helperText={helperTexts.Rate}
                          className={
                            isFormSubmitted && errors.Rate
                              ? "shake-helper-text"
                              : ""
                          }
                          sx={{ textAlign: "center" }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
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
                      <TableCell align="center">{data.netAmount}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="Remove"
                          color="error"
                          onClick={() =>
                            handleRemoveProduct(page * rowsPerPage + index)
                          }
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} align="right" padding="1">
                      Total:
                    </TableCell>
                    {/* <TableCell align="center">
                      <Typography variant="h6" color="initial">
                        ₹{totalRate}
                      </Typography>
                    </TableCell> */}
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
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

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
            {SelectedProductsData.length > 0 && (
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
                  onClick={handleSubmitSummary}
                  size="small"
                >
                  {operation === "Edit" ? "Update & Submit" : "Save & Submit"}
                </Button>
              </Stack>
            )}
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
                  Add Product
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>

              <Stack direction={"column"} spacing={2} p={2}>
                <Autocomplete
                  size="small"
                  name="ProductDescription"
                  // options={allProducts}
                  options={allProducts.filter(
                    (product) =>
                      !SelectedProductsData.some(
                        (selectedProduct) =>
                          selectedProduct.ProductDetailId ===
                          product.ProductDetailId
                      )
                  )}
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
                />

                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Discount"
                  name="DiscountValue"
                  value={DiscountValue === null ? "" : DiscountValue}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.DiscountValue}
                  helperText={helperTexts.DiscountValue}
                  className={
                    isFormSubmitted && errors.DiscountValue
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
                  Save
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

export default SalesInvoice;
