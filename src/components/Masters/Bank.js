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

const Bank = () => {
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
  const [Bankname, setBankname] = useState("");
  const [AccNum, setAccNum] = useState(null);
  const [IFSCCode, setIFSCCode] = useState("");  
  const [Branch, setBranch] = useState("");
  const [ActiveStatus, setActiveStatus] = useState("y");
  const [AllData, setAllData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [openLoader, setOpenLoader] = useState(false);

  const [errors, setErrors] = useState({
    Bankname: false,
    AccNum: false,
    IFSCCode: false,
    Branch:false,
    ActiveStatus: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    Bankname: "",
    AccNum: "",
    IFSCCode: "",
    Branch: "",
    ActiveStatus: "",
  });

  const resetFields = () => {
    setBankname("");
    setAccNum(null);
    setIFSCCode("");
    setBranch('');
    setActiveStatus("");
    errors.Bankname = false;
    errors.AccNum = false;
    errors.IFSCCode = false;    
    errors.Branch = false;
    errors.ActiveStatus = false;
    helperTexts.Bankname = "";
    helperTexts.AccNum = "";
    helperTexts.IFSCCode = "";
    helperTexts.Branch = "";    
    helperTexts.ActiveStatus = "";
  };

  // API Integration
  useEffect(() => {
    getAllData();
  }, []);

  // Reset page to 0 when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // get all Users Request
  const getAllData = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllBank", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setAllData(res.data);
      setOpenLoader(false);
      console.log("users", res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // post Request to Add new record
  const InsertData = async (data) => {
    try {
      const res = await axios.instance.post("/InsertBank", data, {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      getAllData();
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
    setEditID(data.Bankid);
    setBankname(data.Bankname);
    setAccNum(data.AccNum);
    setIFSCCode(data.IFSCCode);
    setBranch(data.Branch)
    setActiveStatus(data.ActiveStatus);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation("Edit");
  };
  
  const updateData = async (editID, updatedData) => {
    try {
      await axios.instance.put(`/UpdateBank/${editID}`, updatedData, {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setopenAlert(true);
      setEditID();
      getAllData();
      setAlertType("success");
      setAlertMessage("Data Updated Successfully!");
    } catch (error) {
      console.error("Error updating Data:", error);
      setAlertType("error");
      setAlertMessage("Failed to update the Data.");
      setopenAlert(true);
    }
  };

  // delete Request to delete record

  const handleDelete = (deleteID) => {
    setOpenDelete(true);
    setIdToDelete(deleteID);
  };

  const handleDeleteConfirmed = (deleteID) => {
    deleteUser(deleteID);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const deleteUser = async (deleteID) => {
    try {
      await axios.instance
        .delete(`/DeleteBank/${deleteID}`, {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data === "") {
            getAllData();
            setOpenDelete(false);
            setAlertType("warning");
            setAlertMessage("Data Deleted Successfully!");
            setopenAlert(true);
          } else {
            getAllData();
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
      errors.Bankname ||
      errors.AccNum ||
      errors.IFSCCode ||    
      errors.Branch ||
      errors.ActiveStatus ||
      !Bankname ||
      !AccNum ||
      !IFSCCode ||
      !Branch ||
      !ActiveStatus;

    if (inputValidation) {
      if (!Bankname) {
        setErrors((prevErrors) => ({ ...prevErrors, Bankname: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Bankname: "Please Enter Bank Name",
        }));
      }
      if (!AccNum) {
        setErrors((prevErrors) => ({ ...prevErrors, AccNum: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          AccNum: "Please Enter Account Number",
        }));
      }
      if (!IFSCCode) {
        setErrors((prevErrors) => ({ ...prevErrors, IFSCCode: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          IFSCCode: "Please Enter IFSC Code",
        }));
      }
      if (!Branch) {
        setErrors((prevErrors) => ({ ...prevErrors, Branch: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          Branch: "Please Enter Branch",
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
      Bankname: false,
      AccNum: false,
      IFSCCode: false,
      Branch:false,
      ActiveStatus: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      Bankname: "",
      AccNum: "",
      IFSCCode: "",
      Branch:"",
      ActiveStatus: "",
    }));

    const newData = {
      Bankname,
      AccNum,
      IFSCCode,
      Branch,
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
    if (name === "Bankname") setBankname(value);
    if (name === "AccNum") setAccNum(value);
    if (name === "IFSCCode") setIFSCCode(value);
    if (name === "Branch") setBranch(value);
    if (name === "ActiveStatus") setActiveStatus(value);
    validateInput(name, value);
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = "";
    const contactRegex = /^\d{10}$/;
    const passWordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
    const isDataExists = AllData.some(
      (data) => data.AccNum.toLowerCase() === value.toLowerCase().trim()
    );
    const isDataExistsinEdit = AllData.some(
      (data) =>
        data.AccNum.toLowerCase() === value.toLowerCase().trim() &&
        data.Bankid !== editID
    );

    if (name === "AccNum") {
      if (!value.trim()) {
        error = true;
        helperText = "Account Number field cannot be empty";
        setIsFormSubmitted(false);
      } else if (operation === "Add" && isDataExists) {
        error = true;
        helperText = "Account Number already exists";
        setIsFormSubmitted(false);
      } else if (operation === "Edit" && isDataExistsinEdit) {
        error = true;
        helperText = "Account Number already exists";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "Bankname") {
      if (!value.trim()) {
        error = true;
        helperText = "Bank Name cannot be empty";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "IFSCCode") {
      if (!value.trim()) {
        error = true;
        helperText = "IFSC Code cannot be empty";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "Branch") {
      if (!value.trim()) {
        error = true;
        helperText = "Branch cannot be empty";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    }else if (name === "ActiveStatus") {
      if (!value.trim()) {
        error = true;
        helperText = "Plaese select user status";
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
  const filteredData = AllData.filter((enq) => {
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
            <Chip label="Bank Master" color="primary" size="medium"  variant="filled"/>          
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
            Add Bank
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Bank Name</StyledTableCell>
                <StyledTableCell>Acc Number</StyledTableCell>
                <StyledTableCell>IFSC Code</StyledTableCell>                
                <StyledTableCell>Branch</StyledTableCell>                
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
                <TableRow key={data.Bankid} hover>
                  <TableCell align="center">{data.SNo}</TableCell>
                  <TableCell align="center">{data.Bankname}</TableCell>
                  <TableCell align="center">{data.AccNum}</TableCell>
                  <TableCell align="center">{data.IFSCCode}</TableCell>                  
                  <TableCell align="center">{data.Branch}</TableCell>
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
                      onClick={() => handleDelete(data.Bankid)}
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
                  {operation} Bank
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
                  label="Bank Name"
                  autoComplete="off"
                  name="Bankname"
                  value={Bankname === null ? "" : Bankname}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.Bankname}
                  helperText={helperTexts.Bankname}
                  className={
                    isFormSubmitted && errors.Bankname
                      ? "shake-helper-text"
                      : ""
                  }
                />
                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Account Number"
                  name="AccNum"
                  autoComplete="off"
                  value={AccNum === null ? "" : AccNum}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.AccNum}
                  helperText={helperTexts.AccNum}
                  className={
                    isFormSubmitted && errors.AccNum
                      ? "shake-helper-text"
                      : ""
                  }
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="IFSC Code"
                  autoComplete="off"
                  name="IFSCCode"
                  value={IFSCCode === null ? "" : IFSCCode}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.IFSCCode}
                  helperText={helperTexts.IFSCCode}
                  className={
                    isFormSubmitted && errors.IFSCCode
                      ? "shake-helper-text"
                      : ""
                  }
                />
                 <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Branch"
                  name="Branch"
                  autoComplete="off"
                  value={Branch === null ? "" : Branch}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.Branch}
                  helperText={helperTexts.Branch}
                  className={
                    isFormSubmitted && errors.Branch
                      ? "shake-helper-text"
                      : ""
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

export default Bank;
