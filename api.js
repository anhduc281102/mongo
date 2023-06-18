const MongoClient = require('mongodb').MongoClient
const express = require('express')
const app = express()
const port = 3000
const url = "mongodb://sanslab1.ddns.net:27017/"
/**
 * Since JSON is Javascript Object Notation, it is not neccessary 
 * to have JSONEncoder in Javascript code to encode and decode.
 */



app.get('/get/allsensors', async (req, res) => {

    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("admin")
    const collection = database.collection("devices")
    const data = await collection.find({}).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

app.get('/get/BKRES_sensor', async (req, res) => {

    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("devices")
    const collection = database.collection("BKRES_sensor")
    const data = await collection.find({}).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

app.get('/get/BKRES_test', async (req, res) => {

    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("devices")
    const collection = database.collection("BKRES_test")
    const data = await collection.find({}).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

// /get/sensor?ip=xxx
app.get('/get/sensor', async (req, res) => {
    const ip = req.query.ip
    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("admin")
    const collection = database.collection("devices")
    const data = await collection.findOne({ "device_ip": ip })
    console.log(ip)
    client.close()

    res.send({ data: data })
})

app.get('/get/idsensor', async (req, res) => {
    const id = req.query.id
    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("admin")
    const collection = database.collection("devices")
    const data = await collection.findOne({ "device_id": id })
    console.log(id)
    client.close()

    res.send({ data: data })
})

// launch express server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})