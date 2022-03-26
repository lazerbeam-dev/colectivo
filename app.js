const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const axios = require('axios');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const sls = require('serverless-http');

const uri = process.env.MONGO_URI;
const apiKey = process.env.API_KEY;
const port = process.env.PORT;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//const client = new MongoClient('mongodb://localhost:27017');

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())
app.use(cors())

app.post('/saveRoute', (req, res) => {
  saveRoute(req.body)
  res.send("route saved!")
})

app.get('/_health', (req, res) => {
  res.send({"status": true})
})

app.get('/', function (req, res) {
  if(__dirname.includes("bintami")){
    console.log("running in the cloud")
  res.sendFile(__dirname + '/colectivo/app/index.html');

  }
  else{
    res.sendFile(__dirname + '/app/index.html');
  }
});

app.post('/geocode', function(req, res) {

});

app.post('/getRoutesWithFilter', function(req, res) {
  console.log()
});

app.get('/getRoutes', function (req, res) {
  getAllRoutes().then((got) =>{ res.send(JSON.stringify(got)); res.end() })
  //res.end()
});

app.post('/deleteRoute', function(req, res) {
  console.log(req.body)
  deleteRouteById(req.body.id)
  res.send("heard you")
  res.end()
});

app.post('/search', function(req, res){
  var query = req.body.query
  

  var config = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+query+'&key='+apiKey,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    res.send(JSON.stringify(response.data));
    res.end();
  })
  .catch(function (error) {
    console.log(error);
  });
});


app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});

saveRoute = async function(newRoute) {
  console.log(newRoute)

  if(newRoute.points.length > 0){
    newRoute.startLat = newRoute.points[0][0]
    newRoute.startLng = newRoute.points[0][1]
    newRoute.endLat = newRoute.points[newRoute.points.length -1][0]
    newRoute.endLng = newRoute.points[newRoute.points.length -1][1]
  }

  if(newRoute.id != null){
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("routes");

    const result = await routes.findOneAndReplace({"_id" : ObjectId(newRoute.id)}, newRoute).then(x => {  });
    console.log(result);
    console.log('update');
  }
  else{
    await client.connect()
    const database = client.db("Collectivivo");
    const routes = database.collection("routes"); 
    const result = await routes.insertOne(newRoute).then(x => {  });
    console.log(result);
    console.log('new document');
    var updated = x;
  }
  
} 

deleteRouteById = async function(id){
  await client.connect()
  const database = client.db("Collectivivo");
  const routes = database.collection("routes");

  const result = await routes.deleteOne({"_id" : ObjectId(id)}).then(x => {  });
  console.log(result);
  console.log('delete')
}

getRouteById = async function(id){
  await client.connect()
  const database = client.db("Collectivivo");
  const routes = database.collection("routes");
  const query = {_id : ObjectId(id)}
  const options = {}
  return await routes.find(query)
}

getRoutesWithinArea = async function(topLeft, botRight){
  await client.connect()
  const database = client.db("Collectivivo");
  const routes = database.collection("routes");
  //const query = { startLat : {$gt : }}
  const options = {}
  return await routes.find(query).toArray()
}

getAllRoutes = async function(){
  await client.connect()
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

const fs = require('fs');
const beautify = filePath => {
	let data = fs.readFileSync(filePath).toString();
	let object = JSON.parse(data);
	return JSON.stringify(object, false, 3);
};

module.exports = {
	beautify,
  server: sls(app)
};
