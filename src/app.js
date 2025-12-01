const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "segredo-seguro",
    resave: false,
    saveUninitialized: false
  })
);

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.use("/", authRoutes);
app.use("/", cartRoutes);

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
