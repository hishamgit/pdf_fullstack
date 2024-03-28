import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config.js";

// Function to create a secret token
const createSecretToken=(id,email,username)=>{
    return jwt.sign({id,email,username},
        JWT_PRIVATE_KEY,{})              // Private key used for signing the token imported from config.js
}
export default createSecretToken;