const dotenv = require('dotenv');
const http = require('http');

const connectDB = require('./db/index');
const { app } = require('./app');

dotenv.config({
  path: './.env'
})

connectDB().then(() => {
  app.on("error", (error) => {
    console.error("ERROR: ", error);
    throw error;
  });

  app.listen(process.env.PORT || 8000, () => {
    console.log('⚙ Server is running at port:', process.env.PORT);
  })
}).catch((error) => {
  console.error("Mongodb connection failed: ", error);
})