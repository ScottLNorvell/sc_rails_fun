var target_objects, circle, layer, text;

var songs = {};

var tracks = [114736768, 114912487, 115023431, 114782237];

window.onload = function() {

  // play some songs in the bg
  SC.initialize({
    client_id: '560d601638096e37de666da699486214',
  });



  SC.stream("/tracks/" + tracks[0], {
    volume: 0,
    position: 5000
  }, function(sound) {
      songs.a = sound;
      sound.play()
  });

  SC.stream("/tracks/" + tracks[1], {
    volume: 0,
    position: 5000
  }, function(sound) {
      songs.b = sound;
      sound.play()
  });

  SC.stream("/tracks/" + tracks[2], {
    volume: 0,
    position: 5000
  }, function(sound) {
      songs.c = sound;
      sound.play()
  });

  SC.stream("/tracks/" + tracks[3], {
    volume: 0,
    position: 5000
  }, function(sound) {
      songs.d = sound;
      sound.play()
  });

  // SC.stream("/tracks/" + tracks[4], {
  //   volume: 0,
  //   position: 5000
  // }, function(sound) {
  //     songs.e = sound;
  //     sound.play()
  // });

  var scr_width = window.screen.width
  var scr_height = window.screen.height

  // make stage
  var stage = new Kinetic.Stage({
    container: 'container',
    width: scr_width,
    height: scr_height
  });

  // make layer
  layer = new Kinetic.Layer();
  var play_layer = new Kinetic.Layer();

  // make circle
  circle = new Kinetic.Circle({
    x: 350,//scr_width / 2,
    y: 100,//scr_height / 2,
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  var targetCircle = new Kinetic.Circle({
    x: 100,
    y: 100,
    radius: 20,
    fill: 'blue',
    stroke: 'black',
    opacity: 0.1,
    strokeWidth: 4,
    name: 'a'
  });

  var targetCircle2 = new Kinetic.Circle({
    x: scr_width - 100,
    y: 100,
    radius: 20,
    fill: 'green',
    stroke: 'black',
    opacity: 0.1,
    strokeWidth: 4,
    name: 'b'
  });

  var targetCircle3 = new Kinetic.Circle({
    x: scr_width - 300,
    y: 500,
    radius: 20,
    fill: 'purple',
    stroke: 'black',
    opacity: 0.1,
    strokeWidth: 4,
    name: 'c'
  });

  var targetCircle4 = new Kinetic.Circle({
    x: 300,
    y: 500,
    radius: 20,
    fill: 'yellow',
    stroke: 'black',
    opacity: 0.1,
    strokeWidth: 4,
    name: 'd'

  });

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
  play_layer.add(circle);
  layer.add(targetCircle);
  layer.add(targetCircle2);
  layer.add(targetCircle3);
  layer.add(targetCircle4);

  // add the layer to the stage
  stage.add(layer);
  stage.add(play_layer);


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

    var currY = circle.getY();
    circle.setY(currY - velocity)
    checkCirclePosition();

  }, play_layer);

  var moveDown = new Kinetic.Animation(function(frame) {

    var currY = circle.getY();
    circle.setY(currY + velocity)
    checkCirclePosition();

  }, play_layer);

  var moveLeft = new Kinetic.Animation(function(frame) {

    var currX = circle.getX();
    circle.setX(currX - velocity)
    checkCirclePosition();

  }, play_layer);

  var moveRight = new Kinetic.Animation(function(frame) {

    var currX = circle.getX();
    circle.setX(currX + velocity)
    checkCirclePosition();

  }, play_layer);

  target_objects = [targetCircle, targetCircle2, targetCircle3, targetCircle4]
}

// function for circle interactions
function checkCirclePosition() {
  var distance, volume;
  var pos = circle.getAbsolutePosition();
  

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
  var pos = circle.getAbsolutePosition();
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