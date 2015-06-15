$(function() {

    var ready = false;
    var delay = 0; // play one note every quarter second
    var velocity = 127; // how hard the note hits

    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            console.log(state, progress);
        },
        onsuccess: function() {
            var ready = true;
            MIDI.setVolume(0, 127);
            var note = 40;
        }
    });


    var FADE_TIME = 150;
    var COLORS = [
        ["#3498db", "#2980b9"],
        ["#9b59b6", "#8e44ad"],
        ["#e67e22", "#d35400"]
    ];

    var DEFAULT_COLOR = "#ecf0f1"
    var DEFAULT_TEXT = "YEEZUS"

    var $window = $(window);
    var $page = $(".page");
    var $intro = $(".intro");

    var down = false;

    var socket = io();
    socket.emit("add user", "admin");


    var SOUNDS = [
        [60, 62],
        [64, 65],
        [67, 69]
    ];


    var TEXT = [
        ["C", "D"],
        ["E", "F"],
        ["G", "A"]
    ]

    var STATE = [
        [false, false],
        [false, false],
        [false, false],
    ]

    function noneArePlaying(){
      for(var i = 0; i < STATE.length; i++){
        for(var j = 0; j < STATE[i].length; j++){
          if(STATE[i][j] == true){
            return false;
          }
        }
      }
      return true;
    }

    function getButtonDetails(button) {
        var row = button.charAt(6);
        var column = button.charAt(7);
        return [row, column];
    }

    function playButton(row, column) {
        $page.css('background-color', COLORS[row][column]);
        $intro.text(TEXT[row][column])
        var note = SOUNDS[row][column];
        MIDI.noteOn(0, note, velocity, delay);
        STATE[row][column] = true;

    }

    function stopButton(row, column) {
        var note = SOUNDS[row][column];
        console.log(note)
        MIDI.noteOff(0, note, delay);
        STATE[row][column] = false;
        if (noneArePlaying()) {
            $page.css('background-color', DEFAULT_COLOR);
            $intro.text(DEFAULT_TEXT)
        }
    }


    socket.on('button down', function(instrument, button) {
        var details = getButtonDetails(button);
        var row = details[0];
        var column = details[1];
        playButton(row, column);
    });

    socket.on('button up', function(intrument, button) {
        var details = getButtonDetails(button);
        var row = details[0];
        var column = details[1];
        stopButton(row, column);
    });

    
            

});
