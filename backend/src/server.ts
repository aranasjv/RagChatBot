import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoutes from "./routes/chatRoutes";
import { connectMongo } from "./services/mongoService";

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectMongo();

// Routes
app.use("/api", chatRoutes);

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
