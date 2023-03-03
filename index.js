var fs = require('fs');
var https = require('https');
const app = require("express")();
var privateKey  = fs.readFileSync('../private.key', 'utf8');
var certificate = fs.readFileSync('../primary.crt', 'utf8');
const cluster=require("cluster");
// const io_redis = require('socket.io-redis');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
// const numCPUs = require("os").cpus().length;
const bodyParser=require("body-parser");

// =====REDIS===================================
// const Redis = require('redis');
// const client = Redis.createClient({
//     // url: 'redis://redis:6380',
//     host: '127.0.0.1',
//     port: 6380,
//     password: ''
// });
// client.connect('connect', function() {
//     console.log('Connected to Redis');
// });

// client.set('mykey', 'myvalue', Redis.print);

// client.get('mykey', function(error, result) {
//     if (error) {
//         console.log("ERROR= "+error);
//         throw error;
//     }
//     console.log('GET result ->' + result);
// });
// ================================================

const cors = require("cors");

const io = require("socket.io")(httpsServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Running');
});
let Step_Count
app.get('/StepCount', (req, res) => {
	const value = req.query.data;
	Step_Count=value;
	res.send(`StepCount_Node_value= ${value}`);
	console.log(`Received_Node_value: ${value}`);
	console.log(`Step_Count_Node_value: ${Step_Count}`);
	// res.status(200).send('Value received');
});

io.on("connection", (socket) => {
	socket.emit('me',socket.id);
	

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name, Step_Count }) => {
		console.log("callUser"+userToCall+" SignalData:-"+signalData+" from:-"+from+" name:-"+name)
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		console.log("data:-"+data +" data.signal:-"+data.signal)
		io.to(data.to).emit("callAccepted", data.signal)
	});

	
	


// =========Start Socket=====================================================
	socket.on("socketId",(id)=>{
		// socket.broadcast.emit('socketId',id)
		io.to(id).emit(socket.id);
		console.log("Socket:- "+ socket.id)
	});

let Rec_id_check=[];
let Rec_id_Doctor=[];
	socket.on("Rec_socketId",({Rec_id,Value})=>{
		// socket.broadcast.emit('socketId',id)
		io.to(Rec_id).emit('rec_message', {caller_id:socket.id, Val:Value});
		Rec_id_check=socket.id;
		Rec_id_Doctor=Rec_id;

		console.log("Mecheck ",Rec_id +" Me:- "+ Rec_id_check+" Value:- "+ Value)
	});
// =========End Socket=====================================================



// =========Start ZOOM=====================================================
	// socket.on("send_message",({mecheck,Value})=>{
	// 	// socket.broadcast.emit('rec_message',Value)
	// 	io.to(mecheck).emit("rec_message",Value);
	// 	console.log("MeCheck= "+mecheck +" Value= "+ Value)
	// });
	// socket.on("rec_message",(rec_data2)=>{
	// 	// socket.broadcast.emit('socketId',id)
	// 	io.to(Rec_id).emit(rec_data2);
	// 	console.log("message ",rec_data2 +"sender_Socketmsg:- "+ socket.id+"Rec_Socketmsg:- "+ Rec_id)
	// });
// =========Start ZOOM=====================================================


	socket.on("Step_count_Id",({Doc_id})=>{
		io.to(Doc_id).emit('Step_count_value_rec', {scount:Step_Count});
	})
	// socket.emit('step_count',Step_Count);

});
	httpsServer.listen(5000, () => console.log(`Server is running on port 5000`));
	console.log(`Worker ${process.pid} started in last`);


























// =======================================================================Step_count_received============================================
// const app = require("express")();
// const server = require("http").createServer(app);
// const cors = require("cors");
// const bodyParser=require("body-parser");

// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "*",
// 		methods: [ "GET", "POST" ]
// 	}
// });

// app.use(cors());
// app.use(bodyParser.json());
// const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
// 	res.send('Running');
// });
// let Step_Count
// app.get('/StepCount', (req, res) => {
// 	const value = req.query.data;
// 	Step_Count=value;
// 	res.send(`StepCount_Node_Value= ${value}`);
// 	console.log(`Received_Node_value: ${value}`);
// 	console.log(`Step_Count_Node_value: ${Step_Count}`);
// 	// res.status(200).send('Value received');
// });
// // if (cluster.isPrimary) {
// // 	console.log(`Primary ${process.pid} is running`);
  
