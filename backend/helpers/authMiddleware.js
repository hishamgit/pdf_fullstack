import jwt from "jsonwebtoken";
import { get } from "./connection.js";
import { JWT_PRIVATE_KEY } from "../config.js";
import { USER_COLLECTION } from "./collections.js";
import { ObjectId } from "mongodb";

//Middleware function to authenticate users using JWT token from cookies
export const userAuthMiddleware = (req, res) => {

  // Extracting token from request cookies
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false, message: "token not found" });
  }

  // Verifying the JWT token
  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false, message: "token verification failed" });
    } else {

      const id = data.id;
      // Finding user in the database using the extracted ID
      const user = await get().collection(USER_COLLECTION).findOne({ _id: new ObjectId(id) });
      
      if (user) {
        res.json({ status: true, user: user }); // Sending success response with user details if user is found
      } else {
        return res.json({ status: false, message: "user not found" });
      }
    }
  });
};
