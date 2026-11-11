const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
//Creates a new post, CREATE
router.post('/', async (req, res, next) => {
  try {
    const { title, content, author } = req.body || {};
    const post = new Post({ title, content, author });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});
//Returns all posts, READ
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

//Returns a single post by id, READ
router.get('/:id', async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findById(req.params.id);
    // If the post is not found, return a 404 error
    if (!post) {
      return res.status(404).json({ error: 'Post was not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

//Updates a post by id, UPDATE
router.put('/:id', async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findById(req.params.id);
    // If the post is not found, return a 404 error
    if (!post) {
      return res.status(404).json({ error: 'Post was not found' });
    }
    const { title, content, author } = req.body || {};
    post.title = title;
    post.content = content;
    post.author = author;
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }

});
//Deletes a post by id, DELETE
router.delete('/:id', async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    //If the post is not found, return a 404 error
    if (!post) {
      return res.status(404).json({ error: 'Post was not found' });
    }
    return res.status(200).json({ message: 'Post was deleted successfully'});
  } catch (error) {
    next(error);
  }
});

module.exports = router;