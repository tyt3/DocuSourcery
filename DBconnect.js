let mongoose = require('mongoose');

let mongoDB =  ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoDB, {
            
          });
      
          console.log('MongoDB connected: ${conn.connection.host}');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = { connectDB };
