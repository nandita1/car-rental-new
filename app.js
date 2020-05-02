const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//const expressValidator = require("express-validator");
require("dotenv").config();

//import routes
const authRoutes = require("./routes/auth")
const carRoutes = require("./routes/car")
const bookingRoutes = require("./routes/booking")
//app
const app = express();

//db
mongoose
    .connect('mongodb+srv://nandita:nandita@cluster0-i9csd.mongodb.net/whitePanda_task?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("DB connected");
    });

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//app.use(expressValidator());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", carRoutes);
app.use("/api", bookingRoutes);
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});
