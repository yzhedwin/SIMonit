import * as React from 'react';
import ResponsiveAppBar from './component/AppBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import InfluxDB from "./pages/InfluxDB";

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <ResponsiveAppBar />
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="InfluxDB" element={<InfluxDB />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>

        );
    }
}
    export default App