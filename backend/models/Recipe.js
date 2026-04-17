const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one ingredient is required'
      }
    },
    instructions: {
      type: [String],
      required: [true, 'Instructions are required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one instruction step is required'
      }
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['easy', 'medium', 'hard']
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative']
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative']
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
