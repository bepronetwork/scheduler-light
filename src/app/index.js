const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
import { DatabaseSingleton } from "../core/mongo";

app.get('/', function (req, res) {
  res.send('Success!!!');
});

app.listen(PORT, async () => {
  console.log(`express  port ${PORT}`);
  await DatabaseSingleton.start();
  require("../core/agenda.js").AgendaSingleton.start();
});
