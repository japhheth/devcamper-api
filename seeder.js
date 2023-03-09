const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load env
dotenv.config();

//Load models
const Bootcamp = require("./models/Bootcamp");

//connect db
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI).then((conn) => {
  console.log(
    `db connected at host ${conn.connection.host}`.cyan.underline.bold
  );
});

//Load file path
const bootcamp = fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8");

//import db
const importData = async () => {
  try {
    await Bootcamp.create(JSON.parse(bootcamp));

    console.log("Data created....".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
