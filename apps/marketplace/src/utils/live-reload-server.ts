// src/utils/live-reload-server.ts
export const LiveReloadServer = () => {
	// Create a new WebSocketPair
	const { 0: client, 1: server } = new WebSocketPair();

	// Accept the server-side WebSocket connection.
	server.accept();

	// Optionally add event listeners on the server socket.
	server.addEventListener('message', event => {
		console.log('Live reload server received message:', event.data);
	});

	// For demonstration: immediately send a reload message.
	// In practice, you’d trigger this when file changes are detected.
	server.send('reload');

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
};
