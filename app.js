const express = require('express')
const app = express()

const SimpleNodeLogger = require('simple-node-logger'),
	opts = {
		logFilePath: 'node.log',
		timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
	},
	log = SimpleNodeLogger.createSimpleFileLogger( opts );

var activeUsers = [];

var currentBeat = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var currentDisplay = [1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,    
      1,
      1,
      1,
      1
  ];

var defDisplay = [1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1
  ];

function showBeat(beat, val){
  currentDisplay[beat] = val;
  if(val == 0){
    for(var i = 0; i < 16; i++){
      currentBeat[beat][i] = 0;
    }
  }
}

function toggleBeat(tick){
  var x = Math.floor(tick / 16);
  var y = tick % 16;
  if(currentBeat[x][y] == 0){
    currentBeat[x][y] = 1;
  }else{
    currentBeat[x][y] = 0;
  }
}

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(80)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
	//default username
	socket.username = "AnonymousUser" + Math.floor(Math.random()*100)
	while(activeUsers.includes(socket.username)){
		socket.username = "AnonymousUser" + Math.floor(Math.random()*100)
	}
	activeUsers.push(socket.username);
	log.info('New user connected :: ' + socket.username);
	console.log('New user connected :: ' + socket.username);
	console.log('current users :: ' + activeUsers);
	socket.emit('startup', {username : socket.username, display : currentDisplay, beat : currentBeat})
	io.sockets.emit('userUpdate', {userList : activeUsers})

	socket.on('newUsername', (data) => {
		log.info('new username : ' + data.username);
		console.log('new username : ' + data.username);
		var tempSpot = activeUsers.indexOf(socket.username);
		activeUsers[tempSpot] = data.username;
		console.log('current users :: ' + activeUsers);
		socket.username = data.username;
		io.sockets.emit('userUpdate', {userList : activeUsers})
	})

    socket.on('show', (data) => {
        socket.broadcast.emit('show', {beatId : data.beatId});
	showBeat(data.beatIndex, 1);
    })

    socket.on('hide', (data) => {
    	socket.broadcast.emit('hide', {beatId : data.beatId})
	showBeat(data.beatIndex, 0);
    })

    socket.on('turnOn', (data) => {
	socket.broadcast.emit('turnOn', {sound : data.sound, tick : data.tick})
	    console.log('turning on :: ' + data.tick);
	toggleBeat(data.tick);
    })

	socket.on('clear', (data) => {
		socket.broadcast.emit('clear')
		for(var x = 0; x < currentBeat.length; x++){
			for(var y = 0; y < currentBeat[x].length; y++){
				currentBeat[x][y] = 0;
			}
		}
	})

	socket.on('disconnect', (data) => {
		log.info('disconnection : ' + socket.username);
		console.log('disconnection : ' + socket.username);
		activeUsers.splice(activeUsers.indexOf(socket.username), 1);
		console.log('current users :: ' + activeUsers);
		if(activeUsers.length == 0){
			currDisplay = defDisplay;
			for(var i=0; i < currentBeat.length; i++){
				for(var j=0; j < currentBeat[i].length; j++){
					currentBeat[i][j] = 0;
				}
			}
		}else{
			io.sockets.emit('userUpdate', {userList : activeUsers});
		}
	})
})
