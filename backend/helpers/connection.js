import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoDBUrl } from "../config.js";

// Object to store the state of the database connection
const state = {
  db: null,
};
// Function to connect to the MongoDB database
export const connect = async (result) => {
  const dbname = "pdf-Database";
  const client = new MongoClient(mongoDBUrl, {    // Creating a new MongoClient instance
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();        // Connecting to the MongoDB server
    state.db = client.db(dbname); // Storing the database connection in the state
    return result();
  } catch (error) {
    return result(error);
  }
};

// Returning the database connection from the state
export const get=()=>{
  return state.db;
}
