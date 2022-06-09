import * as React from 'react';
import ResponsiveAppBar from './component/AppBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import Storage from './component/Storage';
import Grid from './pages/Grid';
import InfluxDB from './pages/InfluxDB';
import StaticLegend from './pages/StaticLegend';


class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <ResponsiveAppBar />
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="Grid" element={<Grid />} />
                    <Route path="InfluxDB" element={<InfluxDB />} />
                    <Route path="Storage" element={<Storage />} />
                    <Route path="Legend" element={<StaticLegend />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>

        );
    }
}
    export default App