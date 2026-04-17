const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// GET /api/recipes
router.get('/', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .populate('author', 'id name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Recipe.countDocuments(query)
    ]);

    res.json({ recipes, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'id name email');
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, ingredients, instructions, difficulty, prepTime, cookTime, servings, imageUrl } = req.body;
    const recipe = await Recipe.create({
      title, description, ingredients, instructions, difficulty, prepTime, cookTime, servings, imageUrl,
      author: req.user._id
    });
    await recipe.populate('author', 'id name email');
    res.status(201).json({ recipe });
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipes/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this recipe' });
    }

    const { title, description, ingredients, instructions, difficulty, prepTime, cookTime, servings, imageUrl } = req.body;
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, description, ingredients, instructions, difficulty, prepTime, cookTime, servings, imageUrl },
      { new: true, runValidators: true }
    ).populate('author', 'id name email');

    res.json({ recipe: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this recipe' });
    }
    await recipe.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
