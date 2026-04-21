const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

console.log("SERVER FILE RUNNING ✅");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// ✅ ADD HERE (VERY IMPORTANT POSITION)
app.get("/hello", (req, res) => {
  res.send("Hello working");
});

// ✅ AUTH ROUTE
app.use("/api/auth", require("./routes/authRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});