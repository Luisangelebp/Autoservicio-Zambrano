import express from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
