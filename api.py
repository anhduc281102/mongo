from fastapi import FastAPI # mapping to express.js
from pymongo  import MongoClient
import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)



app = FastAPI()
@app.get("/get/sensors")
async def get_allsensor():
    client= MongoClient("mongodb://sanslab1.ddns.net:27017/")
    database= client.get_database("devices")
    collection= database["water_info"]
    data= list(collection.find({}))
    #print(data)
    client.close()
    return json.loads(JSONEncoder().encode({"data":data}))

@app.get("/get/sensor")
async def get_byip(ip: str):
    client= MongoClient("mongodb://sanslab1.ddns.net:27017/")
    database= client.get_database("admin")
    collection= database["devices"]
    data= collection.find_one({"device_ip": ip})
    print(ip)
    client.close()
    return json.loads(JSONEncoder().encode({"data":data}))

@app.get("/get/idsensor")
async def get_byid(id: str):
    client= MongoClient("mongodb://sanslab1.ddns.net:27017/")
    database= client.get_database("admin")
    collection= database["devices"]
    data= collection.find_one({"device_id": id})
    print(id)
    client.close()
    return json.loads(JSONEncoder().encode({"data":data}))



