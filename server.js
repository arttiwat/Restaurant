const express = require('express'); // การใช้งาน express
const dotenv = require('dotenv');  // require dontenv
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const restaurants = require('./routes/restaurants');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

dotenv.config({path:'./config/config.env'});


connectDB();
const app =express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/restaurants',restaurants);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log('Server running in', process.env.MODE_ENV, 'mode on port', PORT));

//Handle Unhandle promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & Exit process
    server.close(()=>process.exit(1));
});