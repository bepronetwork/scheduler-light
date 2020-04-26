const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
import { DatabaseSingleton } from "./src/core/mongo";

app.get('/', function (req, res) {
  res.send('Success!!!');
});

app.listen(PORT, async () => {
  await DatabaseSingleton.start();
  require("./src/core/agenda.js").AgendaSingleton.start();
});
