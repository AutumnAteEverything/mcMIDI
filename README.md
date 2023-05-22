# mcMIDI
 Send MIDI notes and CC ramps from Minecraft using chat/command blocks.

This script can use Minecraft chat messages to create MIDI note and CC messages
Tested and working on Minecraft Java Edition 1.19.2.
Note: I haven't had any luck installing the MIDI Node Package on Windows. This has unfortunately prevented me from getting this project to work in a Windows environment.
 
Step 1, Install node.js if you haven't already. https://nodejs.org/en 

Step 2, Open your Minecraft world.

Step 3, Open the  Minecraft world to LAN (hit ESC, select "Open to LAN", select "Creative" and "Allow Cheats"). Minecraft will display a port number in the chat.

Step 4, Copy the given port number the 4th line of the config.json file (inside quotations)

Step 5, In Terminal in Mac or cmd.exe in Windows, run midiPorts.js to get a list of MIDI ports connected to your computer.
      
       A: type "cd" (without quotes) and drag the project folder into the command line. Hit enter. 
      
       B: type "npm install" (without quotes) to download dependencies. Hit enter.
       
       C: type "node midiPorts.js" (without quotes) and hit enter This will list all of the MIDI ports on your computer.

Step 6, Copy the desired MIDI port number to the the 8th line of the config.json file (inside quotations)

Step 7, In Terminal/cmd, type "node mcMIDI.js" to run the script. Syntax for chat messages and command blocks below.

----------------

Minecraft Chat syntax (don't include quotes):
-- For note of specified duration: '''duration 5 64 100 2000'''
        will create the MIDI note# 64 on channel 5 with a velocity of 100 and a duration of 2000 ms

-- for note on messages: "on 3 36 80" 
        will create a note on message for the MIDI note# 36 on channel 3 with a velocity of 80.

-- for note off messages: "off 3 36 0"
        will create a note off message for the MIDI note# 36 on channel 3.

-- for MIDI cc ramps: "ccRamp 5 12 0 127 5000"
        will generate a ramp from 0 to 127 over 5000 ms on MIDI cc# 12 on channel 5

Use the following syntax to create MIDI messages with command blocks (note the included chat syntax):
"/execute as @p[name=MIDIbot] at @p run say duration 11 60 100 1000"
Note, the username of your Mineflayer bot needs to match in this command. Replace "MIDIbot" on servers.

<a href="https://studentuml-my.sharepoint.com/:u:/g/personal/ramon_castillo_uml_edu/ETH6QMwhRE9Nrr_e23zhBQcBu7v0h86EtKEBeozfeQfqXQ?e=LijJKb" target="_blank">Download a demo Minecraft world</a> that sends MIDI notes on channels 1 through 5, and a MIDI CC ramp on controller #5 on channel 11. See the video at [placeholder] for details.
