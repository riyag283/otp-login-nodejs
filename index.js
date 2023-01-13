const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const db = require("./config/db_connection");
const auth = require("./middleware/auth");
const app = express();

dotenv.config();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

app.use("/", userRoutes);

// Signup view
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Login view
app.get("/login", (req, res) => {
  res.render("login");
});

// OTP view
app.get("/otp", (req, res) => {
  res.render("otp");
});

//Home view
app.get("/home", auth, (req, res) => {
  res.render("home");
});

app.listen(3000, () => console.log("Server started on port 3000..."));
