'use strict';

const net = require('net');
const chatServer = net.createServer();
const clientList = [];

const removeClient = (data) => {
  clientList.splice(clientList.indexOf(data), 1);
};

const broadcast = (message, client) => {
  for (let i = clientList.length -1; i >= 0; i--) {
  	if (client !== clientList[i]) {
  		clientList[i].write(message);
		}
	}
};

chatServer.on('connection', (client) => {
	client.write('Type a username!\n');
	clientList.push(client);
	let name = '';
	client.on('data', (data) => {
		if (name) {
			data = `${name}: ${data}`;
			broadcast(data, client);
		} else {
			name = data.toString().trim();
			data = `${name} ENTROU!\n`;
			broadcast(data, client);
		}
	});
	client.on('error', (err) => {
		console.log(err);
	});
	client.on('end', removeClient);
});

chatServer.listen(9000);