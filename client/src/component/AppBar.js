import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./AppBar.css";
import AdbIcon from "@mui/icons-material/Adb";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Icon,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DrawerIcon, RenderDrawer } from "./Drawer";

const pages = ["Dashboard", "ResizablePage"];

const ResponsiveAppBar = ({ openDrawer, onOpenDrawerChange }) => {
  let location = useLocation();

  //MENU STUFF
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [navBackground, setNavBackground] = React.useState("transparent");

  const handleDrawerOpen = () => {
    onOpenDrawerChange(true);
  };

  const handleDrawerClose = () => {
    onOpenDrawerChange(false);
  };

  const navRef = React.useRef();

  navRef.current = navBackground;

  React.useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 300;
      if (show) {
        setNavBackground("#2E3B55");
      } else {
        setNavBackground("transparent");
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
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
            backgroundColor: navRef.current,
          }}
          position="fixed"
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <DrawerIcon
                handleDrawerOpen={handleDrawerOpen}
                openDrawer={openDrawer}
              />
              <Icon sx={{ fontSize: 50, display: "flex" }}>
                <img
                  src={
                    "https://si-asia.com/wp-content/uploads/2019/09/s-l-logo-h.png"
                  }
                  height={50}
                  width={50}
                  alt=""
                />
              </Icon>
              <Typography
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
                SimpleWeb
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
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
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                SimpleWeb
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
        <RenderDrawer
          handleDrawerClose={handleDrawerClose}
          openDrawer={openDrawer}
        />
      </div>
    );
  };
  //can be refractored to include more pages
  return location.pathname.indexOf("/StaticPage") === -1
    ? render()
    : renderEmpty();
};
export default ResponsiveAppBar;
