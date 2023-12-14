const express = require('express');
const app = express();
const port = 3000;
const ENV = require('./config');
const hostname = "localhost";
const userRoutes = require('./routes/user');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect(ENV.CONN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(cors());
app.use(express.json());
app.use("/auth", userRoutes)


app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port}`);
});