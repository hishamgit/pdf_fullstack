import { MongoClient, ServerApiVersion } from "mongodb";
import { mongoDBUrl } from "../config.js";

const state = {
  db: null,
};

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
    await client.connect();
    state.db = client.db(dbname);
    return result();
  } catch (error) {
    return result(error);
  }
};
