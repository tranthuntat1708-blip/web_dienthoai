const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MONGO_URI được lấy tự động từ file .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;