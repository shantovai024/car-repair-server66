const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json())

// Mongodb Connect Option 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x6ys7hl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect()
    const serviceCollection = client.db('genius-car').collection('service')


    // (Read) Find Multiple Documents
    app.get('/service', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const services = await cursor.toArray()
      res.send(services)
    })

    // (Read) Find Single Document
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const service = await serviceCollection.findOne(query)
      res.send(service)
    })

    // (Create) post on DB
    app.post('/service', async (req, res)=> {
      let newService = req.body;
      let result = await serviceCollection.insertOne(newService)
      res.send(result)
    })

    // Delete (specific id)
    app.delete('/service/:id', async (req, res)=> {
      let id = req.params.id;
      let query = {_id: ObjectId(id)}
      let result = await serviceCollection.deleteOne(query)
      res.send(result);
    })
    
  }
  finally {

  }
}

run().catch(console.dir);

/* client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("Genius carDB Connected");
  // perform actions on the collection object
//   client.close();
}); */



// Read Data (get)
app.get("/", (req, res) => {
  res.send('Running Genius Server')
})

// Listen
app.listen(port, () => {
  console.log('Listening to port', port);
})