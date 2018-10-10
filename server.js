// call the packages we need
const express    = require('express')      // call express
const bodyParser = require('body-parser')
const app        = express()     // define our app using express
const MongoClient = require('mongodb').MongoClient
var numPeople = 0;
var friendArray = [];

// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs')

// get an instance of the express Router
//const router = express.Router()

// a “get” at the root of our web app: http://localhost:3000/api
app.get('/', function(req, res) {
  console.log('get')  //logs to terminal
  //.find({}) says "find all the things that match the condition {}"
  //so... find everything.

  friendArray = [];
  db.collection('friends').find({}).toArray((err,result)=>{
    if(err){console.log(err)}
    friendArray[0] = result[0];
    for(var n=1; n<result.length; n++){
      var x;
      for(x=0; x<friendArray.length; x++){
        if(parseInt(result[n].idNum)<parseInt(friendArray[x].idNum)){
          break;
        }
      }
      friendArray.splice(x, 0, result[n]);
    }
    numPeople = parseInt(friendArray[friendArray.length-1].idNum)+1
    res.render('index.ejs', {friendResults: friendArray, numPeople:numPeople})
  })
  /*db.collection('friends').find({}).toArray((err, result) => {
    if(err){console.log(err)}
    res.render('index.ejs', {friendResults: result})//renders index page in browser
  })*/
})

app.get('/delete/:friendID', function(req, res){
  console.log("deleting friend" + req.params.friendID);
  db.collection('friends').deleteOne({idNum:req.params.friendID});
  res.redirect('/')
})

app.post('/friends', function (req, res) {
  console.log("posting")
  if(parseInt(req.body.idNum)>parseInt(friendArray[friendArray.length-1].idNum)){
    db.collection('friends').insertOne({friendName:req.body.friendName,
      pictureNum: req.body.pictureNum, hobbies:req.body.hobbies,
      peeves:req.body.peeves, idNum:req.body.idNum})
  }else{
    db.collection('friends').findOneAndReplace({idNum:req.body.idNum},
      {friendName:req.body.friendName, pictureNum: req.body.pictureNum,
      hobbies:req.body.hobbies, peeves:req.body.peeves, idNum:req.body.idNum})
  }
  res.redirect('/')
})

var db
MongoClient.connect('mongodb://maximehl:12collections@ds243085.mlab.com:43085/collections', {useNewUrlParser: true}, (err, client) => {
  if (err) return console.log(err)
  db = client.db('collections') //sets database var equal to global db var above
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})
