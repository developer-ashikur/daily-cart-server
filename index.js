const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT || 4000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oeq97.mongodb.net/dailyCart?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
});


client.connect(err => {
  const productsCollection = client.db("dailyCart").collection("products");
  const ordersCollection = client.db("dailyCart").collection("orders");

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, document) => {
        res.send(document);
      })
  })

  app.get('/product/:id', (req, res) => {
    productsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.json(result.insertedCount);
      })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.json(documents);
      })
  })

  app.delete('/delete/:id', (req, res) => {
    productsCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
});


app.listen(port);