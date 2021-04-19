const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('royal'));
app.use(fileUpload());

const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kpa70.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    console.log("Database connected:", err)
    const Collection = client.db("Royal_Photography").collection("service-data");

    app.post('/addService', (req, res) => {
        const service = req.body;
        console.log(service)
        Collection.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/services', (req, res) => {
        Collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addNewService', (req, res) =>{
        const file = req.files.file;
        const name = req.body.name;
        const price = req.body.price;
        const review = req.body.review;
        console.log(name, price, review, file);
        file.mv(`${__dirname}/royal/${file.name}`)
            res.send({path: `/${file.name}`})    
    });

    app.post('/admin', (req, res) => {
        const email = req.body.email;
        Collection.find({email: email})
        .toArray((err, admins) => {
            res.send(admins.length > 0)
        })
    })
});

    app.get('/', (req, res) => {
        res.send('Royal Photography')
    })

    app.listen(process.env.PORT || port);