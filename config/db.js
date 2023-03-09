const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI).then((conn) => {
    console.log(
      `db connected at host ${conn.connection.host}`.cyan.underline.bold
    );
  });
};

module.exports = connectDB;
