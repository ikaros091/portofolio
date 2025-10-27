import { MongoClient } from 'mongodb'; 
const uri = process.env.MONGO_URI as string;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
export const database = client.db("portfolio")