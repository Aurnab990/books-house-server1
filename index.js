const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000;

app.use(cors());
app.use(express.json());



const uri = 'mongodb+srv://newdata:hAC0Qp8JViZ7dFyn@cluster0.pg0uckr.mongodb.net/?retryWrites=true&w=majority';
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
      await client.connect();
      const booksCollection = client.db('booksDB').collection('books');
      const userCollection = client.db('booksDB').collection('users');
      
    //   console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //BOOKS PRODUCT MANAGEMENT
    
    app.get('/books', async(req,res)=>{
        const query = {};
        const cursor = booksCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
  
      });
    app.post('/books',async (req, res)=>{
        // console.log("Request", req.body);
        const books = req.body;
        const result = await booksCollection.insertOne(books);
        res.send(result);
    });
    app.delete('/books/:id', async(req, res) =>{
        const id = (req.params.id);
        const query = {_id:new ObjectId(id)};
        const result = await booksCollection.deleteOne(query);
        res.send(result);
      });
      app.put('/books/:id', async(req, res) =>{
        const id = req.params.id;
        const updateItem = req.body;
        const query = {_id:new ObjectId(id)};
        const options= { upsert: true};
        const updatedDoc ={
          $set: {
            name: updateItem.name,
            price: updateItem.price,
            stocks: updateItem.stocks
          }
        };
        // console.log(updatedDoc);
        const result = await booksCollection.updateOne(query, updatedDoc, options);
        
        res.send(result);
        
      })

      //USERS MANAGEMENT
      
      app.post('/user', async(req,res)=>{
        const user = req.body;
        const isUserExists = await userCollection.findOne({email: user?.email});
        if(isUserExists?._id){
          return res.send({
            "status": "Login Success"
          })
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      });

      app.get('/user', async(req,res)=>{
        const query = {};
        const cursor = userCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
  
      });

      app.get('/user/:email', async(req,res)=>{
        const email = req.params.email;
        // console.log(email);
        const result = await userCollection.findOne({email: email});
        res.send(result);
      });

      app.put('/user/:id', async(req, res) =>{
        const id = req.params.id;
        // console.log(id);
        const updateItem = req.body;
        const query = {_id:new ObjectId(id)};
        const options= { upsert: true};
        const updatedDoc ={
          $set: {
            name: updateItem.name,
            email: updateItem.email,
            
          }
        };
        // console.log(updatedDoc);
        const result = await userCollection.updateOne(query, updatedDoc, options);
        
        res.send(result);
        
      })
   
    
  
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
  // run().catch(console.dir);
  
  
  app.get('/',(req,res)=>{
      res.send("Server is running");
  })
  
  app.listen(port, ()=>{
      console.log(`Hello server connected on ${port}`);
  })