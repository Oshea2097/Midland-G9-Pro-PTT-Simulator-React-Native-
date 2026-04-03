# Midland G9 Pro PTT Simulator (React Native)

Advanced Midland G9 Pro walkie-talkie simulator built with React Native. The project features an interactive 3D interface (SVG), audio handling (microphone recording, sound effects), and a ready-to-use architecture for network communication (Socket.io).

This is an Expo project created with create-expo-app.

-----

## ⚠️ LEGAL NOTICE AND LICENSE

### 1\. Copyright

Original Project Author: Tomasz Rzepka (White Hill).
All rights to the source code, application logic, and unique SVG design are reserved by the author.

### 2\. Prohibition of Impersonation (Plagiarism)

It is strictly forbidden to impersonate the author of the project, remove author mentions from the source code, or claim authorship of all or part of this software.
Failure to comply with the above will result in criminal and civil liability:

  * Art. 115 of the Act on Copyright and Related Rights (Poland): Whoever usurps the authorship or misleads as to the authorship of all or part of another person's work (...) shall be subject to a fine, the penalty of restriction of liberty or imprisonment for up to 3 years.
  * Art. 286 of the Penal Code (Fraud): In the event of an attempt to achieve financial gain by misleading as to authorship.

### 3\. Terms of Use and Editing

Permission is granted for further development, editing, and sharing of the project ONLY under the following conditions:

  * Maintaining information about the original author (Tomasz Rzepka - White Hill) in a visible place in the code and documentation.
  * Using the project exclusively for NON-COMMERCIAL purposes. Selling the code, application, or using it for profit without the written consent of the author is prohibited.
  * Violation of commercial license provisions will be prosecuted in court.

-----

## 🚀 Get started

### 1\. Install dependencies

npm install

### 2\. Configuration & Assets

The project requires local sound files to function correctly:

1.  Place the click.mp3 file in: assets/sounds/click.mp3.

### 3\. Start the app

npx expo start -c

In the output, you'll find options to open the app in:

  - development build
  - Android emulator
  - iOS simulator
  - Expo Go, a limited sandbox for trying out app development.

You can start developing by editing the files inside the app directory. This project uses file-based routing.


## 🌐 NETWORK CONNECTION (PTT NETWORK)

The project is prepared for real-time communication. To talk to other users:

1.  Run the Backend:
    Configure the server.js file and run it with the command node server.js. The server listens on port 3000 by default.

