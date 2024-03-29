import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config.js";

// Function to create a secret token
const createSecretToken = (id, email, username) => {
  // Signing the token with user id, email, and username payload
  return jwt.sign({ id, email, username }, JWT_PRIVATE_KEY, {});
};
export default createSecretToken;
