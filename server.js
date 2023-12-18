const express = require('express');
const app = express();
const port = 3000;
const ENV = require('./config');
const hostname = "localhost";
const userRoutes = require('./routes/user');
const cors = require('cors');


var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
mongoose.connect(ENV.CONN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(cors({
  origin: ['http://localhost:5173'], 
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", userRoutes)


app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port}`);
});