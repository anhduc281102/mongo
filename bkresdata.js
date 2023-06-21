const MongoClient = require('mongodb').MongoClient
const url = "mongodb://admin_sanslab:sanslab@sanslab1.ddns.net:27017/"

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
        // 2023|06|07|06|50|16|28.77|9.65|774.38|42.34
        let m_data = m.message
            .split("|")
            .filter(checkdata)
            .map(ele => ele.replace("\n", ""));

        // console.log(m_data)
        if (m_data.length < 10)
            continue
        // console.log(m_data) 
        // let m_time = m.time
        results.push({
            Date: m_data[0] + '/' + m_data[1] + '/' +m_data[2],
            Time:m_data[3]+ ':' +m_data[4]+ ':' +m_data[5],   
            Temp: m_data[6],
            pH: m_data[7],
            DO: m_data[8],
            EC: m_data[9],
            // time_to_sever: m_time
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
        const data = await collection.findOne({ "device_id": "BKRES_sensor" })
        const i = getdata(data)

        const database2 = client.db("devices")
        const collection2 = database2.collection('BKRES_sensor')
        const res = await collection2.insertMany(i);
        console.log("done")
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
})()