var SerialPort  = require('../').SerialPort;
var Buffer      = require('buffer').Buffer;
var port        = new SerialPort();


var driveMethods    =   [
                            'drive',
                            'direct',
                            'pwm',
                            'motors',
                            'pwmmotors'
                        ];

var modes           =   [ 
                            'off',      //0
                            'passive',  //1
                            'safe',     //2
                            'full'      //3
                        ];

var cleaning        =   [ 
                            'clean',    //0
                            'max',      //1
                            'spot',     //2
                            'dock'      //3
                        ];


var mode            =   modes[0];

var clean           =   undefined;


//Setup
port.on('data', function(data)
{
    console.log(data.toString());
});


port.on('error', function(err)
{
    console.log(err);
});


port.open(  '/dev/ttyAMA0',
            {
                baudRate:   115200,
                dataBits:   8,
                parity:     'none',
                stopBits:   1
            },
            function(err)
            {
                port.write("There was an error opening the port: " + err);
                port.close();
            });


//Util functions

function sendCommand(opCode, toMode, dataBytes)
{
    if(opCode === undefined || opCode > 150 || opCode < 128)
    {
        console.log('Invalid opcode: ' + opCode);
        return 0;
    }
    else if(dataBytes !== undefined && !(dataBytes instanceof Array))
    {
        console.log('dataBytes must be an array');
        return 0;
    }
    else
    {
        var buf = new Buffer(1 + dataBytes.length);

        buf[0]  = opCode;

        if(dataBytes !== undefined)
        {
            for(int i = 0; i < dataBytes.length; i++)
            {
                buf[i + 1] = dataBytes[i];
            }
        }

        port.write(buf);

        if(toMode !== undefined)
        {
            mode    = toMode;
        }
    }
}


//Roomba commands

//Start up the Roomba
function init()
{
    sendCommand(128, modes[1]);
}


function changeBaud(baudCode)
{
    if(mode === modes[1] || mode === modes[2] || mode === modes[3])
    {
        if(baudCode >= 0 && < 12)
        {
            sendCommand(129, undefined, [baudeCode]);
        }
        else
        {
            console.log('Invalid Baud Code supplied, must be between 0-11, supplied: ' + baudCode);
        }
    }
    else
    {
        console.log('Cannot initiate this command in ' + mode + ' mode.');
    }
}


function changeMode(toMode)
{
    if(mode === modes[1] || mode === modes[2] || mode === modes[3])
    {
        if(toMode == modes[0])
        {
            sendCommand(133, modes[0]);
        }
        else if(toMode === modes[2])
        {
            sendCommand(131, modes[2]);
        }
        else if(toMode === modes[3])
        {
            sendCommand(132, modes[3]);
        }
    }
    else
    {
        console.log('Cannot initiate this command in ' + mode + ' mode.');
    }
}



function clean(toCleaning)
{
    if(mode === modes[1] || mode === modes[2] || mode === modes[3])
    {
        if(toCleaning == cleaning[0])
        {
            sendCommand(135, modes[1]);
            clean   = cleaning[0];
        }
        else if(toCleaning == cleaning[1])
        {
            sendCommand(136, modes[1]);
            clean   = cleaning[1];
        }
        else if(toCleaning == cleaning[2])
        {
            sendCommand(134, modes[1]);
            clean   = cleaning[2];
        }
        else if(toCleaning == cleaning[3])
        {
            sendCommand(133, modes[1]);;
            clean   = cleaning[3];
        }        
    }
    else
    {
        console.log('Cannot initiate this command in ' + mode + ' mode.');
    }
}

function schedule()
{
    //167
}

function drive(method, options)
{

}

function light()
{

}


function addSong(songNumber, songLength, notes)
{
    if(mode === modes[1] || mode === modes[2] || mode === modes[3])
    {
        var songData = [songNumber, songLength].concat(notes);

        sendCommand(140, undefined. songData);
    }
    else
    {
        console.log('Cannot initiate this command in ' + mode + ' mode.');
    }
}


function playSong(songNumber)
{
    f(mode === modes[2] || mode === modes[3])
    {
        sendCommand(141, undefined, [songNumber]);
    }
    else
    {
        console.log('Cannot initiate this command in ' + mode + ' mode.');
    }
}

init();
changeMode(modes[1]);