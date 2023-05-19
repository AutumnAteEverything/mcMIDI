// Tested in Minecrat 1.19.2

const mineflayer = require('mineflayer'); // npm install mineflayer
const midi = require('midi'); // npm install midi
const output = new midi.Output();
const config = require("./config.json"); // use to update 
const { host, port, version, auth, username, password, midiPortNum } = config;
const midiPort = parseInt(midiPortNum); // run "node midiPorts.js" in terminal to determine correct port number

const bot = mineflayer.createBot({
  host: host,
  port: port,
  version: version,
  username: username, // you can change via config.json. Command block messages need to match user name!! See README.md
  // password: password, // uncomment for use on server
  // auth: auth, // uncomment for use on server.
});

bot.once('spawn', () => {
  console.log('MIDIbot has spawned in the world!');
});

bot.on('chat', (username, message) => { // listens to chat and forwards the messages to handleString function
  handleString(message); // Call the handleString function with the message
});

function handleString(message) { // forwards message to appropriate function
  const firstWord = message.split(" ")[0];

  if (firstWord === 'duration') {
    handleDuration(message);
  } else if (firstWord === 'on') {
    handleOn(message);
  } else if (firstWord === 'off') {
    handleOff(message);
  } else if (firstWord === 'ccRamp') {
    handleCCRamp(message);
  } else if (firstWord === 'panic') {
    handleMidiPanic(message);  
  } else {
    console.log("No matching function found for the given message.");
  }
}

function handleDuration(message) { // breaks up message into parts for specified duration
  const parts = message.split(" ");
  const rawChannel = parts[1];
  const note = parts[2];
  const velocity = parts[3];
  const duration = parts[4];
  const noteOnChannel = parseInt(rawChannel) + 143;
  const noteOffChannel = parseInt(rawChannel) + 127;
  sendNoteDuration(noteOnChannel, noteOffChannel, note, velocity, duration);
}

function sendNoteDuration(noteOnChannel, noteOffChannel, note, velocity, duration) { // creates notes of specified duration
  output.sendMessage([noteOnChannel, parseInt(note), parseInt(velocity)]);
  setTimeout(() => {
    output.sendMessage([noteOffChannel, parseInt(note), 0]);
  }, duration);
}

function handleOn(message) { // breaks up message into parts for note on messages
  const parts = message.split(" ");
  const rawChannel = parts[1];
  const note = parts[2];
  const velocity = parts[3];
  const duration = parts[4];
  const noteOnChannel = parseInt(rawChannel) + 143;
  sendNoteOn(noteOnChannel, note, velocity);
}

function sendNoteOn(noteOnChannel, note, velocity) { // creates note on MIDI messages
  output.sendMessage([noteOnChannel, parseInt(note), parseInt(velocity)]);
}

function handleOff(message) { // breaks up message into parts for note off messages
  const parts = message.split(" ");
  const rawChannel = parts[1];
  const note = parts[2];
  const velocity = parts[3];
  const duration = parts[4];
  const noteOffChannel = parseInt(rawChannel) + 127;
  sendNoteOff(noteOffChannel, note, velocity);
}

function sendNoteOff(noteOffChannel, note, velocity) { // creates note on MIDI messages
  output.sendMessage([noteOffChannel, parseInt(note), parseInt(velocity)]);
}

function handleCCRamp(message) { // breaks up message into parts for CC Ramp messages
  const parts = message.split(" ");
  const channel = parseInt(parts[1]);
  const cc = parseInt(parts[2]);
  const start = parseInt(parts[3]);
  const end = parseInt(parts[4]);
  const duration = parseInt(parts[5]);
  numberRamp(channel, cc, start, end, duration);
}

function numberRamp(channel, cc, start, end, duration) { // generates data ramp for CC messages
  var current = start;
  var range = end - start;
  var increment = range / (duration / 10); // Divide by 10 to create smooth increments

  var interval = setInterval(function() {
    current += increment;

    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      clearInterval(interval);
      current = end;
    }

    sendCC(channel, cc, current); // Send CC message with the current value
  }, 10);
}

function sendCC(channel, cc, value) { // Creates the MIDI CC messages
  output.sendMessage([0xB0 + channel, cc, value]);
  console.log(channel, cc, value);
}

function handleMidiPanic(message) {
  // console.log(message);
  const parts = message.split(" ");
  const channel = parseInt(parts[1]);
  midiPanic(channel);
}

function midiPanic(channel) {
  const allNotesOffCC = 123;
  // console.log(channel) ;
  output.sendMessage([0xB0 + channel - 1, 123, 0]); // no idea why I need to subtract 1 from the channel
}

bot.on('error', (err) => {
  console.log('An error occurred:', err);
});

// Open and close the MIDI output port
output.openPort(midiPort);

// Gracefully close the MIDI output port when the script is terminated
process.on('exit', () => {
  output.closePort();
});
