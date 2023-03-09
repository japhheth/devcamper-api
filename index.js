const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//Load env variables
dotenv.config();

// Load Routes
const bootcamps = require("./router/bootcamps");

//connect database
connectDB();

const app = express();

app.use(express.json());

// Middleware
if (process.env.NODE_ENV === "development") app.use(morgan("combined"));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server is listening in envrioment ${process.env.NODE_ENV} on port: ${PORT}`
      .yellow.bold
  )
);

//Handle rejection errors
process.on("unhandledRejection", (err, promise) => {
  console.log(`Reason: ${err.message}`);

  //Close the app
  server.close(() => process.exit(1));
});
