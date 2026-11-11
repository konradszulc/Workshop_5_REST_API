const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const pagesRouter = require('./routes/pages');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

//Async funciton to connect to MongoDB using Mongoose 
async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not found in .env file');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'Blog'
    });

    console.log('Connected to MongoDB: Blog');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;

  }
}

  app.locals.publicDir = publicDir;
  app.use(express.json());
  app.use(express.static(publicDir));

  // TODO: Complete the page routes in routes/pages.js. (completed)
  app.use('/', pagesRouter);

  // TODO: Complete the API routes in routes/posts.js. (completed)
  app.use('/api/posts', postsRouter);

  app.use((req, res) => {
    res.status(404).sendFile(path.join(publicDir, '404.html'));
  });

  app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).sendFile(path.join(publicDir, '500.html'));
  });

  //Starts the server and connects to the database, stops the process if connection fails
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Mounted routers:');
      console.log('  / -> routes/pages.js');
      console.log('  /api/posts -> routes/posts.js');
    });

  })
  .catch(() => {
    process.exit(1); // Exit the process if the database connection fails
  });