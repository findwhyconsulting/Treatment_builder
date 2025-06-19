import jwt from "jsonwebtoken";
import { Error } from "../utils/customeResponse";

let jwtKey = process.env.JWT_KEY || "local";

export const ensureAuthorized = (req, res, next) => {
  try {
    console.log("last_path--->", req.path);
    const allowedPaths = [
      "/",
      "/login",
      "/sign-up",
      "/logout",
      "/public-content",
      "/images",
      "/uploadImage",
      "/upload-image",
      "/consultation",
      "/consultations-submit",
      "/consultations-email",
      "/forgot-password",
      "/reset-password",
      "/recommendations",
      "/get-package",
    ];

    if (allowedPaths.includes(req.path)) {
      return next();
    }

    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
      return Error(res, 404, "No token provided");
    }

    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, jwtKey, (err, decoded) => {
      if (err) {
        return Error(res, 401, "Unauthorized");
      }
      req.user = decoded?.user;
      // console.log('req.user____',req.user);

      next();
    });
  } catch (error) {
    return Error(res, 500, error.message);
  }
};
