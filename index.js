const express = require("express") ;
const cors = require("cors") ;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express() ;
const port = process.env.PORT || 5000 ;

// MIDDLEWARE 
  app.use(cors()) ;
  app.use(express.json()) ;



  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohdc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  
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


const carServices = client.db('carDatabase').collection('services') ;
const bookingCollection = client.db("carDatabase").collection('bookings') ;

// find all services data 
app.get('/services' , async (req,res) => {
    const cursor = carServices.find() ;
    const result = await cursor.toArray() ;
    res.send(result) ;
})

// find on service data 
app.get('/services/:id' , async (req, res) => {
const id = req.params.id ;
const query = { _id: new ObjectId(id)} ;

const options = {
    // Include only the `title` and `imdb` fields in the returned document
    projection: { title: 1, price: 1 , service_id: 1, img: 1 },
  };

const result = await carServices.findOne(query, options)
res.send(result)
})


// all bookings here

app.get('/bookings', async (req, res) => {
    console.log(req.query.email) ;
    let query = {} ;
    if(req.query?.email){
        query = {email : req.query.email}
    }
    const result = await bookingCollection.find(query).toArray() ;
    res.send(result) ;
})


// add 1 booking 
app.post('/bookings', async(req, res) => {
    const booking = req.body ;
    // console.log(booking) ;
    const result = await bookingCollection.insertOne(booking) ;
    res.send(result)
})

// update 1 data 
app.patch('/bookings/:id', async (req, res) => {
    const id = req.params.id ;
    const filter = {_id: new ObjectId(id)} ;
    const updatedBooking = req.body ;
    const updateDoc = {
        $set: {
         status: updatedBooking.status 
        },
      };
    console.log(updatedBooking) ;
    const result = await bookingCollection.updateOne(filter, updateDoc) ;
    res.send(result) ;
})

// delete 1 booking 
app.delete('/bookings/:id', async (req, res) => {
    const id = req.params.id ;
    const query = {_id: new ObjectId(id)} ;
    const result = await bookingCollection.deleteOne(query) ;
    res.send(result) ;
})


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
  

  
  app.get( '/' , (req, res) => {
res.send("doctor is running") ;
  })

  app.listen(port, () => {
    console.log(`Car Doctor babazi is running on port : ${port}`) ;
  })