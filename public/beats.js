function closeUserBox(){
	document.getElementById('newUsername').style.display = 'none';
}

(function(){
	'use strict';

	var newusernameBtn = document.getElementById('newUsernameBtn');
	newUsernameBtn.addEventListener('click', function() {

		var nameInput = document.getElementById('createUsername');
		var feedback =  document.getElementById('usernameFeedback');
		var enteredUsername = nameInput.value.trim();
		if(enteredUsername == null || enteredUsername == ''){
			nameInput.classList.add('is-invalid');
			feedback.innerHTML = 'Please choose a username';
		}else if(activeUsers.includes(enteredUsername)){
			nameInput.classList.add('is-invalid');
                        feedback.innerHTML = 'Username already taken';
		}else{
			myUsername = enteredUsername;
			updateUserList();
			socket.emit('newUsername', {username : enteredUsername});
			feedback.innerHTML = '';
			nameInput.classList.remove('is-invalid');
			document.getElementById('newUsername').style.display = 'none';
		}
	}, false);

   	//make connection
	var socket = io.connect('http://ec2-18-188-12-58.us-east-2.compute.amazonaws.com:80/')

	var activeUsers = [];
	var myUsername = "";

	function updateUserList(){
		var userElem = document.getElementById('userList');
		var listItems = userElem.querySelectorAll("li");

		for(var j = 1; j < 12; j++){
			listItems[j].innerHTML = "";
		}

		listItems[1].innerHTML = myUsername + " (You)";
		var itemCounter = 2;
		var extraCounter = 0;
		for(var i = 0; i < activeUsers.length; i++){
			if(activeUsers[i] != myUsername){
				if(itemCounter < 12){
					listItems[itemCounter].innerHTML = activeUsers[i];
					itemCounter++;
				}else{
					extraCounter++;
				}
			}
		}

		if(extraCounter > 0){
			listItems[12].innerHTML = "And " + extraCounter + " others...";
		}
	}

	socket.on("startup", (data) => {
		console.log('my username : ' + data.username);
		myUsername = data.username;
		var currDisplay = data.display;
		var currBeat = data.beat;
    for(var i=0; i < currDisplay.length; i++){
      var soundname = shortSounds[i].split('.')[0];
      var row = document.querySelectorAll('.' + soundname);
      for(var j=0; j < row.length; j++){
        if(currDisplay[i] == 0){
          row[j].style.display = 'none';
        }else{
          row[j].style.display = 'block';
        }
      }
    }

    for(var x = 0; x < currBeat.length; x++){
      if(currDisplay[x] == 1){
        for(var y = 0; y < currBeat[x].length; y++){
          var tempId = (x*16) + y + 1;
          var tempTick = document.getElementById(tempId);
          if(currBeat[x][y] == 0 && tempTick.classList.contains('on')){
		  console.log('turning off (' + x + ', ' + y + ')');
            tempTick.classList.remove('on');
          }else if(currBeat[x][y] == 1 && !tempTick.classList.contains('on')){
            tempTick.classList.add('on');
		  console.log('turning on (' + x + ', ' + y + ')');
          }else{
		console.log('not doing anything :: ' + currBeat[x][y] + " :: " + tempTick.classList.contains('on'));
	  }
        }
      }else{
	      console.log('not looking at row #' + x);
      }
    }
	})

	socket.on("userUpdate", (data) => {
		console.log('first element : ' + data.userList[0]);
		activeUsers = data.userList;
		updateUserList();
	})

	socket.on("clear", () => {
		var $onbeats = document.querySelectorAll('.beat.on');
    if (!$onbeats.length) return;
    for (var r = 0; r < slength; r++) {
      for (var c = 0; c < TICKS; c++) {
        var cell = $onbeats[c + (r * TICKS)];
        if (cell) {
          cell.classList.remove('on');
        }
      }
    }
	})

	socket.on("show", (data) => {
		var row = document.querySelectorAll('.' + data.beatId);

		for(var j=0; j < row.length; j++){
          		if(row[j].style.display == 'none'){
            			row[j].style.display = 'block';
          		}
        	}
	})

	socket.on("hide", (data) => {
		 var row = document.querySelectorAll('.' + data.beatId);

		for(var j=0; j < row.length; j++){
          		row[j].style.display = 'none';
          		if(row[j].classList.contains('on')){
            			row[j].classList.remove('on');
          		}
        	}
	})

	socket.on("turnOn", (data) => {
		var sound = data.sound;
		var tick = data.tick;

		console.log('toggle : ' + sound + ', ' + tick);

		var button = document.getElementById('' + tick);
		button.classList.toggle('on');
	})

	//Emit typing
	/*message.bind("keypress", () => {
		socket.emit('typing')
	})*/

	var AudioContext = window.AudioContext || window.webkitAudioContext || false;

  	var BPM = 120;
  	var TICKS = 16;
  	var soundPrefix = './sounds/';

	var longSounds = [
    'Dreamland_bass_line_throat.mp3',
    'Dreamland_big_drums_loop.mp3',
    'Dreamland_big_gritty_sub.mp3',
    'Dreamland_clappps.mp3',
    'Dreamland_clicking.mp3',
    'Dreamland_Dreamy_synth_long.mp3',
    'Dreamland_flutes_hi.mp3',
    'Dreamland_flutes_low.mp3',
    'Dreamland_mello_cellos.mp3',
    'Dreamland_mello_vibes.mp3',
    'Dreamland_prophet_bass.mp3',
    'Dreamland_prophet_brassy.mp3',
    'Dreamland_prophet_organ_bass.mp3',
    'arp2600_rise.mp3',
    'Your_Love_synth_drone.mp3'
  ];
  var mediumSounds = [
    'Dreamland_FX_2.mp3',
    'Dreamland_FX.mp3',
    'Dreamland_intro_noise.mp3',
    'lfo.mp3',
    'mellotron_flute_cray.mp3',
    'Your_Love_vocoder_deja_vu.mp3'
  ];
  var twoSecSounds =[
    'flute_lo_twiddles_1.mp3',
    'flute_lo_twiddles_2.mp3',
    'flute_lo_twiddles_3.mp3',
    'flute_lo_twiddles_4.mp3',
    'jupiter_1.mp3',
    'jupiter_2.mp3',
    'jupiter_3.mp3',
    'jupiter_4.mp3',
    'jupiter_5.mp3',
    'jupiter_6.mp3',
    'jupiter_7.mp3',
    'jupiter_8.mp3',
    'jupiter_9.mp3',
    'jupiter_10.mp3',
    'jupiter_11.mp3',
    'mellotron_1.mp3',
    'mellotron_2.mp3',
    'mellotron_3.mp3',
    'mellotron_4.mp3',
    'mellotron_5.mp3',
    'mellotron_6.mp3',
    'mellotron_7.mp3',
    'mellotron_8.mp3',
    'moog_honk_1.mp3',
    'moog_honk_2.mp3',
    'moog_honk_3.mp3',
    'prophet_run.mp3',
    'string_run.mp3',
    'Your_Love_Flute_Twiddle.mp3',
    'Your_Love_Guitar.mp3',
    'Your_Love_Moog_Honk_1.mp3',
    'Your_Love_Moog_Honk_2.mp3',
    'Your_Love_String_Run.mp3',
    'Your_Love_synth_stab_1.mp3',
    'Your_Love_synth_stab_2.mp3',
    'Your_Love_vox_eh_eh_eh.mp3',
    'Your_Love_vox_yeahh.mp3',
    'Your_Love_whooop.mp3'
  ];
  var shortSounds = [
    'brass.mp3',
    'car_revv.mp3',
    'cash.mp3',
    'driftin1.mp3',
    'driftin2.mp3',
    'driftin3.mp3',
    'sniff.mp3',
    'tokyo_driftinnn_hook.mp3',
    'uh_oh.mp3',
    'whipp.mp3',
    'zel_aaargh.mp3',
    'zel_yuh.mp3',
    'b808_1.mp3',
    'b808_2.mp3',
    'b808_3.mp3',
    'b808_4.mp3',
    'b808_5.mp3',
    'b808_6.mp3',
    'b808_7.mp3',
    'b808_8.mp3',
    'hat_1.mp3',
    'hat_2.mp3',
    'hat_3.mp3',
    'hat_4.mp3',
    'kick.mp3',
    'perc_1.mp3',
    'perc_2.mp3',
    'perc_3.mp3',
    'perc_4.mp3',
    'perc_5.mp3',
    'perc_6.mp3',
    'perc_7.mp3',
    'perc_8.mp3',
    'perc_9.mp3',
    'perc_10.mp3',
    'saw_middle_8.mp3',
    'saw_middle_8_2.mp3',
    'saw_middle_8_3.mp3',
    'slappy_roller_thing.mp3',
    'snr.mp3',
    'string_1.mp3',
    'string_2.mp3',
    'string_3.mp3',
    'string_4.mp3',
    'string_5.mp3',
    'string_6.mp3',
    'string_7.mp3',
    'sub.mp3',
    'tom_slam_1.mp3',
    'tom_slam_2.mp3',
    'Your_Love_Sticks.mp3',
    'Your_Love_Tom_Bash.mp3',
    'Your_Love_tubby_toms.mp3',
    'punches.mp3'
  ];

  var defaultShorts = [1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1
  ];

	var buffers = {};
  if (AudioContext) {
    var context = new AudioContext();
  }

  var playSound = function (index) {
    var url = soundPrefix + shortSounds[index];

    if (!AudioContext) {
      new Audio(url).play();
      return;
    }
    if (typeof(buffers[url]) == 'undefined') {
      buffers[url] = null;
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'arraybuffer';

      req.onload = function () {
        context.decodeAudioData(req.response,
          function (buffer) {
            buffers[url] = buffer;
            playBuffer(buffer);
          },
          function (err) {
            console.log(err);
          }
        );
      };
      req.send();
    }
    function playBuffer(buffer) {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start();
    };
    if (buffers[url]) {
      playBuffer(buffers[url]);
    }
  };

	var slength = shortSounds.length;
  var $grid = document.querySelectorAll('.grid')[0];
  var $button = document.createElement('button');
  $button.classList.add('beat');

	for (var r = 0; r < slength; r++) {
    for (var c = 0; c < TICKS; c++) {
      var _$button = $button.cloneNode(true);
      if (c === 0) {
        _$button.classList.add('first');
      }
      // add a class based on the instrument
      var soundname = shortSounds[r].split('.')[0];
      _$button.classList.add(soundname);
      _$button.dataset.instrument = soundname;

     var currbeat = (r*TICKS) + c;
     _$button.id = currbeat + 1;

      _$button.addEventListener('click', function() {
        this.classList.toggle('on');
	      socket.emit('turnOn', {sound : this.dataset.instrument, tick : this.id})
      }, false);

      if(defaultShorts[r] == 0){
        _$button.style.display = 'none';
      }

      $grid.appendChild(_$button);
    }
  }

	var $beats = document.querySelectorAll('.beat');

	var clearBeat = function() {
    socket.emit('clear');
    var $onbeats = document.querySelectorAll('.beat.on');
    if (!$onbeats.length) return;
    for (var r = 0; r < slength; r++) {
      for (var c = 0; c < TICKS; c++) {
        var cell = $onbeats[c + (r * TICKS)];
        if (cell) {
          cell.classList.remove('on');
        }
      }
    }
  };
  document.querySelector('#clear').addEventListener('click', clearBeat);

	var box = document.getElementById("customBox");

	var updateShorts = function () {
    var inputs = document.getElementsByClassName('form-check-input');

    for(var i=0; i < inputs.length; i++){
      var row = document.querySelectorAll('.' + inputs[i].id);

      if(inputs[i].checked == true){
        socket.emit('show', {beatId : inputs[i].id, beatIndex : i})
        for(var j=0; j < row.length; j++){
          if(row[j].style.display == 'none'){
            row[j].style.display = 'block';
          }
        }
      }else{
        socket.emit('hide', {beatId : inputs[i].id, beatIndex : i})
        for(var j=0; j < row.length; j++){
          row[j].style.display = 'none';
          if(row[j].classList.contains('on')){
            row[j].classList.remove('on');
          }
        }
      }
    }

    box.style.display = 'none';
  }	

	document.querySelector('#update').addEventListener('click', updateShorts);

  var displayCustomBox = function() {

    if(box.style.display == 'block'){
      box.style.display = 'none';
    }else{
      box.style.display = 'block';
    }
  }

  document.querySelector('#customize').addEventListener('click', displayCustomBox);

var currentTick = 0;
  var lastTick = TICKS - 1;
  var tickTime = 1 / (4 * BPM / (60 * 1000));

var requestInterval = function(fn, delay) {
    var start = new Date().getTime();
    var handle = {};

    function loop() {
      var current = new Date().getTime();
      var delta = current - start;
      if (delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
      handle.value = requestAnimationFrame(loop);
    }
    handle.value = requestAnimationFrame(loop);
    return handle;
  };

  requestInterval(function() {
    for (var i = 0; i < slength; i++) {
      var lastBeat = $beats[i * TICKS + lastTick];
      var currentBeat = $beats[i * TICKS + currentTick];
      lastBeat.classList.remove('ticked');
      currentBeat.classList.add('ticked');
      if (currentBeat.classList.contains('on')) {
        // new Audio(soundPrefix + sounds[i]).play();

        playSound(i);
      }
    }
    lastTick = currentTick;
    currentTick = (currentTick + 1) % TICKS;
  }, 1 / (4 * BPM / (60 * 1000)));
}());
