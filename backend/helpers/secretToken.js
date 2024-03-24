import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config.js";
const createSecretToken=(id,email,username)=>{
    return jwt.sign({id,email,username},
        JWT_PRIVATE_KEY,{})
}
export default createSecretToken;