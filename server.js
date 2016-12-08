var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
console.log('Server has been started!');

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

// Ball App
var W = 500;
var	H = 300;

var balls = [];

class Ball {
	constructor() {
		this.radius = Math.floor(Math.random() * 20) + 10;
		this.x = Math.floor(Math.random() * W) - this.radius;
		this.y = Math.floor(Math.random() * H) - this.radius;
		
		this.color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
		
		// Velocity components
		// Randomize sign
		if (Math.random() <= .5) {
			this.vx = Math.random() * 2;	
		} else {
			this.vx = -Math.random() * 2;
		}
		if (Math.random() <= .5) {
			this.vy = Math.random() * 2;	
		} else {
			this.vy = -Math.random() * 2;	
		}

	}
}

function update() {
	io.emit('ballsincoming', balls);
	// ball.draw();

	balls.forEach(function(item) {
		// Now, lets make the ball move by adding the velocity vectors to its position
		item.y += item.vy;
		item.x += item.vx;

		if(item.y + item.radius > H) {
			item.y = H - item.radius;
			item.vy = -item.vy;
		}

		if(item.x + item.radius > W) {
			item.x = W - item.radius;
			item.vx = -item.vx;
		}

		if(item.y - item.radius < 0) {
			item.y = item.radius;
			item.vy = -item.vy;
		}

		if(item.x - item.radius < 0) {
			item.x = item.radius;
			item.vx = -item.vx;
		}
	});
}

io.on('connection', function(socket) {
	console.log('A connection has been made!');
	balls.push(new Ball());
	console.log('A ball has been added!');

	socket.on('addball', function(message) {
		balls.push(new Ball());
		console.log('A ball has been added!');
	});

	socket.on('removeball', function(message) {
		var randomIndex = Math.floor(Math.random() * balls.length);
		balls.splice(randomIndex, 1);
		console.log('A random ball has been remove!');
	});
	
});

setInterval(update, 1000/60);