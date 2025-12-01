const express = require("express");
const router = express.Router();
const produtos = require("../data/products");
const auth = require("../middleware/auth");

function initCart(req) {
  if (!req.session.carrinho) req.session.carrinho = [];
}

router.post("/cart/add/:id", auth, (req, res) => {
  initCart(req);

  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  const item = req.session.carrinho.find(i => i.id === id);

  if (item) item.quantidade++;
  else req.session.carrinho.push({ ...produto, quantidade: 1 });

  res.redirect("/cart");
});

router.get("/cart", auth, (req, res) => {
  initCart(req);

  let total = 0;
  req.session.carrinho.forEach(p => total += p.quantidade * p.preco);

  res.render("cart", {
    user: req.session.user,
    itens: req.session.carrinho,
    total: total.toFixed(2)
  });
});

router.post("/cart/remove/:id", auth, (req, res) => {
  initCart(req);

  const id = parseInt(req.params.id);
  const item = req.session.carrinho.find(p => p.id === id);

  if (item) {
    item.quantidade--;
    if (item.quantidade <= 0)
      req.session.carrinho = req.session.carrinho.filter(p => p.id !== id);
  }

  res.redirect("/cart");
});

router.post("/cart/delete/:id", auth, (req, res) => {
  initCart(req);
  const id = parseInt(req.params.id);

  req.session.carrinho = req.session.carrinho.filter(p => p.id !== id);

  res.redirect("/cart");
});

router.post("/cart/clear", auth, (req, res) => {
  req.session.carrinho = [];
  res.redirect("/cart");
});

module.exports = router;
