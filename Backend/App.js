import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./src/AllRoutes";
import { ensureAuthorized } from "./src/middleware/authMiddleware";
import "./src/middleware/userUploads";
import path from "path";

const app = express();
app.use(bodyParser.json({ limit: "50MB" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors({ origin: "*" }));

/* Access files direcltly via path */
app.use("/",express.static(path.join(__dirname, process.env.SERVER_CONFIG_IMAGES)));
app.use("/",express.static(path.join(__dirname, process.env.PATIENT_UPLOAD_PATH)));
app.use("/",express.static(path.join(__dirname, process.env.USER_PROFILE_PATH)));
app.use("/",express.static(path.join(__dirname, process.env.PACKAGE_FILE_PATH)));
app.use("/",express.static(path.join(__dirname, process.env.LOGO_FILE_PATH)));
app.use("/",express.static(path.join(__dirname, process.env.CLIENT_IMAGE_PATH)));



app.use("/api/v1", ensureAuthorized, routes(express));

export default app;
