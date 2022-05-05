var ipcRenderer = require('electron').ipcRenderer;
var crypto = require('crypto');

window.TestEvent = async function(data) {
	const result = await ipcRenderer.invoke('TestEvent', data);
	console.log('TestEvent return ', result);
};

window.addTunnel = async function(data) {
	const result = await ipcRenderer.invoke('addTunnel', data);
	console.log('addTunnel return ', result);
};

window.add = async function() {
	var data = {
		id: crypto.randomUUID(),
		host: document.getElementById('host').value,
		sshport: document.getElementById('sshport').value,
		localPort: document.getElementById('localPort').value,
		remotePort: document.getElementById('remotePort').value,
		username: document.getElementById('username').value,
		connectOnStartup: document.getElementById('connectOnStartup').checked
	};

	if (data.host == '' || data.localPort == '' || data.remotePort == '' || data.username == '') {
		console.log('Please fill all fields');
		document.getElementById('infoout').innerHTML = 'Please fill all fields';
		return;
	}
	window.addTunnel(data);
	document.getElementById('infoout').innerHTML = 'Tunnel Added';
};

window.getTunnels = async function(data) {
	const result = await ipcRenderer.invoke('getTunnels', data);
	console.log('getTunnels return ', result);
	return result;
};
window.connectTunnel = async function(id) {
	const result = await ipcRenderer.invoke('connectTunnel', id);
	window.renderList();
	console.log('connectTunnel return ', result);
};

window.renderList = async function() {
	var data = await window.getTunnels();
	document.getElementById('list').innerHTML = '';
	var list = document.getElementById('list');
	for (let key of Object.keys(data)) {
		var element = data[key];
		var li = document.createElement('li');
		var startBut = document.createElement('button');
		startBut.innerHTML = 'Connect to ' + element.host;
		startBut.onclick = function() {
			console.log(key);
			window.connectTunnel(key);
		};
		if (element.connected) {
			//startBut.disabled = true;
			startBut.style.backgroundColor = 'green';
		} else {
			//startBut.disabled = false;
			startBut.style.backgroundColor = 'red';
		}

		//li.innerHTML = JSON.stringify(element);
		li.appendChild(startBut);
		list.appendChild(li);
	}
};

window.openpath = async function(that) {
	console.log('openpath', that);
	const result = await ipcRenderer.invoke('openpath');
	if (!result.canceled) {
		document.getElementById('key').value = result.filePaths[0].replaceAll('\\', '/');
	}

	console.log('openpath return ', result);
};

window.sshkeygen = async function(that) {
	console.log('sshkeygen', that);
	const result = await ipcRenderer.invoke('sshkeygen');
	console.log('sshkeygen return ', result);
};

ipcRenderer.on('TestEvent', function(event, data) {
	console.log('TestEvent ', data);
	document.getElementById('testFuncCall').innerText = `Button was pressed ${data} times`;
});

/* window.addTunnel({
	id: crypto.randomUUID(),
	host: 'h2899502.stratoserver.net',
	sshport: 22,
	username: 'root',
	localPort: 6564,
	remotePort: 6564,
	localAdress: 'localhost',
	key: 'C:/Users/Steffen/.ssh/id_rsa',
	connectOnStartup: true
}); */

window.getTunnels();
