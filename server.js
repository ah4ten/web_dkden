import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // phục vụ file index.html

// ================== STATE ==================
let cmdState = {
  mode: "manu",    // manu hoặc auto
  lamp1: 0,
  lamp2: 0,
  bright1: 255,
  bright2: 255
};

let deviceState = {
  pir1: 0,
  pir2: 0,
  lamp1: 0,
  lamp2: 0,
  bright1: 255,
  bright2: 255,
  mode: "manu"
};

// ================== API ==================

// ESP32 GET command
app.get("/api/getcmd", (req, res) => {
  res.json(cmdState);
});

// ESP32 POST status
app.post("/api/status", (req, res) => {
  deviceState = { ...deviceState, ...req.body };
  res.json({ ok: true, state: deviceState });
});

// Web UI set mode
app.get("/setmode", (req, res) => {
  const m = req.query.m;
  if (m === "manu" || m === "auto") {
    cmdState.mode = m;
    res.send("Mode set " + m);
  } else {
    res.status(400).send("Invalid mode");
  }
});

// Web UI control lamps
app.get("/on1", (req, res) => {
  cmdState.lamp1 = 1;
  res.send("Lamp1 ON");
});
app.get("/off1", (req, res) => {
  cmdState.lamp1 = 0;
  res.send("Lamp1 OFF");
});
app.get("/on2", (req, res) => {
  cmdState.lamp2 = 1;
  res.send("Lamp2 ON");
});
app.get("/off2", (req, res) => {
  cmdState.lamp2 = 0;
  res.send("Lamp2 OFF");
});

// Web UI set brightness
app.get("/set", (req, res) => {
  const lamp = parseInt(req.query.lamp);
  const value = parseInt(req.query.value);
  if (lamp === 1) cmdState.bright1 = value;
  if (lamp === 2) cmdState.bright2 = value;
  res.send("Brightness set");
});

// API cho web lấy trạng thái từ ESP
app.get("/api/status", (req, res) => {
  res.json(deviceState);
});

// ================== START ==================
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
