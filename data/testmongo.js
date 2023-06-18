const MongoClient = require('mongodb').MongoClient
const url = "mongodb://sanslab1.ddns.net:27017/"

const checkdata = (ele) => {
    // new check after translation
    if (isNaN(ele) || ele === "")
        return false

    try {
        const t = parseFloat(ele.replace("\n", ""))
        return true
    } catch (err) {
        return false
    }
}

const getdata = (data) => {

    const mes = data.message
    const results = []
    for (m of mes) {
        if (typeof m["message"] === 'undefined')
            continue
        // |000435|31.67|6.97|1.77|4.12 
        let m_data = m.message
            .split("|")
            .filter(checkdata)
            .map(ele => parseFloat(ele.replace("\n", "")));

        // console.log(m_data)
        if (m_data.length < 5)
            continue
        // console.log(m_data) 
        let m_time = m.time
        results.push({
            Time: m_data[0],
            Temp: m_data[1],
            pH: m_data[2],
            EC: m_data[3],
            DO: m_data[4],
            time_to_sever: m_time
        })
    }
    return results
}

// main function
(async () => {
    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })

    if (!client)
        return

    try {
        const database = client.db("admin")
        const collection = database.collection('devices')
        const data = await collection.findOne({ "device_id": "BKRES_test" })
        const i = getdata(data)

        const database2 = client.db("devices")
        const collection2 = database2.collection('BKRES_test')
        const res = await collection2.insertMany(i);
        console.log("done")
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
})()