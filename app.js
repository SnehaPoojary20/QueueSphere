import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
import { MongoClient, ServerApiVersion } from "mongodb";


app.use(cors());

const url = "mongodb+srv://snehapoojary2004:20@queuesphere.tfiim.mongodb.net/?retryWrites=true&w=majority&appName=QueueSphere";

const data = {
  hospitals: [{ id: 1, name: 'City Hospital' }, { id: 2, name: 'Health Plus' }],
  business: [{ id: 1, name: 'Tech Corp' }, { id: 2, name: 'Business Hub' }],
  restaurants: [{ id: 1, name: 'Foodie Place' }, { id: 2, name: 'Tasty Bites' }],
  events: [{ id: 1, name: 'Tech Conference' }, { id: 2, name: 'Music Fest' }],
  schools: [{ id: 1, name: 'Greenwood High' }, { id: 2, name: 'Bright Future' }],
  others: [{ id: 1, name: 'Miscellaneous Item 1' }, { id: 2, name: 'Miscellaneous Item 2' }]
};

app.get('/api/filter', (req, res) => {
  const { category } = req.query;
  if (data[category]) {
      res.json(data[category]);
  } else {
      res.status(400).json({ message: 'Invalid category' });
  }
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.listen(2000,()=>{
    console.log("Server is working");
})