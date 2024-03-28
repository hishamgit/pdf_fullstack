import jwt from "jsonwebtoken";
import { get } from "./connection.js";
import { JWT_PRIVATE_KEY } from "../config.js";
import { USER_COLLECTION } from "./collections.js";
import { ObjectId } from "mongodb";

// Middleware function to authenticate user using JWT token
export const userAuthMiddleware = (req, res) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
    console.log("token got")
  } else {
    token = null;
    console.log('no token');
  }
  //   const token = req.cookies.token;

  // If token is not found, return error response
  if (!token) {
    return res.json({ status: false, message: "token not found" });
  }

  // Verify JWT token
  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false, message: "token verification failed" });
    } else {
      const id = data.id;
      // Retrieve user from database using userid
      const user = await get()
        .collection(USER_COLLECTION)
        .findOne({ _id: new ObjectId(id) });
      // If user is found, return success response with user data
      if (user) {
        res.json({ status: true, user: user });
      } else {
        return res.json({ status: false, message: "user not found" });
      }
    }
  });
};
