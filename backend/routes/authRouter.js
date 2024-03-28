import { get } from "../helpers/connection.js";
import { USER_COLLECTION } from "../helpers/collections.js";
import express from "express";
import createSecretToken from "../helpers/secretToken.js";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Destructuring the request body
    var { email, username, password, remember } = req.body;
    // Check if all required fields are provided
    if (!(email && password && username)) {
      return res.status(400).json({ message: "All input is required" });
    }
    // Check if the user already exists
    const existingUser = await get()
      .collection(USER_COLLECTION)
      .findOne({ email });
    if (existingUser) {
      return res.json({ message: "user already exists" });
    }
     // Hash the password
    const hash=await bcrypt.hash(password, 10);
    password=hash

    const user = await get()
      .collection(USER_COLLECTION)
      .insertOne({ email, password, username });
     // Create a JWT token for the user,Set the token in a cookie
    const token = createSecretToken(user.insertedId, email, username);
    res.cookie("token", token, {
      withCredentials: true,
      expires: remember
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 300 * 1000),
        httpOnly: false, 
    });
    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.log(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "enter each field " });
    }
     // Find the user by email
    const user = await get().collection(USER_COLLECTION).findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }
     // Compare the provided password with the hashed password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "password is incorrect " });
    }
    const token = createSecretToken(user._id, email, user.username);
    res.cookie("token", token, {
      withCredentials: true,
      expires: remember
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 300 * 1000),
        httpOnly: false, 
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true });
  } catch (error) {
    console.error(error);
  }
});
export default authRouter;
