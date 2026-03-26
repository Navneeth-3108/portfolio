const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      // Silent start
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
