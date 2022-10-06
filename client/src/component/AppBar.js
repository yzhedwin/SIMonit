/* eslint-disable no-unused-vars */
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DrawerHeader, DrawerIcon, Main } from "./Drawer";
const pages = ["Dashboard", "StaticPage", "Test"];
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ResponsiveAppBar = ({ openDrawer, onOpenDrawerChange }) => {
  let location = useLocation();
  const theme = useTheme();
  //MENU STUFF
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [navOpacity, setNavOpacity] = React.useState(1);
  const [direction, setDirection] = React.useState("up");
  const [scrollPos, setScrollPos] = React.useState(0);
  let prevScrollY = 0;

  const handleDrawerOpen = () => {
    onOpenDrawerChange(true);
  };

  const handleDrawerClose = () => {
    onOpenDrawerChange(false);
  };

  const navRef = React.useRef();
  let count = 0;
  navRef.current = navOpacity;
  const handleScroll = () => {
    const pos = window.scrollY;
    setScrollPos(pos);
    //Nav Bar Animation
    if (window.scrollY > prevScrollY) {
      if (count < 10) {
        count++;
      }
      navRef.current = navRef.current - count / 10;
      setNavOpacity(navRef.current);
      setDirection("down");
    } else {
      count = 0;
      setDirection("up");
    }
    prevScrollY = window.scrollY;
  };

  React.useEffect(() => {
    if (direction === "up") {
      setNavOpacity(1);
    }
  }, [direction]);

  React.useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  //Redirection
  const navigate = useNavigate();

  const renderEmpty = () => {
    return <div></div>;
  };

  const render = () => {
    return (
      <div>
        <AppBar
          style={{
            opacity: navRef.current,
            backgroundColor: "#2E3B55",
            transition: "all 500ms ease-in-out",
          }}
          open={openDrawer}
          position="fixed"
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <DrawerIcon
                handleDrawerOpen={handleDrawerOpen}
                openDrawer={openDrawer}
              />
              <Icon
                sx={{
                  display: { xs: "none", md: "flex" },
                  mr: 1,
                  fontSize: 50,
                }}
              >
                <img
                  src={
                    "https://si-asia.com/wp-content/uploads/2019/09/s-l-logo-h.png"
                  }
                  height={50}
                  width={50}
                  alt="si-logo"
                />
              </Icon>
              <Typography
                title="home"
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  ml: 2,
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                SIMonit
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="xs-side-nav"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="xs-menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        navigate("/" + page);
                      }}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Icon
                sx={{
                  display: { xs: "flex", md: "none" },
                  mr: 1,
                  fontSize: 50,
                }}
              >
                <img
                  src={
                    "https://si-asia.com/wp-content/uploads/2019/09/s-l-logo-h.png"
                  }
                  height={50}
                  width={50}
                  alt="xs-si-logo"
                />
              </Icon>
              <Typography
                title="xs-home"
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                SIMonit
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => navigate("/" + page)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={openDrawer}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {["Dashboard", "StaticPage", "Test"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
      </div>
    );
  };
  //can be refractored to include more pages
  return location.pathname.indexOf("/StaticPage") === -1 && navRef.current > 0
    ? render()
    : renderEmpty();
};
export default ResponsiveAppBar;
