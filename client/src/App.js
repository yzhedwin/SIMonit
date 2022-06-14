import * as React from 'react';
import ResponsiveAppBar from './component/AppBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import Grid from './pages/Grid';
import ResizableGrid from './pages/ResizableGrid';
import StaticPage from './pages/StaticPage';
import ResizablePage from './pages/ResizablePage';
import TestUrlSearch from './pages/TestUrlSearch';
import User from './pages/User';


class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <ResponsiveAppBar />
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="Grid" element={<Grid />} />
                    <Route path="ResizableGrid" element={<ResizableGrid />} />
                    <Route path="ResizablePage" element={<ResizablePage />} />
                    <Route path="StaticPage" element={<StaticPage />} />
                    <Route path="StaticPage/:did" element={<StaticPage />} />
                    <Route path="TestUrlSearch" element={<TestUrlSearch />} />
                    <Route path='user/:userName' element={<User/>} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>

        );
    }
}
    export default App