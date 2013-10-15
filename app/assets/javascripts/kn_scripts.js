var target_objects = [], avatar, layer, text;

var songs = {};

var circ_points = [
 { x: 100, y: 100, color: "yellow" },
 { x: 650, y: 100, color: "blue" },
 { x: 1050, y: 300, color: "green" },
 { x: 100, y: 100, color: "purple" },
 { x: 1050, y: 500, color: "orange" }
]

var tracks = [114736768, 114912487, 115023431, 114782237];

var test_tracks;

var genre = 'folk'; //prompt('genre please');

window.onload = function() {

  $.ajax({
    url: '/show',
    dataType: 'json',
    data: { genre: genre }
  })
  .done(function(data) {
    // load all the audio
    test_tracks = data;
    loadSounds(data);
  })
}

function loadSounds(track_data) {
  // play some songs in the bg
  SC.initialize({
    client_id: '560d601638096e37de666da699486214'
  });

  $.each(track_data, function(i, track) {
    var id = track.id;
    var title = track.title;

    SC.stream("/tracks/" + id, {
      volume: 0,
      position: 5000
    }, function(sound) {
        console.log(title);
        songs[title] = sound;
        sound.play()
    });

  });

  SC.whenStreamingReady(function(track_data) { 
    drawGame(track_data); 
    console.log('songs loaded');
  });
}

