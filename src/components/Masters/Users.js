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

const Users = () => {
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
  const [UserCode, setUserCode] = useState("");
  const [UserName, setUserName] = useState("");
  const [UserPassWord, setUserPassWord] = useState("");
  const [ActiveStatus, setActiveStatus] = useState("y");
  const [usersData, setusersData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [openLoader, setOpenLoader] = useState(false);

  const [errors, setErrors] = useState({
    UserCode: false,
    UserName: false,
    UserPassWord: false,
    ActiveStatus: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    UserCode: "",
    UserName: "",
    UserPassWord: "",
    ActiveStatus: "",
  });

  const resetFields = () => {
    setUserCode("");
    setUserName("");
    setUserPassWord("");
    setActiveStatus("");
    errors.UserCode = false;
    errors.UserName = false;
    errors.UserPassWord = false;
    errors.ActiveStatus = false;
    helperTexts.UserCode = "";
    helperTexts.UserName = "";
    helperTexts.ActiveStatus = "";
  };

  // API Integration
  useEffect(() => {
    getUsers();
  }, []);

  // Reset page to 0 when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // get all Users Request
  const getUsers = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get("/GetAllUsers", {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setusersData(res.data);
      setOpenLoader(false);
      console.log("users", res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // post Request to Add new record
  const InsertUser = async (newUser) => {
    try {
      const res = await axios.instance.post("/InsertUsers", newUser, {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      getUsers();
      setAlertType("success");
      setAlertMessage("New User Added Successfully!");
      setopenAlert(true);
    } catch (error) {
      console.error("Error adding User:", error);
      setAlertType("error");
      setAlertMessage("Failed to add the User.");
      setopenAlert(true);
    }
  };

  // put Request to edit record

  const handleEdit = (user) => {
    console.log("handleEdit", user);
    setEditID(user.Userid);
    setUserCode(user.UserCode);
    setUserName(user.UserName);
    setUserPassWord(user.UserPassWord);
    setActiveStatus(user.ActiveStatus);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation("Edit");
  };

  const updateUser = async (userId, updatedUser) => {
    try {
      await axios.instance.put(`/UpdateUsers/${userId}`, updatedUser, {
        headers: { Authorization: tokent, "Content-Type": "application/json" },
      });
      setopenAlert(true);
      setEditID();
      getUsers();
      setAlertType("success");
      setAlertMessage("User Updated Successfully!");
    } catch (error) {
      console.error("Error updating User:", error);
      setAlertType("error");
      setAlertMessage("Failed to update the User.");
      setopenAlert(true);
    }
  };

  // delete Request to delete record

  const handleDelete = (courseId) => {
    setOpenDelete(true);
    setIdToDelete(courseId);
  };

  const handleDeleteConfirmed = (courseId) => {
    deleteUser(courseId);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.instance
        .delete(`/DeleteUsers/${userId}`, {
          headers: {
            Authorization: tokent,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data === "") {
            getUsers();
            setOpenDelete(false);
            setAlertType("warning");
            setAlertMessage("User Deleted Successfully!");
            setopenAlert(true);
          } else {
            getUsers();
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
      console.error("Error deleting User:", error);
      setAlertType("error");
      setAlertMessage("Failed to delete the User.");
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputValidation =
      errors.UserCode ||
      errors.UserName ||
      errors.UserPassWord ||
      errors.ActiveStatus ||
      !UserCode ||
      !UserName ||
      !UserPassWord ||
      !ActiveStatus;

    if (inputValidation) {
      if (!UserCode) {
        setErrors((prevErrors) => ({ ...prevErrors, UserCode: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          UserCode: "Please Enter User Code",
        }));
      }
      if (!UserName) {
        setErrors((prevErrors) => ({ ...prevErrors, UserName: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          UserName: "Please Enter User Name",
        }));
      }
      if (!UserPassWord) {
        setErrors((prevErrors) => ({ ...prevErrors, UserPassWord: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          UserPassWord: "Please Enter User Password",
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
      UserCode: false,
      UserName: false,
      UserPassWord: false,
      ActiveStatus: false,
    }));

    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      UserCode: "",
      UserName: "",
      UserPassWord: "",
      ActiveStatus: "",
    }));

    const newData = {
      UserCode,
      UserName,
      UserPassWord,
      ActiveStatus,
      [operation === "Edit" ? "ModifyBy" : "CreatedBy"]: 86,
    };

    console.log("submitted", newData);

    console.log("added data", newData);

    if (operation === "Add") {
      InsertUser(newData);
    } else if (operation === "Edit") {
      console.log(editID, newData);
      updateUser(editID, newData);
    }
    resetFields();
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "UserCode") setUserCode(value);
    if (name === "UserName") setUserName(value);
    if (name === "UserPassWord") setUserPassWord(value);
    if (name === "ActiveStatus") setActiveStatus(value);
    validateInput(name, value);
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = "";
    const contactRegex = /^\d{10}$/;
    const passWordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
    const isDataExists = usersData.some(
      (data) => data.UserName.toLowerCase() === value.toLowerCase().trim()
    );
    const isDataExistsinEdit = usersData.some(
      (data) =>
        data.UserName.toLowerCase() === value.toLowerCase().trim() &&
        data.Userid !== editID
    );

    if (name === "UserName") {
      if (!value.trim()) {
        error = true;
        helperText = "User Name field cannot be empty";
        setIsFormSubmitted(false);
      } else if (operation === "Add" && isDataExists) {
        error = true;
        helperText = "User Name already exists";
        setIsFormSubmitted(false);
      } else if (operation === "Edit" && isDataExistsinEdit) {
        error = true;
        helperText = "User Name already exists";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "UserCode") {
      if (!value.trim()) {
        error = true;
        helperText = "User Code cannot be empty";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "UserPassWord") {
      if (!value.trim()) {
        error = true;
        helperText = "User Password field cannot be empty";
        setIsFormSubmitted(false);
      } else if (!passWordRegex.test(value)) {
        error = true;
        helperText =
          "Password must meet the requirements: at least one uppercase letter, one lowercase letter or number, and one special character (!@#$%^&*), for example; User@123456";
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true);
      }
    } else if (name === "ActiveStatus") {
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
  const filteredData = usersData.filter((enq) => {
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
            label="Users Master"
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
            Add User
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>User Code</StyledTableCell>
                <StyledTableCell>User Name</StyledTableCell>
                <StyledTableCell>Password</StyledTableCell>
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
                <TableRow key={data.Userid} hover>
                  <TableCell align="center">{data.SNo}</TableCell>
                  <TableCell align="center">{data.UserCode}</TableCell>
                  <TableCell align="center">{data.UserName}</TableCell>
                  <TableCell align="center">{data.UserPassWord}</TableCell>
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
                      onClick={() => handleDelete(data.Userid)}
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
                  {operation} User
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
                  label="User Code"
                  name="UserCode"
                  value={UserCode === null ? "" : UserCode}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.UserCode}
                  helperText={helperTexts.UserCode}
                  className={
                    isFormSubmitted && errors.UserCode
                      ? "shake-helper-text"
                      : ""
                  }
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="User Name"
                  name="UserName"
                  value={UserName === null ? "" : UserName}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.UserName}
                  helperText={helperTexts.UserName}
                  className={
                    isFormSubmitted && errors.UserName
                      ? "shake-helper-text"
                      : ""
                  }
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Password"
                  name="UserPassWord"
                  value={UserPassWord === null ? "" : UserPassWord}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={errors.UserPassWord}
                  helperText={helperTexts.UserPassWord}
                  className={
                    isFormSubmitted && errors.UserPassWord
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

export default Users;
