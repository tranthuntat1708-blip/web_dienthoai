const express = require("express");
const router = express.Router();

const categories = [
  { id: 1, name: "iPhone" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" },
  { id: 4, name: "Tecno" },
];

router.get("/", (req, res) => {
  res.json(categories);
});

module.exports = router;
