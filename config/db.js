const mongoose = require('mongoose');

// const connectDB = async()=> {
//     mongoose.set('strictQuery',true);
//     const conn = await mongoose.connect(process.env.MONGO_URI,{
//         useNewUrIParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true
//     });
   

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
// }

const connectDB = async()=> {
    mongoose.set('strictQuery',true);
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
   

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;