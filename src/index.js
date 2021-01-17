require("./models/Member");
require("./models/Project");
require("./models/PushToken");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const keys = require("./config/keys");

const app = express();
app.use(bodyParser.json());

app.use(express.static("public", { extensions: ["html"] }));

const memberRoutes = require("./routes/memberRoutes");
app.use(memberRoutes);
const uploadRoutes = require("./routes/uploadRoutes");
app.use(uploadRoutes);
const authRoutes = require("./routes/authRoutes");
app.use(authRoutes);
const projectRoutes = require("./routes/projectRoutes");
app.use(projectRoutes);
const notificationRoutes = require("./routes/notificationRoutes");
app.use(notificationRoutes);

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to MongoDB");
});
mongoose.connection.on("error", (err) =>
  console.log("Error connecting to mongo", err)
);

// Mongoose connect
const mongooseConnect = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

/// Retry connection
const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  return mongooseConnect();
};

/// Exit application on error
mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err}`);
  setTimeout(connectWithRetry, 5000);
});

// Static routes
app.get("/", (req, res) => {
  res.send("magiqapps!");
});

app.use(function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000);
