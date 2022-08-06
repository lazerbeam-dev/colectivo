const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

saveGPS = async function (newGPS) {
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("gpsRoutes");
    const result = await routes.insertOne(newGPS).then(x => { });
    console.log('new document');
  }
  
  saveRoute = async function (newRoute) {
  
    var findId = newRoute.findId;
    delete newRoute.findId;
  
    if (newRoute.points.length > 0) {
      newRoute.startLat = newRoute.points[0][0]
      newRoute.startLng = newRoute.points[0][1]
      newRoute.endLat = newRoute.points[newRoute.points.length - 1][0]
      newRoute.endLng = newRoute.points[newRoute.points.length - 1][1]
    }
  
    if (findId != null) {
      //looking to find a route we just made
      console.log('update return');
  
      await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("routes");
      const query = { newId: findId }
      const options = {}
      var natch = await routes.find(query)
  
      if (natch != null) {
        console.log("found a match!")
        const result = await routes.findOneAndReplace({ "newId": findId }, newRoute).then(x => { });
  
        console.log(result)
      }
    }
    else if (newRoute.id != null) {
      // classic update
      await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("routes");
      const result = await routes.findOneAndReplace({ "_id": ObjectId(newRoute.id) }, newRoute).then(x => { });
      console.log('update');
    }
    else if (newRoute.newId != null) {
      // classic add
      await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("routes");
      const result = await routes.insertOne(newRoute).then(x => { });
      console.log('new document');
    }
  
  }
  
  deleteRouteById = async function (id) {
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("routes");
  
    const result = await routes.deleteOne({ "_id": ObjectId(id) }).then(x => { });
    console.log(result);
    console.log('delete')
  }
  
  getUser = async function(id){
    try{
      await client.connect()
      const database = client.db("Collectivivo");
      const routes = database.collection("users");
      const query = { _id: ObjectId(id) }
      const options = {}
      return await routes.find(query).toArray[0]
    }
    catch(e){
      return null
    }
  }
  
  getRouteById = async function (id) {
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("routes");
    const query = { _id: ObjectId(id) }
    const options = {}
    return await routes.find(query)
  }
  
  getRoutesWithinArea = async function (topLeft, botRight) {
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("routes");
    //const query = { startLat : {$gt : }}
    const options = {}
    return await routes.find(query).toArray()
  }
  
  getAllRoutes = async function () {
    await client.connect()
    console.log('Connected successfully to server');
  
    const database = client.db("Collectivivo");
    const routes = database.collection("routes");
    const query = {}
    const options = {}
    return await routes.find().toArray()
    //await client.close()
  
    // if ((await cursor.count()) === 0) {
    //   console.log("No documents found!");
    // }
  
  
    // replace console.dir with your callback to access individual elements
    //await cursor.forEach((item) => {routesToReturn.push(item)});
    // const query = { runtime: { $lt: 15 } };
    // const options = {
    //   // sort returned documents in ascending order by title (A->Z)
    //   sort: { title: 1 },
    //   // Include only the `title` and `imdb` fields in each returned document
    //   projection: { _id: 0, title: 1, imdb: 1 },
    // };
  }

  //generic method, returns array so if you know you gonna get one thing, use ?[0]
  getByValue = async function(collection, fieldName, value){
    await client.connect()
    const database = client.db("Collectivivo");
    const users = database.collection(collection);

    const query = { [fieldName]: value }
    var existingItems = await users.find(query).toArray();
    return existingItems
  }

  getById = async function(collection, value){
    await client.connect()
    const database = client.db("Collectivivo");
    const users = database.collection(collection);
    console.log(value)
    const query = { _id: new ObjectId(value) }
    var fin = await users.findOne(query)
    return fin
  }

  updateItem = async function(collection, newItem){
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection(collection);
    const result = await routes.findOneAndReplace({ "_id": ObjectId(newItem._id) }, newItem).then(x => { });
    return newItem;
  }

  insertToCollection = async function(collection, newItem){
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection(collection);
    const result = await routes.insertOne(newItem).then(x => { });
    return newItem;
  }

const collections = {
    users: "users",
    routes: "routes",
    gpsRoutes: "gpsRoutes"
}

module.exports = {
    saveGPS,
    getUser,
    getAllRoutes,
    saveRoute,
    deleteRouteById,
    getRouteById,
    getRoutesWithinArea,
    getByValue,
    getById,
    insertToCollection,
    updateItem,
    collections
}