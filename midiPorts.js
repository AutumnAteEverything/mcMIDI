const midi = require('midi');

const output = new midi.Output();

// List available MIDI ports
for (let i = 0; i < output.getPortCount(); i++) {
  console.log(`MIDI Port ${i}: ${output.getPortName(i)}`);
}

output.closePort();