2.  Configure IP:
    In the app/(tabs)/index.tsx file, find the SERVER\_URL variable and enter the IP address of your server (e.g., locally [http://192.168.1.](https://www.google.com/search?q=http://192.168.1.)XX:3000).

3.  Communication:
    Connect devices to the same network. Set the same channel on the LCD. Press the side PTT button to transmit a voice message.



## 🛠️ Get a fresh project

When you're ready for a clean start, run:

npm run reset-project

This command will move the starter code to the app-example directory and create a blank app directory where you can start developing from scratch.

-----

## 📚 Learn more

To learn more about developing with Expo, check the following resources:

  - Expo documentation: Fundamentals and advanced guides.
  - Learn Expo tutorial: A step-by-step tutorial.

-----

## 🎙️ APPLICATION CODE (index.tsx)

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text, Vibration, Dimensions, StatusBar, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Audio } from 'expo-av';

/\*\*

  * PROJECT: Midland G9 Pro PTT Simulator
  * AUTHOR: Tomasz Rzepka (White Hill)
    \*/

const { width: SCREEN\_WIDTH } = Dimensions.get('window');

export default function MidlandG9ProFinal() {
const [isTalking, setIsTalking] = useState(false);
const [channel, setChannel] = useState('446.006');
const [recording, setRecording] = useState(null);
const [status, setStatus] = useState('PMR READY');

useEffect(() =\> {
(async () =\> {
await Audio.requestPermissionsAsync();
await Audio.setAudioModeAsync({
allowsRecordingIOS: true,
playsInSilentModeIOS: true,
staysActiveInBackground: true,
shouldDuckAndroid: true,
});
})();
}, []);

async function playClick() {
try {
const { sound } = await Audio.Sound.createAsync(
require('../../assets/sounds/click.mp3')
);
await sound.playAsync();
sound.setOnPlaybackStatusUpdate((s) =\> { if (s.didJustFinish) sound.unloadAsync(); });
} catch (e) {
console.warn("Audio file missing in assets/sounds/click.mp3");
}
}

const handlePressIn = async () =\> {
setIsTalking(true);
Vibration.vibrate(50);
playClick();
setStatus("•• TRANSMIT ••");

```
try {
  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  setRecording(recording);
} catch (err) {
  console.error('Failed to start recording', err);
}
```

};

const handlePressOut = async () =\> {
setIsTalking(false);
setStatus("PMR READY");

```
if (!recording) return;
try {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  console.log('Recording stopped. File at:', uri);
  setRecording(null);
} catch (err) {
  console.error('Failed to stop recording', err);
}
```

};

return (
\<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}\>
\<StatusBar hidden /\>
\<View style={styles.radioWrapper}\>
\<Svg height="100%" width="100%" viewBox="0 0 400 800" style={StyleSheet.absoluteFill}\>
\<Defs\>
\<LinearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0"\>
\<Stop offset="0" stopColor="\#050505" /\>
\<Stop offset="0.2" stopColor="\#252525" /\>
\<Stop offset="0.5" stopColor="\#151515" /\>
\<Stop offset="0.8" stopColor="\#252525" /\>
\<Stop offset="1" stopColor="\#050505" /\>
\</LinearGradient\>
\<LinearGradient id="lcdGrad" x1="0" y1="0" x2="0" y2="1"\>
\<Stop offset="0" stopColor="\#76b947" /\>
\<Stop offset="1" stopColor="\#4a6b32" /\>
\</LinearGradient\>
\</Defs\>
\<Path d="M230,150 L235,20 Q245,10 255,20 L260,150 Z" fill="\#151515" /\>
\<Path d="M100,160 Q80,160 75,190 L65,600 Q65,680 140,700 L260,700 Q335,680 335,600 L325,190 Q320,160 300,160 Z" fill="url(\#bodyGrad)" stroke="\#000" strokeWidth="2" /\>
\<Path d="M105,210 Q105,195 140,195 L260,195 Q295,195 295,210 L285,360 Q285,385 200,385 Q115,385 115,360 Z" fill="\#000" /\>
\<Path d="M120,215 Q120,205 145,205 L255,205 Q280,205 280,215 L270,355 Q270,370 200,370 Q130,370 130,355 Z" fill="url(\#lcdGrad)" /\>
{[0, 1, 2, 3, 4].map((i) =\> (
\<Rect key={`g-${i}`} x="120" y={520 + (i \* 18)} width="160" height="4" rx="2" fill="\#000" /\>
))}
\</Svg\>
\<Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.sidePTT, isTalking && styles.sidePTTActive]} /\>
\<View style={styles.uiOverlay} pointerEvents="box-none"\>
\<View style={styles.lcdArea}\>
\<Text style={styles.lcdHeader}\>{status}\</Text\>
\<TextInput style={styles.lcdInput} value={channel} onChangeText={setChannel} keyboardType="numeric" maxLength={8} /\>
\<View style={styles.lcdFooter}\>
\<Text style={styles.lcdSmall}\>POWER HI\</Text\>
\<Text style={styles.lcdSmall}\>AES-256\</Text\>
\</View\>
\</View\>
\<View style={styles.keypad} pointerEvents="box-none"\>
\<View style={styles.row}\>
\<View style={styles.btnSmall}\>\<Text style={styles.btnTxt}\>CALL\</Text\>\</View\>
\<View style={styles.btnSmall}\>\<Text style={styles.btnTxt}\>MENU\</Text\>\</View\>
\<View style={[styles.btnSmall, {backgroundColor: '\#b00'}]}\>\<Text style={[styles.btnTxt, {color: '\#fff'}]}\>EMG\</Text\>\</View\>
\</View\>
\</View\>
\<Text style={styles.brandName}\>MIDLAND G9 PRO\</Text\>
\</View\>
\</View\>
\</KeyboardAvoidingView\>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '\#000', justifyContent: 'center', alignItems: 'center' },
radioWrapper: { width: SCREEN\_WIDTH, height: 800, position: 'relative' },
sidePTT: { position: 'absolute', left: 55, top: 220, width: 25, height: 160, backgroundColor: '\#0a0a0a', borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderLeftWidth: 3, borderColor: '\#333', zIndex: 30 },
sidePTTActive: { backgroundColor: '\#d32f2f', borderColor: '\#ff4444' },
uiOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', zIndex: 10 },
lcdArea: { marginTop: 215, width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
lcdHeader: { fontSize: 10, fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', marginBottom: 5 },
lcdInput: { fontSize: 30, fontWeight: '900', color: '\#1a1a1a', textAlign: 'center', width: '100%', padding: 0 },
lcdFooter: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 5 },
lcdSmall: { fontSize: 9, fontWeight: 'bold', color: 'rgba(0,0,0,0.5)' },
keypad: { marginTop: 65, width: 260 },
row: { flexDirection: 'row', justifyContent: 'center' },
btnSmall: { width: 65, height: 38, backgroundColor: '\#252525', borderRadius: 10, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '\#000' },
btnTxt: { color: '\#666', fontSize: 10, fontWeight: 'bold' },
brandName: { marginTop: 65, color: '\#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2, opacity: 0.8 }
});

-----

### 📡 SERVER CODE (server.js)

/\*\*

  * PROJECT: Midland G9 Pro PTT Backend
  * AUTHOR: Tomasz Rzepka (White Hill)
    \*/

const io = require("socket.io")(3000, {
cors: { origin: "\*", methods: ["GET", "POST"] }
});

console.log("MIDLAND PTT CLOUD SERVER STARTING... Port: 3000");

io.on("connection", (socket) =\> {
console.log(`[+] New Unit Online: ${socket.id}`);

socket.on("sendAudio", (data) =\> {
console.log(`[TX] Broadcasting on CH: ${data.channel}`);
socket.broadcast.emit("receiveAudio", data.audioUri);
});

socket.on("disconnect", () =\> {
console.log(`[-] Unit Offline: ${socket.id}`);
});
});

