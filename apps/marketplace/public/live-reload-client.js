// public/live-reload-client.js
'use client';

let socket;
let reconnecting = false;

function connect() {
	// Adjust URL to point to your WebSocket endpoint
	socket = new WebSocket(`ws://${location.host}/live-reload`);

	socket.onopen = () => {
		console.log('[Dev] Connected to live-reload server');
		if (reconnecting) {
			console.log('[Dev] Reconnected — reloading...');
			location.reload();
		}
	};

	socket.onclose = () => {
		console.warn('[Dev] Connection lost. Attempting to reconnect...');
		reconnecting = true;
		setTimeout(connect, 1000);
	};

	socket.onerror = err => {
		console.error('[Dev] WebSocket error:', err);
		socket.close();
	};
}

connect();
