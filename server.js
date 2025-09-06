import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

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

// ================== Web UI endpoints ==================

// Đổi mode
app.post("/setmode", (req, res) => {
  const { m } = req.query;
  if (m === "manu" || m === "auto") {
    cmdState.mode = m;
    res.json({ ok: true, mode: cmdState.mode });
  } else {
    res.status(400).json({ ok: false, error: "Invalid mode" });
  }
});

// Bật/tắt đèn
app.post("/lamp", (req, res) => {
  const { id, state } = req.query;
  if (id === "1" || id === "2") {
    const val = state === "1" ? 1 : 0;
    if (id === "1") cmdState.lamp1 = val;
    if (id === "2") cmdState.lamp2 = val;
    res.json({ ok: true, cmdState });
  } else {
    res.status(400).json({ ok: false, error: "Invalid lamp id" });
  }
});

// Đặt độ sáng
app.post("/brightness", (req, res) => {
  const { id, value } = req.query;
  const val = parseInt(value);
  if (id === "1") cmdState.bright1 = val;
  else if (id === "2") cmdState.bright2 = val;
  res.json({ ok: true, cmdState });
});

// Lấy trạng thái thiết bị (cho web)
app.get("/api/status", (req, res) => {
  res.json(deviceState);
});

// ================== START ==================
app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
