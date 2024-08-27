const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];
let gameState = {};

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    handleGameMessage(parsedMessage, ws);
  });
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

function broadcastGameState() {
  const state = JSON.stringify(gameState);
  clients.forEach(client => client.send(state));
}

function handleGameMessage(message, ws) {
  switch (message.type) {
    case 'INIT':
      gameState = initializeGame(message.payload);
      broadcastGameState();
      break;
    case 'MOVE':
      if (validateMove(message.payload)) {
        gameState = updateGameState(gameState, message.payload);
        broadcastGameState();
      } else {
        ws.send(JSON.stringify({ type: 'INVALID_MOVE' }));
      }
      break;
  }
}

function initializeGame(payload) {
  return {};
}

function validateMove(payload) {
  return true;
}

function updateGameState(state, move) {
  return state;
}
