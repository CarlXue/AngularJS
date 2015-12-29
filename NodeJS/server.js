var http = require('http');
var Router = require('router');
var router = new Router();
var bodyParser = require('body-parser');

// var count = 0;
// function requestHandler(request, response) {
//   var message,
//       status = 200;
//   count += 1;
//   switch(request.url){
//     case '/count':
//       message = count.toString();
//       break;
//     case '/hello':
//       message = 'World';
//       break;
//     default:
//       status = 404;
//       message = 'Not found';
//       break;
//   }
//
//   response.writeHead( 201, {
//     'Content-type': 'text/json'
//   });
//   message = 'Visitor count: ' + count + 'path: ' + request.url;
//   console.log(message);
//   response.end(message);
// }

var server = http.createServer(function (request, response) {
  router(request, response, function(error) {
    if (!error) {
      response.writeHead(404);
    }else{
      console.log(error.message, error.stack);
      response.writeHead(400);
    }
    response.end('\n');
  });
});

var counter = 0;
var messages = {};
//first route handler
router.use(bodyParser.text());
function createMessage(request, response) {
  // body...
  var id = counter += 1;
  var message = request.body;
  console.log('Create message', id, message);
  messages[id] = message;
  response.writeHead( 201, {
    'Content-type' : 'text/plain',
    'Location' : '/message/' + id
  });
  response.end(message.toString());
}

function readMessage(request, response){
  var id = request.params.id,
      message = messages[id];
  if (typeof message !== 'string') {
    console.log('Message not found', id);
    response.writeHead(404);
    response.end('\n');
    return;
  }
  console.log('Read message', id, message);
  response.writeHead(200, {
    'Content-type' : 'text/plain'
  });
  response.end(message);
}

function deleteMessage(request, response) {
  var id = request.params.id,
      message = messages[id];
  if (typeof message !== 'string') {
    console.log('Message not found', id);
    response.writeHead(404);
    response.end('\n');
    return;
  }
  console.log('Delete message:', id);
  messages[id] = undefined;
  response.writeHead(204, { });
  response.end('');
}

function readMessages(request, response) {
  // body...
  var id,
      message,
      messageList = [],
      messageString;
  for(id in messages) {
    if(!messages.hasOwnProperty(id)){
      continue;
    }
    message = messages[id];
    if (typeof message !== 'string') {
      continue;
    }
    messageList.push(message);
  }
  console.log('Read messages', JSON.stringfy(
    messageList, null,'    '
  ));
  response.writeHead(200, {'Content-type':'text/plain'});
  response.end(messageString);
}
//define route
router.post('/message', createMessage);
router.get('/meesage/:id', readMessage);
router.delete('/messsage/:id', deleteMessage);
router.get('/messages', readMessages);

server.listen(8080, function(){
  console.log('Listening on port 8080');
});
