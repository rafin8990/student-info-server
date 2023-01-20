const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const studentsCollection = client.db('student-info').collection('studentsCollection')

        app.get('/students', async (req, res) => {
            const query = {};
            const result = await studentsCollection.find(query).toArray()
            res.send(result);
        })
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.findOne(query)
            res.send(result);
        });


        app.post('/posts', async (req, res) => {
            const posts = req.body;
            const result = await studentsCollection.insertOne(posts);
            res.send(result)
        });

        app.put('/update/:id', async (req, res) => {
            const filter = req.body;
            console.log(filter.name)
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: filter.name,
                    email: filter.email,
                    age: filter.age,
                    eyeColor: filter.eyeColor,
                    address: filter.address,
                    phone: filter.phone,
                    about: filter.about,
                    gender: filter.gender
                },
            };

            const result = await studentsCollection.updateOne(filter, updateDoc, options);

            res.send(result)
        });

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await studentsCollection.deleteOne(query);
            res.send(result)
        });

    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Student info server is running')
})

app.listen(port, () => {
    console.log(`student info server is running on port ${port}`)
})