var SerialPort  = require('serialport').SerialPort;
var port        = new SerialPort( '/dev/ttyAMA0',
            {
                baudRate:   115200,
                dataBits:   8,
                parity:     'none',
                stopBits:   1
            });

var Buffer      = require('buffer').Buffer;


console.log('App started');


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


//Util functions

function sendCommand(opCode, toMode, dataBytes)
{
    if(opCode === undefined || opCode > 150 || opCode < 128)
    {
        console.log('Invalid opcode: ' + opCode);
        return 0;
    }
    else if((toMode === undefined && dataBytes === undefined) || (dataBytes !== undefined && !(dataBytes instanceof Array)))
    {
        console.log('dataBytes must be an arrayi or toMode must be provided');
        return 0;
    }
    else
    {
        var buf = new Buffer(1 + (dataBytes === undefined ? 0 : dataBytes.length));

        buf.writeUInt8(opCode, 0);

        if(dataBytes !== undefined)
        {
            for(var i = 0; i < dataBytes.length; i++)
            {
                buf.writeUInt8(dataBytes[i], i + 1);
            }
        }

        port.write(buf, function(err, results)
        {
            console.log('Serial write error: ' + err);
            console.log('Serial write result: ' + results);
        });

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
        if(baudCode >= 0 && baudCode < 12)
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
    if(mode === modes[2] || mode === modes[3])
    {
        sendCommand(141, undefined, [songNumber]);
    }
    else
    {
        console.log('Cannot initiate this command in ' + mode + ' mode.');
    }
}


//Setup
port.on('open', function()
{
    console.log('Serial port open');

    port.on('data', function(data)
    {
        var inBuf = new Buffer(data.length);

        var stringOut = '- ';

        for(var i = 0; i < data.length; i++)
        {
            stringOut += inBuf.readUInt8(i) + ', ';
        }

        console.log(stringOut);
    });

    port.on('error', function(err)
    {
        console.log(err);
    }); 

    setTimeout(init, 50);
    setTimeout(changeMode, 100, modes[0]); 
    //setTimeout(sendCommand, 150, 139, undefined, [4,0,128]);

});
