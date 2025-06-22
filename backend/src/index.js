import app from "./app.js";
import dotenv from "dotenv";

// env configuration
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at ${process.env.FRONTEND_URL}`);
});
