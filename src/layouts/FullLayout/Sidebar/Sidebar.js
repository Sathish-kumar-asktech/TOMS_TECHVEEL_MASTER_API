import React from "react";
import { useLocation } from "react-router";
import { Link, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import LogoIcon from "../Logo/LogoIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Transaction from "./Transaction";
import AddRoadIcon from '@mui/icons-material/AddRoad';
import Masters from "./Masters";
import MISReports from "./MISReports";
import "./Sidebar.css";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  const SidebarContent = (
    <Box
      sx={{
        p: 3,
        pb: 5,
        height: "calc(100vh - 40px)",
        overflowY: "scroll",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
        },
      }}
    >
      <Link to="/">
        <Box
          sx={{
            display: "flex",
            alignItems: "Center",
            justifyContent: "center",
            // position:'fixed',
            backgroundColor: "white",
          }}
        >
          <LogoIcon />
        </Box>
      </Link>
      <Box>
        <Box>
          <List
            sx={{
              mt: 2,
              pb: 0,
              mb:0
            }}
          >
            <Divider color="#C3E2C2" />
            <Accordion sx={{ boxShadow: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4" color="initial">
                  Masters
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Masters.map((item, index) => {
                  //{/********SubHeader**********/}
                  return (
                    <>
                      <List component="li" disablePadding key={index}>
                        <ListItem
                          onClick={() => handleClick(index)}
                          button
                          component={NavLink}
                          to={item.href}
                          selected={pathDirect === item.href}
                          sx={{
                            ...(pathDirect === item.href && {
                              color: "white",
                              backgroundColor: (theme) =>
                                `${theme.palette.primary.main}!important`,
                            }),
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ...(pathDirect === item.href && {
                                color: "white",
                              }),
                            }}
                          >
                            <item.icon
                              width="10"
                              height="10"
                              color="secondary"
                              sx={{
                                ...(pathDirect === item.href && {
                                  color: "white",
                                }),
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText>{item.title}</ListItemText>
                        </ListItem>
                      </List>
                    </>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </List>
        </Box>
        <Box>
          <List
            sx={{
              pb: 0,
            }}
          >
            <Divider color="#C3E2C2" />
            <Accordion sx={{ boxShadow: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5" color="initial">
                  Transactions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Transaction.map((item, index) => {
                  //{/********SubHeader**********/}
                  return (
                    <>
                      <List component="li" disablePadding key={index}>
                        <ListItem
                          onClick={() => handleClick(index)}
                          button
                          component={NavLink}
                          to={item.href}
                          selected={pathDirect === item.href}
                          sx={{
                            ...(pathDirect === item.href && {
                              color: "white",
                              backgroundColor: (theme) =>
                                `${theme.palette.primary.main}!important`,
                            }),
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ...(pathDirect === item.href && {
                                color: "white",
                              }),
                            }}
                          >
                            <item.icon
                              width="10"
                              height="10"
                              color="secondary"
                              sx={{
                                ...(pathDirect === item.href && {
                                  color: "white",
                                }),
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText>{item.title}</ListItemText>
                        </ListItem>
                      </List>
                    </>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </List>
        </Box>
        <Box>
          <List
            sx={{
              pb: 0,
            }}
          >
            <Divider color="#C3E2C2" />
            <Accordion sx={{ boxShadow: 0 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h4" color="initial">
                  Reports
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {MISReports.map((item, index) => {
                  //{/********SubHeader**********/}
                  return (
                    <>
                      <List component="li" disablePadding key={index}>
                        <ListItem
                          onClick={() => handleClick(index)}
                          button
                          component={NavLink}
                          to={item.href}
                          selected={pathDirect === item.href}
                          sx={{
                            ...(pathDirect === item.href && {
                              color: "white",
                              backgroundColor: (theme) =>
                                `${theme.palette.primary.main}!important`,
                            }),
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              ...(pathDirect === item.href && {
                                color: "white",
                              }),
                            }}
                          >
                            <item.icon
                              width="10"
                              height="10"
                              color="secondary"
                              sx={{
                                ...(pathDirect === item.href && {
                                  color: "white",
                                }),
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText>{item.title}</ListItemText>
                        </ListItem>
                      </List>
                    </>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </List>
        </Box>
      </Box>
    </Box>
  );
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={props.isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      PaperProps={{
        sx: {
          width: SidebarWidth,
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;
