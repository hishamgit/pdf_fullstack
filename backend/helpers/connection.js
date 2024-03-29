import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoDBUrl } from "../config.js";

// Object to maintain the state of the database connection
const state = {
  db: null,
};

// Function to connect to the MongoDB database asynchronously
export const connect = async (result) => {
  const dbname = "pdf-Database";
  const client = new MongoClient(mongoDBUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Attempting to establish connection to the MongoDB server
    await client.connect();
    state.db = client.db(dbname);
    return result();
  } catch (error) {
    return result(error);
  }
};

// Function to retrieve the current state of the database connection
export const get=()=>{
  return state.db;
}
