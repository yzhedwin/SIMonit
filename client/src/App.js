import * as React from "react";
import ResponsiveAppBar from "./component/AppBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import StaticPage from "./pages/StaticPage";
import ResizablePage from "./pages/ResizablePage";
import OptimisedDashboard from "./pages/OptimisedDashboard";

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
      <BrowserRouter>
        <ResponsiveAppBar
          openDrawer={this.state.openDrawer}
          onOpenDrawerChange={this.handleOpenDrawerChange}
        />
        <Routes>
          <Route index element={<Home  openDrawer={this.state.openDrawer}/>} />
          <Route path="Dashboard" element={<OptimisedDashboard openDrawer={this.state.openDrawer}/>} />
          <Route path="ResizablePage" element={<ResizablePage />} />
          <Route path="StaticPage" element={<StaticPage />} />
          <Route path="StaticPage/:did" element={<StaticPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
export default App;
