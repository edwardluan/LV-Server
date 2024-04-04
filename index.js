const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const SocketServer = require("./socketSever");
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const postRoute = require("./src/routes/postRoute");
const commentRoute = require("./src/routes/commentRoute");
const notifyRoute = require("./src/routes/notifyRoute");
const messageRoute = require("./src/routes/messageRoute");
const searchRoute = require("./src/routes/searchRoute");
const diaryRoute = require("./src/routes/diaryRoute");
const productRoute = require("./src/routes/productRoute");
const reportRoute = require("./src/routes/reportRoute");

const config = require("./src/configs");

const PORT = config.app.port;
const MONGO_URL = config.db.uri;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  SocketServer(socket)
});

//route
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/notify", notifyRoute);
app.use("/message", messageRoute);
app.use("/search", searchRoute);
app.use("/diary", diaryRoute);
app.use("/market", productRoute);
app.use("/report", reportRoute);

//database connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to database!"))
  .catch((err) => console.error(err));

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to Home repair");
});
