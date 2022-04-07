const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const uri = process.env.MONGO_URI;
const apiKey = process.env.API_KEY

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

getAllRoutes = async function(){
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("routes");
    const query = {}
    const options = {}
    return await routes.find().toArray()
}

deleteAll = async function(){
  await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("routes");
      const result = await routes.deleteMany({});
      console.log(result);
}

saveRoute = async function(newRoute) {
    console.log(newRoute)
    if(newRoute.id != null){
      await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("routes");
      const result = await routes.findOneAndReplace({"_id" : ObjectId(newRoute.id)}, newRoute).then(x => {  });
      console.log(result);
      console.log('update')
    }
    else{
      await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("routes"); 
      const result = await routes.insertOne(newRoute).then(x => {  });
      console.log(result);
      console.log('new document')
    }
  } 
  

deleteAll()

// getAllRoutes().then((got) =>{ got.forEach(x => {
//     console.log(x.points[0], x.points[x.points.length -1])
//     var updated = x;
//     updated.startLat = x.points[0][0]
//     updated.startLng = x.points[0][1]
//     updated.endLat = x.points[x.points.length -1][0]
//     updated.endLng = x.points[x.points.length -1][1]
//     saveRoute(updated)
// })})