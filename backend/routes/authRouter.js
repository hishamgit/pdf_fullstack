import { get } from "../helpers/connection.js";
import { USER_COLLECTION } from "../helpers/collections.js";
import express from "express";
import createSecretToken from "../helpers/secretToken.js";
import bcrypt from "bcrypt";

// Creating an instance of Express Router
const authRouter = express.Router();

// Route for user signup
authRouter.post("/signup", async (req, res) => {
  try {
    var { email, username, password, remember } = req.body;
    // Checking if all required fields are provided
    if (!(email && password && username)) {
      return res.status(400).json({ message: "All input is required" });
    }
    // Checking if the user already exists with the provided email
    const existingUser = await get()
      .collection(USER_COLLECTION)
      .findOne({ email });
    if (existingUser) {
      return res.json({ message: "user already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    password = hash;

    // Inserting the new user into the database
    const user = await get()
      .collection(USER_COLLECTION)
      .insertOne({ email, password, username });
    // Creating a secret token for the user,Setting a cookie with the token
    const token = createSecretToken(user.insertedId, email, username);
    res.cookie("token", token, {
      withCredentials: true,
      expires: remember
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 300 * 1000),
      httpOnly: false,
    });
    // Sending success response with user information
    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.log(error);
  }
});

// Route for user login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "enter each field " });
    }
    // Finding the user with the provided email
    const user = await get().collection(USER_COLLECTION).findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }
    // Comparing provided password with hashed password stored in the database
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "password is incorrect " });
    }
    // Creating a secret token for the user,Setting a cookie with the token
    const token = createSecretToken(user._id, email, user.username);
    res.cookie("token", token, {
      withCredentials: true,
      expires: remember
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 300 * 1000),
      httpOnly: false, //false
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true });
  } catch (error) {
    console.error(error);
  }
});
export default authRouter;
