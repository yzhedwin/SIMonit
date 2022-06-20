import * as React from 'react';
import ResponsiveAppBar from './component/AppBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import ResizableGrid from './pages/ResizableGrid';
import StaticPage from './pages/StaticPage';
import ResizablePage from './pages/ResizablePage';
import OptimisedDashboard from './pages/OptimisedDashboard';


class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <ResponsiveAppBar />
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="OptimisedDashboard" element={<OptimisedDashboard/>} />
                    <Route path="ResizableGrid" element={<ResizableGrid />} />
                    <Route path="ResizablePage" element={<ResizablePage />} />
                    <Route path="StaticPage" element={<StaticPage />} />
                    <Route path="StaticPage/:did/:graphType" element={<StaticPage />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>

        );
    }
}
    export default App