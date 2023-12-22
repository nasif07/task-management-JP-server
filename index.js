const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://task-management-server:task-management-serverr@cluster0.q0knahp.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const taskCollection = client.db("taskCollectionDB").collection("allAddedTask")


    app.post('/alltasks', async (req, res) => {
      const taskQuery = req.body;
      const result = await taskCollection.insertOne(taskQuery);
      res.send(result)
    });

    app.get("/usertask", async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const result = await taskCollection.find(query).toArray();
      return res.send(result)
    })
    
    app.delete('/usertask/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/usertask/:id",  async (req, res) => {
      const id = req.params.id;
      const data = req.body;


      const filter = {
        _id: new ObjectId(id)
      };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          titles: data.titles,
          description: data.description,
          deadlines: data.deadlines,
          priority: data.priority,
          date: data.date,
        }
      };
      const result = await taskCollection.updateOne(filter, updatedData, options);
      res.send(result);
    })





    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('task management server is running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})