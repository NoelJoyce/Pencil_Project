//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Parse JSON data
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '25mb'
}));
//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

        //Send a response to all other clients, not including this one
        // socket.broadcast.emit('msg', data);

        //Send a response to just this client
        // socket.emit('msg', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});

//DB initial code
let Datastore = require('nedb');
let db = new Datastore({ filename: 'images.db', timestampData: true });
db.loadDatabase();

// Create POST route to. upload images into the DB
app.post('/image', (req, res) => {
    console.log(req.body);
    let imageJSON = req.body;
    db.insert(imageJSON, (err, newDocs) => {
      if(err) {
          res.json({ status: err });
      }
      else {
          res.json({ status: "success" });
      }
    })
});

//Create GET to get random image
app.get('/image', (req, res) => {
  db.find({}, function (err, docs) {
    console.log(docs.length);
    let randomImage = Math.floor(Math.random()*docs.length);
    console.log(docs[randomImage]);
    res.send(docs[randomImage]);
  });
})
