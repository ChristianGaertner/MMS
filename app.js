var express = require('express'),
  http = require('http'),
  path = require('path'),
  routes = require('./routes');

var app = express();

app.configure(function() {
  app.set('port', process.env.OPENSHIFT_INTERNAL_PORT || process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.cookieParser('675jhgt67ugkzgkf6ufkzgulig6kzu'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.bodyParser());
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

// main route
app.get('/', routes.index);

// init socket
var server = http.createServer(app),
io = require('socket.io').listen(server);

// listen on the express port
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


io.sockets.on('connection', function (socket) {
    socket.on('mms_motion', function (data) {
        socket.broadcast.emit('mms_update', data);
    });
});

