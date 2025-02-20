const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'The posts information could not be retrieved',
      });
    });
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist',
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'The post information could not be retrieved',
      });
    });
});

router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: 'Please provide tittle and contents for the post',
    });
  } else {
    Post.insert({ title, contents })
      .then((post) => {
        Post.findById(post.id)
          .then((post) => {
            if (!post) {
              res.status(404).json({
                message: 'The post with the specified ID does not exist',
              });
            } else {
              res.status(201).json(post);
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: 'The post information could not be retrieved',
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: 'There was an error while saving the post to the database',
        });
      });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, contents } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        message: 'The post with the specified ID does not exist',
      });
    } else if (!title || !contents) {
      res.status(400).json({
        message: 'Please provide title and contents for the post',
      });
    } else {
      await Post.update(id, req.body);
      const updatedPost = await Post.findById(id);
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    res.status(500).json({
      message: 'The post information could not be modified',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        message: 'The post with the specified ID does not exist',
      });
    } else {
      await Post.remove(id);
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({
      message: 'The post could not be removed',
    });
  }
});

router.get('/:id/comments', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist',
        });
      } else {
        Post.findPostComments(req.params.id)
          .then((comments) => {
            res.status(200).json(comments);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: 'The comments information could not be retrieved',
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'The post information could not be retrieved',
      });
    });
});

module.exports = router;
