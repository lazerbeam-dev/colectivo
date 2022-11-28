const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const axios = require('axios');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const sls = require('serverless-http');
const path = require('path')
const fs = require('fs');
const bcrypt = require('bcrypt')
const cookieSession = require("cookie-session");
const repo = require('./repo')
const jwt = require('jsonwebtoken');

const apiKey = process.env.API_KEY;
const port = process.env.PORT || 8000;
const saltRounds = 9;

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use('/', express.static('views'))
app.use('/js', express.static(path.resolve(__dirname, './dist/js')))
app.use('/img', express.static(path.resolve(__dirname, './dist/img')))
app.use('/css', express.static(path.resolve(__dirname, './dist/css')))
app.use('/manifest.json', express.static(path.resolve(__dirname, './dist/manifest.json')))
app.use('/robots.txt', express.static(path.resolve(__dirname, './dist/robots.txt')))

app.use(bodyParser.json())

var allowOrigins = ["capacitor://localhost", "http://localhost", "http://localhost:8080"]
if (process.env.NODE_ENV === "development") {
  allowOrigins.push("http://localhost:8080")
}
app.use(cors({
  // allow for ios and android mobile
  origin: allowOrigins,
  optionsSuccessStatus: 200
}))

app.get('/favicon.ico', async (req, res) => {
  var img = null
  if (process.env.NODE_ENV === 'development') {
    img = fs.readFileSync(path.join(__dirname, 'dist', 'favicon.ico'));
  } else {
    const response = await axios.get('https://rutascolectivos.s3.us-west-1.amazonaws.com/favicon.ico', { responseType: 'arraybuffer' })
    img = Buffer.from(response.data, "utf-8")
  }
  res.writeHead(200, { 'Content-Type': 'image/x-icon' });
  res.end(img, 'binary');
})

app.post('/saveRoute', (req, res) => {
  repo.saveRoute(req.body)
  res.send("route saved!")
})

app.post('/likeRoute', async (req, res) => {
  try{
    const body = req.body

    const userReporting = await repo.getById(repo.collections.users, body.userId)
    const routeReporting = await repo.getById(repo.collections.routes, body.routeId)
    
    //gonna use userId a lot so
    const userId = body.userId;

    if(userReporting != null && routeReporting != null){
      // work out if we are adding like, removing like, adding dislike, removing dislike
      if(routeReporting.likes == null){
        routeReporting.likes = []
      }
      if(routeReporting.dislikes == null){
        routeReporting.dislikes = []
      }

      // if body like, we are liking, removing dislikes by same user
      if(body.like == true){
        if(!routeReporting.likes.includes(userId)){
          routeReporting.likes.push(userId)
        }
        if(routeReporting.dislikes.includes(userId)){
          routeReporting.dislikes.splice(routeReporting.dislikes.indexOf(userId), 1)
        }
      }
      // if body dislike, we are disliking, removing likes by same user
      else if(body.dislike == true){
        console.log("dislike")

        if(!routeReporting.dislikes.includes(userId)){
          routeReporting.dislikes.push(userId)
        }
        if(routeReporting.likes.includes(userId)){
          routeReporting.likes.splice(routeReporting.likes.indexOf(userId), 1)
        }
      }
      else if(body.dislike == false && body.like == false){
        console.log("neither")
        // we removing all likey feedback by user on this route
        if(routeReporting.likes.includes(userId)){
          routeReporting.likes.splice(routeReporting.likes.indexOf(userId), 1)
        }
        if(routeReporting.dislikes.includes(userId)){
          routeReporting.dislikes.splice(routeReporting.dislikes.indexOf(userId), 1)
        }
      }
      repo.updateItem(repo.collections.routes, routeReporting).then(x => {
        res.status(200).send(x)
      })
    }
  }
  catch(error){
    console.log(error)
    res.status(500).send(error)
  }
})

