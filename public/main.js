///////////////////////////////////////////// 
// START ROS Code
// Connecting to ROS
// -----------------

var ros = new ROSLIB.Ros();

// Create a connection to the rosbridge WebSocket server.
ros.connect('ws://localhost:9090');

ros.on('connection', function () {
  console.log('Connected to websocket server.');
});

ros.on('error', function (error) {
  console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function () {
  console.log('Connection to websocket server closed.');
});

// Publishing a Topic
// ------------------

var publisher = new ROSLIB.Topic({
  ros: ros,
  name: '/b2n_data',
  messageType: 'std_msgs/String'
});

// publisher.publish(data);

//Subscribing to a Topic
//----------------------

// Like when publishing a topic, we first create a Topic object with details of the topic's name
// and message type. Note that we can call publish or subscribe on the same topic object.
var listener = new ROSLIB.Topic({
  ros: ros,
  name: '/n2b_data',
  serviceType: 'std_msgs/String'
});

// Then we add a callback to be called every time a message is published on this topic.
listener.subscribe(function (message) {
  // console.log('Received message on ' + listener.name + ': ' + message.data);
  var payload = {
    sequence_no: sequence_no++,
    data: message.data,
    type: 'b64/octree',
    sent_time: Date.now() - time_offset
  };
  if (conn._bufferSize == 0) {
    conn.send(payload);
  }
});

// ROS END
///////////////////////////////////////////////

function exportToCsvFile(csvStr) {
  let dataUri = 'data:text/csv;charset=utf-8,' + csvStr;

  let exportFileDefaultName = 'data.csv';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function pingTest() {
  conn.send({ ping_init: Date.now() });
  console.log('ping_test started');
}
function pingReply(data) {
  data.ping_reply = Date.now();
  conn.send(data);
  console.log('ping_reply done');
}