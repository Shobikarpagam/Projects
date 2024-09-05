const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./model/db');
const Post = require('./model/post');
const Comment = require('./model/comment');

const app = express();
app.use(bodyParser.json());


sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.log('Error: ' + err);
});

// Create a new post
app.post('/posts', async (req, res) => {
    try {
      const post = await Post.create(req.body);
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Get all posts
  app.get('/posts', async (req, res) => {
    try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Get a single post by ID
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });

    }
  });
  
  // Update a post by ID
  app.put('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (post) {
        await post.update(req.body);
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

  // Delete a post by ID
  app.delete('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (post) {
        await post.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add a comment to a post
app.post('/posts/:postId/comments', async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.postId);
      if (post) {
        const comment = await Comment.create({
          content: req.body.content,
          PostId: req.params.postId,
        });
        res.status(201).json(comment);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Get comments for a post
  app.get('/posts/:postId/comments', async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.postId, {
        include: Comment,
      });
      if (post) {
        res.status(200).json(post.Comments);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Delete a comment by ID
  app.delete('/comments/:id', async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (comment) {
        await comment.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
