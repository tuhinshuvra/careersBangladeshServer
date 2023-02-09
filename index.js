const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


const port = process.env.PORT || 5000;

// midddleware
app.use(cors())
app.use(express.json())

// username : gblusers, password: PlZSg836FOMJgzkq
const uri = "mongodb+srv://gblusers:PlZSg836FOMJgzkq@cluster0.v2wwlww.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// async await
async function run() {
    try {
        const userCollections = client.db('careersBangladeshDB').collection('users');


        // query to show all users
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });


        // query to save a new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);
        });


        // query to show a user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollections.findOne(query);

            res.send(user);
        })


        // query to update a user
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const user = req.body;
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email,
                }
            }
            const result = await userCollections.updateOne(filter, updatedUser, options)
            res.send(result);
        })


        // query to delete a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollections.deleteOne(query);
            res.send(result);
            // console.log('trying to delete', id);
        });


    }
    catch {
        (error) => console.log(error)
    }
    finally {

    }
}
run().catch(err => console.log(err));











app.get('/', (req, res) => [
    res.send('The Careers Bangladesh Server is Running.')
])

app.listen(port, () => [
    console.log(`Listen to port ${port}`)
])