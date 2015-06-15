$(function() {

    var FADE_TIME = 150;
    var COLORS = [
        ["#3498db", "#2980b9"],
        ["#9b59b6", "#8e44ad"],
        ["#e67e22", "#d35400"]
    ];
    var DEFAULT_COLOR = "#ecf0f1"
    var DEFAULT_TEXT = "PLAY!"

    var $window = $(window);
    var $page = $(".page");
    var $intro = $(".intro");

    var down = false;

    var socket = io();
    socket.emit("add user", "admin");


    var C_Piano = new Howl({
        urls: ['/audio/piano/C4.mp3']
    });

    var D_Piano = new Howl({
        urls: ['/audio/piano/D4.mp3']
    });

    var E_Piano = new Howl({
        urls: ['/audio/piano/E4.mp3']
    });

    var F_Piano = new Howl({
        urls: ['/audio/piano/F4.mp3']
    });

    var G_Piano = new Howl({
        urls: ['/audio/piano/G4.mp3']
    });

    var A_Piano = new Howl({
        urls: ['/audio/piano/A4.mp3']
    });

    var C1_Drums = new Howl({
        urls: ['/audio/drums/C1.mp3']
    });

    var C2_Drums = new Howl({
        urls: ['/audio/drums/C2.mp3']
    });

    var C3_Drums = new Howl({
        urls: ['/audio/drums/C3.mp3']
    });

    var C4_Drums = new Howl({
        urls: ['/audio/drums/C4.mp3']
    });

    var C5_Drums = new Howl({
        urls: ['/audio/drums/C5.mp3']
    });

    var C6_Drums = new Howl({
        urls: ['/audio/drums/C6.mp3']
    });



    var SOUNDS = [
        [
            [C_Piano, C1_Drums],
            [D_Piano, C2_Drums]
        ],
        [
            [E_Piano, C3_Drums],
            [F_Piano, C4_Drums]
        ],
        [
            [G_Piano, C5_Drums],
            [A_Piano, C6_Drums]
        ]
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

    function noneArePlaying() {
        for (var i = 0; i < STATE.length; i++) {
            for (var j = 0; j < STATE[i].length; j++) {
                if (STATE[i][j] == true) {
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

    function playButton(row, column, instrument) {
        $page.css('background-color', COLORS[row][column]);
        $intro.text(TEXT[row][column])
        SOUNDS[row][column][instrument].play();
        STATE[row][column] = true;
    }

    function stopButton(row, column, instrument) {
        SOUNDS[row][column][instrument].fade(1.0, 0.0, 100, function() {
            SOUNDS[row][column][instrument].stop();
            SOUNDS[row][column][instrument].volume(1.0);
        });
        STATE[row][column] = false;
        if (noneArePlaying()) {
            $page.css('background-color', DEFAULT_COLOR);
            $intro.text(DEFAULT_TEXT)
        }
    }


    socket.on('button down', function(instrument, button) {
        var index;

        if(instrument == "piano"){
            index = 0;
        } else{
            index = 1;
        }

        var details = getButtonDetails(button);
        var row = details[0];
        var column = details[1];
        playButton(row, column, index);
    });

    socket.on('button up', function(instrument, button) {
        var index;

        if(instrument == "piano"){
            index = 0;
        } else{
            index = 1;
        }

        var details = getButtonDetails(button);
        var row = details[0];
        var column = details[1];
        stopButton(row, column, index);
    });


});
