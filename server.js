// call the packages we need
const express    = require('express')      // call express
const bodyParser = require('body-parser')
const app        = express()     // define our app using express
const MongoClient = require('mongodb').MongoClient
var numPeople = 0;
var friendArray = [];
var imageLinks = ["https://upload.wikimedia.org/wikipedia/commons/6/6e/Mona_Lisa_bw_square.jpeg",
  "https://static1.squarespace.com/static/54467ae3e4b0e284a8fafa0a/t/5a09ef6f4192029150b79ead/1510600563487/miriam-bos-augustus-2017-profile-square-2-web.jpeg",
  "https://static1.squarespace.com/static/5602365be4b02ead4f1620e0/t/5a4ff90c9140b7baf4858842/1515190573812/profile-square.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYtbYgJ-JNgTBKTS0bygJ0MdyvcXKSD8FjBIaD83p3wBqTFG9CQ",
  "https://cdn.imaginetricks.com/wp-content/uploads/2017/08/dashing-cool-profile-picture.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaQjDuSxtmF0X8ib9RNzQQv2NR-wPjlJAeMynGe-OLBNW0MISH",
  "https://sguru.org/wp-content/uploads/2017/06/cool-anonymous-profile-pictures-1699946_orig.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmjrE0e3CVaIAb7D315KEJHFL7SVnuxMPip4KsUtUrPd3Ivy78ng",
  "https://cdn130.picsart.com/247359843010202.jpg?c256x256",
  "https://cdn140.picsart.com/246425172018212.png?c256x256",
  "https://ct.yimg.com/cy/4523/37463272093_12c38d_128sq.jpg",
  "https://ichef.bbci.co.uk/images/ic/256x256/p049qtrp.jpg",
  "https://i.pinimg.com/originals/7d/77/3c/7d773c08c138c262d22b39f3e46ce2f3.jpg",
  "https://ichef.bbci.co.uk/images/ic/256x256/p03h3th9.jpg",
  "https://senecaniagaracasino.com/wp-content/uploads/2017/05/bright-cool-eye-eyewear-face-glasses-smile-sun-sunglasses-emoji-3e068b158b25a0c2-512x512.png",
  "https://ct.yimg.com/cy/4538/37518334353_6a0848_128sq.jpg",
  "https://secure.gravatar.com/avatar/562b7febdfd5cb019d9691eb5a92a40e?s=96&d=mm&r=g",
  "http://www.chicagonow.com/avatar/blog-200-128.png",
  "https://lh5.googleusercontent.com/-wGremyG7zhc/AAAAAAAAAAI/AAAAAAAAAtA/JhqPGkZwu0I/photo.jpg",
  "https://avatars2.githubusercontent.com/u/280996?s=400&v=4",
  "https://www.mytherapyapp.com/data/thumbs/blog/authors/tracey-ruff/tracey-ruff-256x256.jpg",
  "https://boseu.thebln.com/wp-content/uploads/sites/17/2018/03/Laura-Roeder-MeetEdgar-Ropig-256x256.jpg",
  "https://static-s.aa-cdn.net/img/ios/1015381239/cde0d519486b3ff5fd2a190bd33e6a13?v=1",
  "https://yt3.ggpht.com/a-/ACSszfGkGDC9peuFQc4SXy3muyRyJ2NM23pK_D2_LA=s900-mo-c-c0xffffffff-rj-k-no"
  ]

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
        if(result[n].idNum<friendArray[x].idNum){
          break;
        }
      }
      friendArray.splice(x, 0, result[n]);
    }
    numPeople = friendArray[friendArray.length-1].idNum+1
    res.render('index.ejs', {friendResults: friendArray, numPeople:numPeople, imageLinks:imageLinks})
  })
  /*db.collection('friends').find({}).toArray((err, result) => {
    if(err){console.log(err)}
    res.render('index.ejs', {friendResults: result})//renders index page in browser
  })*/
})

app.get('/delete/:friendID', function(req, res){
  console.log("deleting friend " + req.params.friendID);
  db.collection('friends').deleteOne({idNum:parseInt(req.params.friendID)});
  db.collection('friends').updateMany({idNum: {$gt: parseInt(req.params.friendID)}}, {$inc: {idNum: -1}});
  res.redirect('/')
})

app.post('/friends', function (req, res) {
  console.log("posting")
  if(parseInt(req.body.idNum)>friendArray[friendArray.length-1].idNum){
    db.collection('friends').insertOne({friendName:req.body.friendName,
      pictureNum: parseInt(req.body.pictureNum), hobbies:req.body.hobbies,
      peeves:req.body.peeves, idNum:parseInt(req.body.idNum)})
  }else{
    db.collection('friends').findOneAndReplace({idNum:parseInt(req.body.idNum)},
      {friendName:req.body.friendName, pictureNum: parseInt(req.body.pictureNum),
      hobbies:req.body.hobbies, peeves:req.body.peeves, idNum:parseInt(req.body.idNum)})
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
