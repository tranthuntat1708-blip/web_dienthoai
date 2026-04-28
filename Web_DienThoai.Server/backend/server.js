const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth"); // ✅ đúng vì cùng trong backend
const { verifyToken, isAdmin } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// 👉 API auth
app.use("/auth", authRoutes);

// 👉 test user
app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Profile OK",
    user: req.user,
  });
});

// 👉 test admin
app.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
