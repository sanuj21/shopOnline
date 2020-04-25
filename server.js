const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UnCaught Exception. Shutting down....');
  console.log(err.name, '. ', err.message, ' : ', err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// The reason I am importing this functon after dotenv configuration is bcoz,, i maybe use environment var
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //.connect(process.env.DATABASE_LOCAL)
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 2000;
const server = app.listen(port, () => {
  console.log(`App runnning on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, '. ', err.message);
  console.log('Unhandled Rejection. Shutting down....');
  server.close(() => {
    process.exit(1);
  });
});
