// const express = require('express')
// const cors = require('cors')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// require('dotenv').config()


// const app = express()
// const port = process.env.PORT || 5000;


// app.use(cors())
// app.use(express.json())




// const uri = `mongodb+srv://module65-crud-operations:123456789abcde@cluster0.1jtbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("Connected to MongoDB");
//   // perform actions on the collection object
//   client.close();
// });




// app.get('/', (req, res) => {
//     res.send('Hello World! Its for CRUD Operations')
// })

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })





const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://module65-crud-operations:123456789abcde@cluster0.1jtbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emaJhonProducts").collection("products");

        console.log("server ok");


        // GET no of count of All products stored in the database
        app.get('/noOfProducts', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });


        // // GET all products stored in the database
        // app.get('/products', async(req, res) =>{
        //     const query = {};
        //     const cursor = productCollection.find(query);
        //     const results = await cursor.toArray();
        //     res.send(results);
        // });


        // GET all products stored in the database
        app.get('/products', async (req, res) => {
            console.log('query', req.query);
            const currentPage = parseInt(req.query.currentPage);
            const perPageProducts = parseInt(req.query.perPageProducts);

            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (currentPage || perPageProducts) {
                // 0 --> skip: 0 get: 0-10(10): 
                // 1 --> skip: 1*10 get: 11-20(10):
                // 2 --> skip: 2*10 get: 21-30 (10):
                // 3 --> skip: 3*10 get: 21-30 (10):
                products = await cursor.skip(currentPage * perPageProducts).limit(perPageProducts).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send(products);
        });





        // GET a product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });


        // use post to get products by ids
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;  // gettinf array of key from ui
            const ids = keys.map(id => ObjectId(id)); // wraping array of key with objectId
            const query = { _id: { $in: ids } }  // making query to search array of key in db
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(products);
            res.send(products);
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! Its for CRUD Operations')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
