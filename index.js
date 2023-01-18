const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;


const app = express();
const port = process.env.port || 5000;

//MiddleWare
app.use(cors());
require('dotenv').config()

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crceb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);



//async await
async function run(){
    try{
        await client.connect();
        console.log('database connected successfully');

        const database = client.db('onlineTouristGuide');
        const touristCollection = database.collection('touristServices');
        const bookingCollection = database.collection('booking');
        const reviewCollection = database.collection('review');


        

        // GET Services API
        app.get('/services', async (req, res) => {
        const cursor = touristCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });

      // POST API
      app.post('/services', async (req, res) => {
        const product = req.body;
        console.log('hitting the post api', product);
  
        const result = await touristCollection.insertOne(product);
        console.log(result);
        res.json(result);
    });


    //single services
    app.get('/services/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await touristCollection.findOne(query);
        res.send(service);
        // console.log(service);
    });


    
    // POST booking
   app.post("/booking", async(req, res) => {
    const query = req.body;
    const result = await bookingCollection.insertOne(req.body);
    console.log(result);
    res.send(result);
  })


  // All booking
  app.get("/booking", async(req, res) => {
   const query = bookingCollection.find({});
   const result = await query.toArray();
   console.log(result);
   res.send(result);
});


   // post API for reviews
   app.post("/reviews", async (req, res) => {
    const review = req.body;
    console.log(review);
    const result = await reviewCollection.insertOne(review);
    console.log(result);
    res.json(result);
});


 // get API for reviews
 app.get("/reviews", async (req, res) => {
  const allReview = await reviewCollection.find({}).toArray();
  res.send(allReview);
});
    





    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from node mongo Server');
})

app.listen(port, () =>{
    console.log(`Listening to port ${port}`);
})