//c9.io
// var socket = io.connect('http://mms.christiangaertner.c9.io');
//openshift
var socket = io.connect('http://mms-dagardner.rhcloud.com');

var socket_status = document.getElementById('mms_status');

//the main mms function
function mms_update(data) {
    display(data);
    carcontrol(data);
    billiard(data);
}


function display(data) {
    var x = document.getElementById('x');
    var z = document.getElementById('z');
    var o = document.getElementById('o');
    x.innerText = data.x;
    z.innerText = data.z;
    o.innerText = data.o;
}

function carcontrol(data) {
    var postion = data.o / 1.5; //just because the range is from -100 to 100 (200) and we just need 100!
    
    postion += 50;
    var bar = document.getElementById('carposmarginL');
    bar.style.width = (postion - 0.5) + "%";
    
    bar = document.getElementById('carposmarginR');
    bar.style.width = (99.5 - postion) + "%";
}

function billiard(data) {
    var ball = document.getElementById('ball');
    
    var xpos = data.x * + 300;
    var zpos = data.z * + 300;
    
    ball.style.position = "absolute";
    ball.style.left = xpos;
    ball.style.top = zpos;
}


//MMS STUFF
socket.on('connect', function () {

  socket_status.style.color = '#22d332';
  socket_status.innerText = 'Connected to server!';
  // listen updates
  socket.on('mms_update', function(data) {
    mms_update(data);
  });
  socket.on('disconnect',function() {
    socket_status.style.color = '#d31713';
    socket_status.innerText = 'Connection lost';
  });
});

var controller = document.getElementById('mms_ctrl');

function handleOrientationEvent(z,x,o) {
  var data = {
    z: Math.round(z),
    x: Math.round(x),
    o: Math.round(o)
  };
  
  if(controller.checked) {
    socket.emit('mms_auth_mobile', data);
    socket.emit('mms_motion', data);
    //update is local
    mms_update(data);
    }
}

if(window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    var alpha = event.alpha;
    var gamma = event.gamma;
    var beta = event.beta;
    handleOrientationEvent(alpha, gamma, beta);
  }, false);
}