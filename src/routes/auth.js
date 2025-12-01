const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

router.get("/", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (!user)
      return res.render("login", { error: "Usuário não encontrado!" });

    const ok = bcrypt.compareSync(password, user.password);

    if (!ok)
      return res.render("login", { error: "Senha incorreta!" });

    req.session.user = { id: user.id, username: user.username };
    res.redirect("/welcome");
  });
});

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (user)
      return res.render("register", { error: "Usuário já existe!" });

    const hash = bcrypt.hashSync(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      () => res.redirect("/")
    );
  });
});

router.get("/welcome", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.render("welcome", { user: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
