import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
    response.json({
        message: "FarmRent API is running"
    });
});

app.use("/api/equipment", equipmentRoutes);

app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(
        `FarmRent server running on port ${port}`
    );
});