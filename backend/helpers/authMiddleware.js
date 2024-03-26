import jwt from "jsonwebtoken";
import { get } from "./connection.js";
import { JWT_PRIVATE_KEY } from "../config.js";
import { USER_COLLECTION } from "./collections.js";
import { ObjectId } from "mongodb";

export const userAuthMiddleware = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false, message: "token not found" });
  }

  jwt.verify(token, JWT_PRIVATE_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false, message: "token verification failed" });
    } else {
      const id =data.id;
      const user = await get().collection(USER_COLLECTION).findOne({ _id:new ObjectId(id) });
      if (user) {
        res.json({ status: true, user: user });
      } else {
        return res.json({ status: false, message: "user not found" });
      }
    }
  });
};
