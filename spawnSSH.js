//ssh -p 22 -N -R 45667:localhost:8080 root@h2899502.stratoserver.net
const { spawn } = require('child_process');
var crypto = require('crypto');
var config = {
	host: 'h2899502.stratoserver.net',
	sshport: 22,
	username: 'root',
	localPort: 8080,
	remotePort: 45667,
	localAdress: 'localhost',
	key: 'C:/Users/Steffen/.ssh/id_rsa'
};

connections = {};

var openTunnel = function(config, cb) {
	var uuid = config.id || crypto.randomUUID();
	var host = config.host || 'localhost';
	var sshport = config.sshport || 22;
	var username = config.username || 'root';
	var password = config.password || '';
	var localPort = config.localPort || 8080;
	var remotePort = config.remotePort || 45667;
	var localAdress = config.localAdress || 'localhost';
	var key = config.key || '';

	var userapwd;
	if (password === '') {
		var userapwd = username;
	} else {
		var userapwd = username + ':' + password;
	}

	var aurguments = [ '-p', sshport, '-N', '-R', `${remotePort}:${localAdress}:${localPort}`, `${userapwd}@${host}` ];

	if (key != '') {
		aurguments.push('-i');
		aurguments.push(key);
	}
	//-i id_rsa

	//console.log(aurguments);

	const proc = spawn('ssh', aurguments);

	proc.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	proc.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`);
		delete connections[uuid];
	});

	proc.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		delete connections[uuid];
	});

	var conn = {
		id: uuid,
		host: host,
		sshport: sshport,
		username: username,
		password: password,
		localPort: localPort,
		remotePort: remotePort,
		localAdress: localAdress,
		aurguments: aurguments,
		key: key,
		proc: proc
	};
	connections[uuid] = conn;
	cb(conn);
};

/* openTunnel(config, function(conn) {
	console.log('Tunnel is open', conn.host + ':' + conn.remotePort + ' -> ' + conn.localAdress + ':' + conn.localPort);
	//console.log(connections);
}); */

module.exports = {
	connections: connections,
	openTunnel: openTunnel
};
