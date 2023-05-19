const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// Mongodb DRIVER Pasted
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nosbxzl.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // post addToy
    const toysCollection = client.db("toysDB").collection("addToy");


    app.post('/addToy', async (req, res) => {
      const newAddToy = req.body;
      console.log(newAddToy)
      const result = await toysCollection.insertOne(newAddToy);
      res.send(result)
    })

    app.get('/addToy', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query);
      res.send(result);
    })


    //get by email
    app.get('/addToy', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })

    //delete
    app.delete('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Toy Car Server is Doing its Job')
})

app.listen(port, () => {
  console.log(`Toy Car Server is running on port ${port}`)
})