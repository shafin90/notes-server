const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://mashrafiahnam:IOwrG4DoOlIGCD3G@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {

    const noteCollection = client.db("NoteCollection").collection('notes');

    app.get('/noteCollection', async (req, res) => {
      const cursor = noteCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/noteCollection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const note = await noteCollection.findOne(query);
      res.send(note);
    })

    app.post('/addNote', async (req, res) => {
      const { title, note, email } = req.body;
      const result = await noteCollection.insertOne({ title, note, email });
      res.send(result);
    });

    app.put('/updateNote/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const { title, note, email } = req.body;

      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedUser = {
        $set: {
          title: title,
          note: note,
          email: email
        }
      }
      const result = await noteCollection.updateOne(filter, updatedUser, options);
      res.send(result);
    })



    app.delete('/deleteNote/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }

      const result = await noteCollection.deleteOne(query);
      res.send(result);
    })






    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/hi', (req, res) => {
  res.send('shafin,,,your server is running...')
})

app.listen(port, () => {
  console.log(`${port}`)
})


