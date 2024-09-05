const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Post = require('./post');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Comment.belongsTo(Post); // Establishes relationship
Post.hasMany(Comment);

module.exports = Comment;
