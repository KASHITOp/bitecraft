import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Recipe } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the 1,060+ rich multi-cuisine recipes dataset
const jsonPath = path.join(__dirname, 'recipes_1000.json');
let loadedRecipes: Recipe[] = [];

try {
  if (fs.existsSync(jsonPath)) {
    loadedRecipes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
} catch (err) {
  console.error('Failed to load recipes_1000.json, falling back to empty array', err);
}

export const RECIPES_DATA: Recipe[] = loadedRecipes;
