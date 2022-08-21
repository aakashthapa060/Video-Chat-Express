const express =require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const {v4: uuidV4} = require("uuid");


app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req,res) => {
	res.redirect(`/${uuidV4()}`)
})


app.get("/:room", (req,res) => {
	res.render('room', {roomId: req.params.room});
})


io.on("connection", (socket) => {
	socket.on("join-room", (roomId, userId) => {
		console.log(roomId, userId);

	    socket.join(roomId)
	    socket.to(roomId).emit("user-connected", userId)

	    socket.on("disconnet", () => {
	    	socket.to(roomId).emit("user-disconnected",userId)
	    })
	})
})




const port = 3000 || 8000;
server.listen(port, () => {
	console.log(`PORT: ${port}`);
})