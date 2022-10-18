const express = require("express");
const router = express.Router();

// Require controller modules.
const static_graph_controller = require("../controllers/staticgraphController");
const dashboard_controller = require("../controllers/dashboardController");

// GET home page.
router.get("/", dashboard_controller.index);

/// STATIC GRAPH ROUTES ///
router.get("/drive/:did", static_graph_controller.drive);
router.get("/drive-band/:did", static_graph_controller.drive_band);

router.get("/memory/:did", static_graph_controller.memory);
router.get("/memory-band/:did", static_graph_controller.memory_band);

router.get("/load/:did", static_graph_controller.load);
router.get("/load-band/:did", static_graph_controller.load_band);

router.get("/cpu/:did/:cpuID", static_graph_controller.cpu);
router.get("/cpu-band/:did/:cpuID", static_graph_controller.cpu_band);

router.get("/uptime/:did", static_graph_controller.uptime);
router.get("/uptime-band/:did", static_graph_controller.uptime_band);


/// DASHBOARD ROUTES ///
router.get("/gatewaylist", dashboard_controller.gatewaylist);

router.get("/devicelist/:gateway/", dashboard_controller.devicelist);

router.post("/metriclist/:device", dashboard_controller.metriclist);

router.get("/table/:gateway/:metric", dashboard_controller.trenddata);

module.exports = router;