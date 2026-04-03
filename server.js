/**
 * PROJECT: Midland G9 Pro PTT Backend
 * AUTHOR: Tomasz Rzepka (White Hill)
 */

const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log("-----------------------------------------");
console.log("  MIDLAND PTT CLOUD SERVER STARTING...   ");
console.log("  Listening on port: 3000                ");
console.log("-----------------------------------------");

const activeUsers = new Set();

io.on("connection", (socket) => {
  activeUsers.add(socket.id);
  console.log(`[+] New Unit Online: ${socket.id} (Total: ${activeUsers.size})`);

  socket.on("sendAudio", (data) => {
    console.log(`[TX] Broadcasting on CH: ${data.channel} from ${socket.id}`);
    socket.broadcast.emit("receiveAudio", data.audioUri);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    console.log(`[-] Unit Offline: ${socket.id} (Total: ${activeUsers.size})`);
  });
});