// // 	// Fork workers.
// // 	for (let i = 0; i < numCPUs; i++) {
// // 	  cluster.fork();
// // 	}

// console.log("Step_Count= "+Step_Count)

// io.on("connection", (socket) => {
// 	socket.emit('me',socket.id);
// 	socket.emit('step_count',Step_Count);

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});

// 	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 		console.log("callUser"+userToCall+" SignalData:-"+signalData+" from:-"+from+" name:-"+name)
// 		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 	});

// 	socket.on("answerCall", (data) => {
// 		console.log("data:-"+data +" data.signal:-"+data.signal)
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	});


// // =========Start Socket=====================================================
// 	socket.on("socketId",(id)=>{
// 		// socket.broadcast.emit('socketId',id)
// 		io.to(id).emit(socket.id);
// 		console.log("Socket:- "+ socket.id)
// 	});

// let Rec_id_check=[];
// 	socket.on("Rec_socketId",({Rec_id,Value})=>{
// 		// socket.broadcast.emit('socketId',id)
// 		io.to(Rec_id).emit('rec_message', {caller_id:socket.id, Val:Value});
// 		Rec_id_check=socket.id;
// 		console.log("Mecheck ",Rec_id +" Me:- "+ Rec_id_check+" Value:- "+ Value)
// 	});
// // =========End Socket=====================================================


// // =========Start ZOOM=====================================================
// 	// socket.on("send_message",({mecheck,Value})=>{
// 	// 	// socket.broadcast.emit('rec_message',Value)
// 	// 	io.to(mecheck).emit("rec_message",Value);
// 	// 	console.log("MeCheck= "+mecheck +" Value= "+ Value)
// 	// });
// 	// socket.on("rec_message",(rec_data2)=>{
// 	// 	// socket.broadcast.emit('socketId',id)
// 	// 	io.to(Rec_id).emit(rec_data2);
// 	// 	console.log("message ",rec_data2 +"sender_Socketmsg:- "+ socket.id+"Rec_Socketmsg:- "+ Rec_id)
// 	// });
// // =========Start ZOOM=====================================================
// 	});

// // cluster.on('exit', (worker, code, signal) => {
// //     console.log(`worker ${worker.process.pid} died`);
// //   });
// // }
// // httpsServer.listen(5000, () => console.log(`Server is running on port 5000`));
// // else{
// // 	io.adapter(io_redis({ host: '127.0.0.1', port: 6380 }));

// 	io.on("connection", (socket) => {

// 	// =============================?
// 	// client.set('key', 'value',  Redis.print);
// 	// client.get('key', (err, value) => {
// 	//   console.log("Redis_value= "+value);
// 	// });

// 	// =============================?

// 	socket.emit('me',socket.id);

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});

// 	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 		console.log("callUser"+userToCall+" SignalData:-"+signalData+" from:-"+from+" name:-"+name)
// 		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 	});

// 	socket.on("answerCall", (data) => {
// 		console.log("data:-"+data +" data.signal:-"+data.signal)
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	});


// // =========Start Socket=====================================================
// 	socket.on("socketId",(id)=>{
// 		// socket.broadcast.emit('socketId',id)
// 		io.to(id).emit(socket.id);
// 		console.log("Socket:- "+ socket.id)
// 	});

// let Rec_id_check=[];
// 	socket.on("Rec_socketId",({Rec_id,Value})=>{
// 		// socket.broadcast.emit('socketId',id)
// 		io.to(Rec_id).emit('rec_message', {caller_id:socket.id, Val:Value});
// 		Rec_id_check=socket.id;
// 		console.log("Mecheck ",Rec_id +" Me:- "+ Rec_id_check+" Value:- "+ Value)
// 	});
// // =========End Socket=====================================================


// // =========Start ZOOM=====================================================
// 	// socket.on("send_message",({mecheck,Value})=>{
// 	// 	// socket.broadcast.emit('rec_message',Value)
// 	// 	io.to(mecheck).emit("rec_message",Value);
// 	// 	console.log("MeCheck= "+mecheck +" Value= "+ Value)
// 	// });
// 	// socket.on("rec_message",(rec_data2)=>{
// 	// 	// socket.broadcast.emit('socketId',id)
// 	// 	io.to(Rec_id).emit(rec_data2);
// 	// 	console.log("message ",rec_data2 +"sender_Socketmsg:- "+ socket.id+"Rec_Socketmsg:- "+ Rec_id)
// 	// });
// // =========Start ZOOM=====================================================
// 	});
// 	server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// // }