function drawGame(track_data) {
  var scr_width = window.innerWidth;
  var scr_height = window.innerHeight;

  // make stage
  var stage = new Kinetic.Stage({
    container: 'container',
    width: scr_width,
    height: scr_height
  });

  var avatar_layer = new Kinetic.Layer();

  // make layer
  layer = new Kinetic.Layer();

  // make avatar
  avatar = new Kinetic.Circle({
    x: 350,//scr_width / 2,
    y: 100,//scr_height / 2,
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  console.log("track_data = ", test_tracks)

  $.each(test_tracks, function(i, track) {
    var pt = circ_points[i];
    var circle = new Kinetic.Circle({
      x: pt.x,
      y: pt.y,
      radius: 20,
      fill: pt.color,
      stroke: 'black',
      opacity: 0.1,
      strokeWidth: 4,
      name: track.title
    });
    target_objects.push(circle);
    layer.add(circle);
  });

  // var targetCircle = new Kinetic.Circle({
  //   x: 100,
  //   y: 100,
  //   radius: 20,
  //   fill: 'blue',
  //   stroke: 'black',
  //   opacity: 0.1,
  //   strokeWidth: 4,
  //   name: 'a'
  // });

  // var targetCircle2 = new Kinetic.Circle({
  //   x: 650,
  //   y: 100,
  //   radius: 20,
  //   fill: 'green',
  //   stroke: 'black',
  //   opacity: 0.1,
  //   strokeWidth: 4,
  //   name: 'b'
  // });

  // var targetCircle3 = new Kinetic.Circle({
  //   x: 1050,
  //   y: 100,
  //   radius: 20,
  //   fill: 'purple',
  //   stroke: 'black',
  //   opacity: 0.1,
  //   strokeWidth: 4,
  //   name: 'c'
  // });

  // var targetCircle4 = new Kinetic.Circle({
  //   x: 300,
  //   y: 500,
  //   radius: 20,
  //   fill: 'yellow',
  //   stroke: 'black',
  //   opacity: 0.1,
  //   strokeWidth: 4,
  //   name: 'd'

  // });

  // array of target circle points (eventually returned from function that makes circles)
  // var target_points = [ {x: 100, y: 100}, {x:500, y:300} ]

  // make text
  text = new Kinetic.Text({
    x: 10,
    y: 10,
    fontFamily: 'Helvetica',
    fontSize: 24,
    text: 'Hit an Arrow Key!',
    fill: 'black'
  });

  // add circle and text to layer
  layer.add(text);
  // layer.add(targetCircle);
  // layer.add(targetCircle2);
  // layer.add(targetCircle3);
  // layer.add(targetCircle4);

  avatar_layer.add(avatar);

  // add the layer to the stage
  stage.add(layer);
  stage.add(avatar_layer);


  // ======== Key Events! ========

  // keep track of keys pressed
  var pressed = {}

  // 'up'
  KeyboardJS.on('up',
    // key press function 
    function(e, keysPressed, keyCombo) {
      e.preventDefault();
      // prevent repeating
      if (!pressed['up']) {
        pressed['up'] = true;
        moveDown.stop();
        moveUp.start();      
      }
    },
    // key release function 
    function(e, keysPressed, keyCombo) { 
      if (pressed['up']) {
        pressed['up'] = false;
        moveUp.stop(); 
      }
  });

  // 'down'
  KeyboardJS.on('down',
    // key press function 
    function(e, keysPressed, keyCombo) {
      e.preventDefault();
      // prevent repeating
      if (!pressed['down']) {
        pressed['down'] = true;
        moveUp.stop();
        moveDown.start();      
      }
    },
    // key release function 
    function(e, keysPressed, keyCombo) { 
      if (pressed['down']) {
        pressed['down'] = false;
        moveDown.stop(); 
      }
  });

  // 'left'
  KeyboardJS.on('left',
    // key press function 
    function(e, keysPressed, keyCombo) {
      e.preventDefault();
      // prevent repeating
      if (!pressed['left']) {
        pressed['left'] = true;
        moveRight.stop();
        moveLeft.start();

      }
    },
    // key release function 
    function(e, keysPressed, keyCombo) { 
      if (pressed['left']) {
        pressed['left'] = false;
        moveLeft.stop(); 
      }
  });

  // 'right'
  KeyboardJS.on('right',
    // key press function 
    function(e, keysPressed, keyCombo) {
      e.preventDefault();
      // prevent repeating
      if (!pressed['right']) {
        pressed['right'] = true;
        moveLeft.stop();
        moveRight.start();      
      }
    },
    // key release function 
    function(e, keysPressed, keyCombo) { 
      if (pressed['right']) {
        pressed['right'] = false;
        moveRight.stop(); 
      }
  });


  // ======== Moving Animations ========

  var velocity = 2;

  var moveUp = new Kinetic.Animation(function(frame) {

    var currY = avatar.getY();
    avatar.setY(currY - velocity)
    checkCirclePosition();

  }, avatar_layer);

  var moveDown = new Kinetic.Animation(function(frame) {

    var currY = avatar.getY();
    avatar.setY(currY + velocity)
    checkCirclePosition();

  }, avatar_layer);

  var moveLeft = new Kinetic.Animation(function(frame) {

    var currX = avatar.getX();
    avatar.setX(currX - velocity)
    checkCirclePosition();

  }, avatar_layer);

  var moveRight = new Kinetic.Animation(function(frame) {

    var currX = avatar.getX();
    avatar.setX(currX + velocity)
    checkCirclePosition();

  }, avatar_layer);

  // target_objects = [targetCircle, targetCircle2, targetCircle3, targetCircle4]
}

// function for circle interactions
function checkCirclePosition() {
  var distance, volume;
  var pos = avatar.getAbsolutePosition();
  

  for (i in target_objects) {
    var targObj = target_objects[i];
    var targSong = songs[targObj.getName()]
    distance = getDistanceFrom(targObj);

    if (distance <= 40) {
      text.setText('I touched the circle there!');
      targSong.setVolume(100);
    } else if (distance <= 200) {
      var volume_linear = -5/8 * distance + 125;
      var volume_parabolic = Math.pow((distance - 200),2) / 256;
      volume = volume_parabolic;
      targObj.setOpacity(30/distance);
      targSong.setVolume(volume);
      text.setText('Circle Position = {x: ' + pos.x + ', y: ' + pos.y + "} Distance = " + Math.round(distance) + " Volume = " + Math.round(volume));
    } else {
      targObj.setOpacity(0.1);
      targSong.setVolume(0);
    }
  }
  layer.draw();
}

function getDistanceFrom(target) {
  var pos = avatar.getAbsolutePosition();
  var targ_pos = target.getAbsolutePosition();
  var distance = Math.sqrt( Math.pow((pos.x - targ_pos.x), 2) + Math.pow((pos.y - targ_pos.y), 2)  );
  
  if (distance > 225) {
    // will eventually return false so we don't redraw canvas each
    return distance
  
  } else {
    console.log("inside!")
    
    return distance;

  }
}






















// example of moving left and up!
// var amplitude = 75;
// var period = 1000;
// // in ms
// var centerX = stage.getWidth() / 2;
// var centerY = stage.getHeight() / 2;

// var anim = new Kinetic.Animation(function(frame) {
//   hexagon.setX(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
//   hexagon.setY(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerY);
  
// }, layer);

// anim.start();