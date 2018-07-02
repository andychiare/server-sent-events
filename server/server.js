const http = require('http');

http.createServer((request, response) => {
  console.log(`Request url: ${request.url}`);

  const eventHistory = [];

  request.on('close', () => {
    closeConnection(response);
  });

  if (request.url.toLowerCase() === '/events') {
    response.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    checkConnectionToRestore(request, response, eventHistory);

    sendEvents(response, eventHistory);
  } else {
    response.writeHead(404);
    response.end();  
  }
}).listen(5000, () => {
  console.log('Server running at http://127.0.0.1:5000/');
});

function sendEvents(response, eventHistory) {
  setTimeout(() => {
    if (!response.finished) {
      const eventString = 'id: 1\nevent: flightStateUpdate\ndata: {"flight": "I768", "state": "landing"}\n\n';
      response.write(eventString);
      eventHistory.push(eventString);
    }
  }, 3000);

  setTimeout(() => {
    if (!response.finished) {
      const eventString = 'id: 2\nevent: flightStateUpdate\ndata: {"flight": "I768", "state": "landed"}\n\n';
      response.write(eventString);
      eventHistory.push(eventString);
    }
  }, 6000);

  setTimeout(() => {
    if (!response.finished) {
      const eventString = 'id: 3\nevent: flightRemoval\ndata: {"flight": "I768"}\n\n';
      response.write(eventString);
      eventHistory.push(eventString);
    }
  }, 9000);

  setTimeout(() => {
    if (!response.finished) {
      const eventString = 'id: 4\nevent: closedConnection\ndata: \n\n';
      eventHistory.push(eventString);
    }
  }, 12000);
}

function closeConnection(response) {
  if (!response.finished) {
    response.end();
    console.log('Stopped sending events.');
  }
}

function checkConnectionToRestore(request, response, eventHistory) {
  if (request.headers['last-event-id']) {
    const eventId = parseInt(request.headers['last-event-id']);

    eventsToReSend = eventHistory.filter((e) => e.id > eventId);

    eventsToReSend.forEach((e) => {
      if (!response.finished) {
        response.write(e);
      }
    });
  }
}
