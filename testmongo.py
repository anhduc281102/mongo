from pymongo  import MongoClient
client= MongoClient("mongodb://sanslab1.ddns.net:27017/")
database= client.get_database("admin")
collection= database["devices"]
data= collection.find_one({"device_ip":"::ffff:202.191.58.171"})
# print(data) 

def checkdata(ele):
    try:
        t=float(ele.replace("\n",""))
        return True
    except:
        return False
def getdata(data):
    mes= data["message"]
    results=[]
    for m in mes:
        if not m.__contains__("message"): 
            continue
        # |000435|31.67|6.97|1.77|4.12 
        m_data= [float(ele.replace("\n","")) for ele in m["message"].split("|") if checkdata(ele)]
        # print (m_data)
        if len(m_data) < 5:
            continue
        # print (m_data)
        m_time= m["time"]           
        results.append({"Time":m_data[0],"Temp":m_data[1],"pH":m_data[2],"EC":m_data[3],"DO":m_data[4],"time_to_sever":m_time})
    return results
i=getdata(data)
client.close()


client2= MongoClient("mongodb://sanslab1.ddns.net:27017/")
database2= client2.get_database("devices")
collection2= database2["water_info"]
collection2.insert_many(i)
print("done")




