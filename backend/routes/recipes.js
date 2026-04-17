const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// GET /api/recipes - List all recipes with pagination and optional search
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .populate('author', 'id name email createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments(filter)
    ]);

    res.json({ recipes, total, page });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recipes/:id - Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'id name email createdAt');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ recipe });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recipes - Create recipe (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, ingredients, instructions, difficulty, prepTime, cookTime, servings, imageUrl } = req.body;

    if (!title || !description || !ingredients || !instructions || !difficulty || !prepTime || !cookTime || !servings) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      difficulty,
      prepTime,
      cookTime,
      servings,
      imageUrl: imageUrl || '',
      author: req.user.id
    });

    await recipe.save();
    await recipe.populate('author', 'id name email createdAt');

    res.status(201).json({ recipe });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/recipes/:id - Update own recipe (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { title, description, ingredients, instructions, difficulty, prepTime, cookTime, servings, imageUrl } = req.body;

    if (title !== undefined) recipe.title = title;
    if (description !== undefined) recipe.description = description;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (instructions !== undefined) recipe.instructions = instructions;
    if (difficulty !== undefined) recipe.difficulty = difficulty;
    if (prepTime !== undefined) recipe.prepTime = prepTime;
    if (cookTime !== undefined) recipe.cookTime = cookTime;
    if (servings !== undefined) recipe.servings = servings;
    if (imageUrl !== undefined) recipe.imageUrl = imageUrl;

    await recipe.save();
    await recipe.populate('author', 'id name email createdAt');

    res.json({ recipe });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/recipes/:id - Delete own recipe (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ success: true });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
