const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// ====== STATE (shared with ESP32) ======
let state = {
  mode: "manu",   // manu | auto
  lamp1: 0,
  lamp2: 0,
  bright1: 255,
  bright2: 255,
  pir1: 0,
  pir2: 0
};

// ====== API cho ESP32 ======
app.get("/api/getcmd", (req, res) => {
  res.json({
    mode: state.mode,
    lamp1: state.lamp1,
    lamp2: state.lamp2,
    bright1: state.bright1,
    bright2: state.bright2
  });
});

app.post("/api/status", (req, res) => {
  const { pir1, pir2, lamp1, lamp2, bright1, bright2, mode } = req.body;
  state = { ...state, pir1, pir2, lamp1, lamp2, bright1, bright2, mode };
  res.json({ ok: true, state });
});

// ====== API cho Web UI ======
app.get("/on1", (req, res) => { state.lamp1 = 1; res.json(state); });
app.get("/off1", (req, res) => { state.lamp1 = 0; res.json(state); });
app.get("/on2", (req, res) => { state.lamp2 = 1; res.json(state); });
app.get("/off2", (req, res) => { state.lamp2 = 0; res.json(state); });

app.get("/setmode", (req, res) => {
  if (req.query.m) state.mode = req.query.m;
  res.json(state);
});

app.get("/set", (req, res) => {
  const lamp = parseInt(req.query.lamp);
  const value = parseInt(req.query.value);
  if (lamp === 1) state.bright1 = value;
  if (lamp === 2) state.bright2 = value;
  res.json(state);
});

app.listen(PORT, () => console.log(`✅ Server running on :${PORT}`));
