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
import { Phone } from "@mui/icons-material";

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: "#F5F7F8",
  fontWeight: "600",
  textAlign: "center",
  backgroundColor: "#3081D0",
  whiteSpace: "nowrap",
});

const Customer = () => {
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
  const [CustomerName, setCustomerName] = useState("");
  const [Address, setAddress] = useState("");
  const [PinCode, setPinCode] = useState(null);
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [Country, setCountry] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [ActiveStatus, setActiveStatus] = useState("y");

  const [allData, setallData] = useState([]);
  const [allbankData, setallbankData] = useState([]);
  const [allCountryData, setallCountryData] = useState([]);
  const [allStateData, setallStateData] = useState([]);
  const [allCityData, setallCityData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [openLoader, setOpenLoader] = useState(false);

  const [errors, setErrors] = useState({
    CustomerName: false,
    Address: false,
    PinCode: false,
    City: false,
    State: false,
    Country: false,
    PhoneNo: false,
    EmailId: false,
    ActiveStatus: false,
  });

  const [helperTexts, setHelperTexts] = useState({
    CustomerName: "",
    Address: "",
    PinCode: "",
    City: "",
    State: "",
    Country: "",
    PhoneNo: "",
    EmailId: "",
    ActiveStatus: "",
  });

  const resetFields = () => {
    setCustomerName("");
    setAddress("");
    setPinCode(null);
    setCity("");
    setCountry("");
    setState("");
    setPhoneNo(null);
    setEmailId("");
    setActiveStatus("");

    errors.CustomerName = false;
    errors.Address = false;
    errors.PinCode = false;
    errors.City = false;
    errors.State = false;
    errors.Country = false;
    errors.PhoneNo = false;
    errors.EmailId = false;
    errors.ActiveStatus = false;

    helperTexts.CustomerName = "";
    helperTexts.Address = "";
    helperTexts.PinCode = "";
    helperTexts.City = "";
    helperTexts.State = "";
    helperTexts.Country = "";
    helperTexts.PhoneNo = "";
    helperTexts.EmailId = "";
    helperTexts.ActiveStatus = "";
  };

  // API Integration
  useEffect(() => {
    getData();
    getAllCountry();
    getAllState();
    getAllCity();
  }, []);

  // Reset page to 0 when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // get all Product Category  Request
  const getAllCountry = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllCountry", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setallCountryData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all Product Category  Request
  const getAllState = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllStates", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setallStateData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // get all Product Category  Request
  const getAllCity = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllCity", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setallCityData(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  // get all Users Request
  const getData = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllCustomer", {
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
      const res = await axios.instance.post("/InsertCustomer", newRecord, {
        headers: {
          Authorization: tokent,
          "Content-Type": "application/json",
        },
      });
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
    setEditID(data.Customerid);
    setCustomerName(data.CustomerName);
    setAddress(data.Address);
    setPinCode(data.PinCode);
    setPhoneNo(data.PhoneNo);
    setEmailId(data.EmailId);
    setActiveStatus(data.ActiveStatus);
    const selectedCity = allCityData.find((cdata) => cdata.City === data.City);
    console.log(selectedCity, "selectedCity");
    setCity(selectedCity);

    const selectedState = allStateData.find(
      (cdata) => cdata.State === data.State
    );
    setState(selectedState);

    const selectedCountry = allCountryData.find(
      (cdata) => cdata.Country === data.Country
    );
    setCountry(selectedCountry);


    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation("Edit");
  };

  const updateData = async (editID, updatedData) => {
    try {
      await axios.instance.put(`/UpdateCustomer/${editID}`, updatedData, {
        headers: {
          Authorization: tokent,
          "Content-Type": "application/json",
        },
      });
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
        .delete(`/DeleteCustomer/${deleteId}`, {
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
      errors.CustomerName ||
      errors.Address ||
      errors.PinCode ||
      errors.City ||
      errors.State ||
      errors.Country ||
      errors.PhoneNo ||
      errors.EmailId ||
      errors.ActiveStatus ||
      !CustomerName ||
      !Address ||
      !PinCode ||
      !City ||
      !State ||
      !Country ||
      !PhoneNo ||
      !EmailId ||
      !ActiveStatus;

    // console.log('inputValidation',inputValidation2)

    if (inputValidation) {
      if (!CustomerName) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          CustomerName: true,
        }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          CustomerName: "Please Enter Customer Name",
        }));
      }
      if (!Address) {
        setErrors((prevErrors) => ({ ...prevErrors, Address: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Address: "Please Enter Address",
        }));
      }
      if (!City) {
        setErrors((prevErrors) => ({ ...prevErrors, City: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          City: "Please Select City",
        }));
      }
      if (!State) {
        setErrors((prevErrors) => ({ ...prevErrors, State: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          State: "Please Select State",
        }));
      }
      if (!Country) {
        setErrors((prevErrors) => ({ ...prevErrors, Country: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Country: "Please Select Country",
        }));
      }
      if (!PinCode) {
        setErrors((prevErrors) => ({ ...prevErrors, PinCode: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          PinCode: "Please Enter Pincode",
        }));
      }
      if (!PhoneNo) {
        setErrors((prevErrors) => ({ ...prevErrors, PhoneNo: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          PhoneNo: "Please Enter Phone Number",
        }));
      }
      if (!EmailId) {
        setErrors((prevErrors) => ({ ...prevErrors, EmailId: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          EmailId: "Please Enter Email",
        }));
      }
      if (!ActiveStatus) {
        setErrors((prevErrors) => ({ ...prevErrors, ActiveStatus: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          ActiveStatus: "Please Select Active Status",
        }));
      }
    }

    if (inputValidation) {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      CustomerName: false,
      Address: false,
      PinCode: false,
      City: false,
      State: false,
      Country: false,
      PhoneNo: false,
      EmailId: false,
      ActiveStatus: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      CustomerName: "",
      Address: "",
      PinCode: "",
      City: "",
      State: "",
      Country: "",
      PhoneNo: "",
      EmailId: "",
      ActiveStatus: "",
    }));

    const newData = {
      CustomerName,
      Address,
      PinCode,
      City: City.City,
      State: State.State,
      Country: Country.Country,
      PhoneNo,
      EmailId,
      ActiveStatus,
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
    if (name === "CustomerName") setCustomerName(value);
    if (name === "Address") setAddress(value);
    if (name === "PinCode") setPinCode(value);
    if (name === "City") setCity(value);
    if (name === "State") setState(value);
    if (name === "Country") setCountry(value);
    if (name === "PhoneNo") setPhoneNo(value);
    if (name === "EmailId") setEmailId(value);
    if (name === "ActiveStatus") setActiveStatus(value);
    validateInput(name, value);
  };

  const handleInputChangeCity = (event, newValue) => {
    setCity(newValue);
    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, City: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        City: "Please select City",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, City: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, City: "" }));
    }
  };

  const handleInputChangeState = (event, newValue) => {
    setState(newValue);
    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, State: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        State: "Please select State",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, State: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, State: "" }));
    }
  };

  const handleInputChangeCountry = (event, newValue) => {
    setCountry(newValue);
    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, Country: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        Country: "Please select Country",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, Country: false }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        Country: "",
      }));
    }
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = "";
    const isDataExists = allData.some(
      (data) => data.CustomerName.toLowerCase() === value.toLowerCase().trim()
    );
    const isDataExistsinEdit = allData.some(
      (data) =>
        data.CustomerName.toLowerCase() === value.toLowerCase().trim() &&
        data.Customerid !== editID
    );

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactRegex = /^\d{10}$/;

    if (name === "CustomerName") {
      if (!value.trim()) {
        error = true;
        helperText = "Customer Name field cannot be empty";
        setIsFormSubmitted(false);
      } else if (operation === "Add" && isDataExists) {
        error = true;
        helperText = "Customer Name already exists";
        setIsFormSubmitted(false);
      } else if (operation === "Edit" && isDataExistsinEdit) {
        error = true;
        helperText = "Customer Name already exists";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "Address") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Enter Address";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "PinCode") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Enter Pin Code";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "City") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Select City";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "State") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Select State";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "Country") {
      if (!value.trim()) {
        error = true;
        helperText = "Please Select Country";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "EmailId") {
      if (!value.trim()) {
        error = true;
        helperText = "email field cannot be empty";
        setIsFormSubmitted(false);
      } else if (!emailRegex.test(value)) {
        error = true;
        helperText = "please enter a valid email";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "PhoneNo") {
      if (!value.trim()) {
        error = true;
        helperText = "Phone Number field cannot be empty";
        setIsFormSubmitted(false);
      } else if (!contactRegex.test(value) && value.length > 10) {
        error = true;
        helperText = "cannot exceed more than 10 numbers";
        setIsFormSubmitted(false);
      } else if (value.length < 10) {
        error = true;
        helperText = "cannot be less than 10 numbers";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    }  else if (name === "ActiveStatus") {
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
            label="Customer Master"
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
                <StyledTableCell>Company Name</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Pin Code</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>State</StyledTableCell>
                <StyledTableCell>Country</StyledTableCell>
                <StyledTableCell>PhoneNo</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
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
                <TableRow key={data.Customerid} hover>
                  <TableCell align="center">{data.SNo}</TableCell>
                  <TableCell align="center" style={{ whiteSpace: "nowrap" }}>
                    {data.CustomerName}
                  </TableCell>
                  <TableCell align="center" style={{ whiteSpace: "nowrap" }}>
                    {data.Address}
                  </TableCell>
                  <TableCell align="center">{data.PinCode}</TableCell>
                  <TableCell align="center">{data.City}</TableCell>
                  <TableCell align="center">{data.State}</TableCell>
                  <TableCell align="center">{data.Country}</TableCell>
                  <TableCell align="center">{data.PhoneNo}</TableCell>
                  <TableCell
                    align="center"
                    style={{ textTransform: "lowercase" }}
                  >
                    {data.EmailId}
                  </TableCell>
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
                      onClick={() => handleDelete(data.Customerid)}
                    >
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={12} />
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
          maxWidth="md"
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
                  {operation} Company
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
                  label="Customer Name"
                  name="CustomerName"
                  value={CustomerName === null ? "" : CustomerName}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.CustomerName}
                  helperText={helperTexts.CustomerName}
                  className={
                    isFormSubmitted && errors.CustomerName
                      ? "shake-helper-text"
                      : ""
                  }
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Address"
                  name="Address"
                  value={Address === null ? "" : Address}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.Address}
                  helperText={helperTexts.Address}
                  className={
                    isFormSubmitted && errors.Address ? "shake-helper-text" : ""
                  }
                />
                 <Autocomplete
                  size="small"
                  name="Country"
                  options={allCountryData}
                  getOptionLabel={(data) => (data ? data.Country : "")}
                  value={Country || null}
                  onChange={handleInputChangeCountry}
                  renderInput={(params) => (
                    <TextField {...params} label="Please Select Country" />
                  )}
                />
                {errors.Country && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 2 }}
                    color="error"
                    className={
                      isFormSubmitted && errors.Country
                        ? "shake-helper-text"
                        : ""
                    }
                  >
                    {errors.Country && helperTexts.Country}
                  </Typography>
                )}
                <Autocomplete
                  size="small"
                  name="State"
                  options={allStateData}
                  getOptionLabel={(data) => (data ? data.State : "")}
                  value={State || null}
                  onChange={handleInputChangeState}
                  renderInput={(params) => (
                    <TextField {...params} label="Please Select State" />
                  )}
                />
                {errors.State && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 2 }}
                    color="error"
                    className={
                      isFormSubmitted && errors.State ? "shake-helper-text" : ""
                    }
                  >
                    {errors.City && helperTexts.State}
                  </Typography>
                )}
               
                <Autocomplete
                  size="small"
                  name="City"
                  options={allCityData}
                  getOptionLabel={(data) => (data ? data.City : "")}
                  value={City || null}
                  onChange={handleInputChangeCity}
                  renderInput={(params) => (
                    <TextField {...params} label="Please Select City" />
                  )}
                />
                {errors.City && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 2 }}
                    color="error"
                    className={
                      isFormSubmitted && errors.City ? "shake-helper-text" : ""
                    }
                  >
                    {errors.City && helperTexts.City}
                  </Typography>
                )}

                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Pin Code"
                  name="PinCode"
                  value={PinCode === null ? "" : PinCode}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.PinCode}
                  helperText={helperTexts.PinCode}
                  className={
                    isFormSubmitted && errors.PinCode ? "shake-helper-text" : ""
                  }
                />

                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Phone"
                  name="PhoneNo"
                  value={PhoneNo === null ? "" : PhoneNo}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.PhoneNo}
                  helperText={helperTexts.PhoneNo}
                  className={
                    isFormSubmitted && errors.PhoneNo ? "shake-helper-text" : ""
                  }
                />

                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Email"
                  name="EmailId"
                  value={EmailId === null ? "" : EmailId}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.EmailId}
                  helperText={helperTexts.EmailId}
                  className={
                    isFormSubmitted && errors.EmailId ? "shake-helper-text" : ""
                  }
                />

             

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

export default Customer;
