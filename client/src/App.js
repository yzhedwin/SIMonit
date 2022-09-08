import * as React from "react";
import ResponsiveAppBar from "./component/AppBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import StaticPage from "./pages/StaticPage";
import ResizablePage from "./pages/ResizablePage";
import Dashboard from "./pages/Dashboard";
import ToolboxLayout from "./pages/Toolbox";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#0971f1",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDrawer: false,
    };
    this.handleOpenDrawerChange = this.handleOpenDrawerChange.bind(this);
  }

  handleOpenDrawerChange(event) {
    this.setState({ openDrawer: event });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ResponsiveAppBar
            openDrawer={this.state.openDrawer}
            onOpenDrawerChange={this.handleOpenDrawerChange}
          />
          <Routes>
            <Route
              index
              element={<Home openDrawer={this.state.openDrawer} />}
            />
            <Route
              path="Dashboard"
              element={<Dashboard openDrawer={this.state.openDrawer} />}
            />
            <Route path="Toolbox" element={<ToolboxLayout />} />
            {/* <Route path="ResizablePage" element={<ResizablePage  />} /> */}
            {/* <Route path="StaticPage" element={<StaticPage />} /> */}
            {/* <Route path="StaticPage/:did" element={<StaticPage />} /> */}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}
export default App;
