$(function() {

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

    var intro_sound = new Howl({
        urls: ['/audio/intro.ogg']
    });

    var dontletme_sound = new Howl({
        urls: ['/audio/dontletme.ogg']
    });

    var definitelyin = new Howl({
        urls: ['/audio/definitelyin.ogg']
    });

    var gotta1 = new Howl({
        urls: ['/audio/gotta1.wav']
    });

    var gotta2 = new Howl({
        urls: ['/audio/gotta2.wav']
    });

    var nanana = new Howl({
        urls: ['/audio/nanana.wav']
    });

    var SOUNDS = [
        [intro_sound, dontletme_sound],
        [definitelyin, gotta1],
        [gotta2, nanana]
    ];


    var TEXT = [
        ["UHH", "DONT LET ME"],
        ["DEFINITELY IN", "GOTTA"],
        ["GOTTA", "NA NA NA"]
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
        SOUNDS[row][column].play();
        STATE[row][column] = true;
    }

    function stopButton(row, column) {
        SOUNDS[row][column].fade(1.0, 0.0, 100, function(){
          SOUNDS[row][column].stop();
          SOUNDS[row][column].volume(1.0);
        });
        STATE[row][column] = false;
        if (noneArePlaying()) {
            $page.css('background-color', DEFAULT_COLOR);
            $intro.text(DEFAULT_TEXT)
        }
    }


    socket.on('button down', function(button) {
        var details = getButtonDetails(button);
        var row = details[0];
        var column = details[1];
        playButton(row, column);
    });

    socket.on('button up', function(button) {
        var details = getButtonDetails(button);
        var row = details[0];
        var column = details[1];
        stopButton(row, column);
    });


});