app.post('/saveGPS', (req, res) => {
  var latlngArray = req.body

  var qString = ""
  latlngArray.forEach(element => {
    qString += element[0]
    qString += "%2C"
    qString += element[1]
    qString += "%7C"
  });

  qString = qString.slice(0, -3)

  console.log(qString)

  var url = "https://roads.googleapis.com/v1/snapToRoads?path=" + qString + "&interpolate=true&key=" + apiKey

  var config = {
    method: 'get',
    url: url,
    headers: {}
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  //saveGPS(req.body)

  res.send("gps saved!")
})

app.get('/_health', (req, res) => {
  res.send({ "status": true })
})

app.get('/', function (req, res) {
  if (__dirname.includes("bintami")) {
    console.log("running in the cloud")
    res.sendFile(__dirname + '/colectivo/views/index.html');

  }
  else {
    res.sendFile(__dirname + '/dist/index.html');
  }
});

app.post('/geocode', function (req, res) {

});

app.post('/signIn', async function (req, res) {
  try {
    console.log('login')
    console.log(req.body)
    let loginAttempt = req.body

    // check for token
    if(req.body.token != null && req.body.token != "null"){
      var senttoken = req.body.token
      senttoken = senttoken.slice(senttoken.indexOf('"')+1, -1);
      console.log("trying to login with token")
      var decoded = jwt.decode(senttoken, process.env.JWS_SECRET);
      console.log(decoded)
      repo.getById(repo.collections.users, decoded.user_id).then(user =>
      {
        console.log(user)
        if(user.email == decoded.email && user.token == senttoken && user.email == decoded.email){
          console.log("successful token login")
          res.status(200).send({username: user.username, token: senttoken, id: user._id});
        }
      })
      return;
    }
    // await client.connect()
    // const users = database.collection("users");

    // const query = { email: loginAttempt.email }
    // var existingUser = await users.find(query).toArray();
    if(loginAttempt.email == null){
      console.log('invalid login attempt')
      res.status(400).send("no email no token")
      return;
    }
    var existingUser = await repo.getByValue("users", "email", loginAttempt.email)
    console.log(existingUser)
    if (existingUser.length == 1) {
      bcrypt.compare(loginAttempt.password, existingUser[0].password, function (err, result) {
        console.log("login attempt")
        if(result === true){
          var userDetails = existingUser[0];
          const token = jwt.sign(
            { user_id: userDetails._id, email: userDetails.email },
            process.env.JWS_SECRET,
            { expiresIn: '3h' }
            )
          
          userDetails.token = token;
          userDetails.lastLogin = new Date().toUTCString();
          repo.updateItem(repo.collections.users, userDetails)

          res.status(200).send({
            id: existingUser[0]._id,
            username: existingUser[0].username,
            token: token
          })
        }
        else{
          res.status(401).send("wrong password!")
          //res.sendStatus(500)
        }
        console.log(result)
        console.log(err)
      });
    }
    else{
      res.status(400).send("no one with that email")
    }
  }
  catch (e) {
    console.log(e)
    res.send("something went wrong")
  }
});

app.post('/signUp', async function (req, res) {
  try {
    let newUser = req.body
    var existingUser = await repo.getByValue("users", "email", req.body.email)
    if (existingUser.length > 0) {
      res.status(401).send("user already exists");
    }
    else {
      const myPlaintextPassword = newUser.password;
      bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
        newUser.password = hash
        
        const result = repo.insertToCollection(repo.collections.users, newUser).then(x => 
        {
          console.log(x)
          const token = jwt.sign(
            { user_id: x._id, email: x.email },
            process.env.JWS_SECRET,
            {
              expiresIn: "2h",
            }
          );
  
          newUser.token = token;
          tokeniseduser = repo.updateItem(repo.collections.users, newUser)
          console.log('new user');
          res.status(200).send({ username: newUser.username, id: newUser._id })
        });
      });

    }
  }
  catch (e) {
    console.log(e)
    res.send("something went wrong")
  }
});

app.post('/getRoutesWithFilter', function (req, res) {
  console.log()
});

app.get('/getRoutes', function (req, res) {
  repo.getAllRoutes().then((got) => { res.send(JSON.stringify(got)); res.end() })
  //res.end()
});

app.post('/deleteRoute', function (req, res) {
  console.log(req.body)
  repo.deleteRouteById(req.body.id)
  res.send("delete successful")
  res.end()
});

app.post('/search', function (req, res) {
  var query = req.body.query


  var config = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + query + '&key=' + apiKey,
    headers: {}
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




const beautify = filePath => {
  let data = fs.readFileSync(filePath).toString();
  let object = JSON.parse(data);
  return JSON.stringify(object, false, 3);
};

module.exports = {
  beautify,
  server: sls(app)
};
