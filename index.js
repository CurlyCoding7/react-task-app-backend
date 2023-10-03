require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const app = express();
const corsOptions = {
  origin: true, //included origin as true
  credentials: true //included credentials as true
};

app.use(cors(corsOptions));

const mongo_uri = process.env.MONGO_URI;

mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log("Connected to db...");
  })
  .catch((err) => {
    console.log(err);
  });

const taskSchema = new Schema({
  task: String // String is shorthand for {type: String}
});

const Task = mongoose.model("Task", taskSchema);

const port = process.env.PORT || 8800;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.json());

app.get("/api/", async (req, res) => {
  const data = await Task.find();
  res.send(data);
});

app.post("/api/add", async (req, res) => {
  const { task } = req.body;
  const newTask = new Task({
    task
  });

  const data = await newTask.save();
  res.send(data);
});

app.post("/api/update", async (req, res) => {
  const { id, text } = req.body;
  const data = await Task.findByIdAndUpdate(
    id,
    { $set: { task: text } },
    { new: true }
  );
  res.send(data);
});

app.post("/api/delete", async (req, res) => {
  const { id } = req.body;
  const data = await Task.findByIdAndDelete(id);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server is listening at port: ${port}...`);
});
