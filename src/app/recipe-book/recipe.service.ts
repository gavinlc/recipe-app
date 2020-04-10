import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class RecipeService {

  // private recipes: Recipe[] = [
  //   new Recipe('Fat loss Breakfast', 'no carb should be standard every morning if you haven\'t yet trained', 'https://iamafoodblog.com/wp-content/uploads/2019/02/full-english-7355w.jpg', [
  //     new Ingredient('Quality Sausages', 2),
  //     new Ingredient('Eggs', 4),
  //     new Ingredient('Asparagus', 1),
  //     new Ingredient('Mushrooms', 4),
  //     new Ingredient('Feta Cheese', 1)
  //   ]),
  //   new Recipe('Sausage Casserole', 'Almost like a casoulet, but not.', 'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--901576_11.jpg?itok=tApY0_p0', [
  //     new Ingredient('Red Onion', 2),
  //     new Ingredient('Red Chilli', 1),
  //     new Ingredient('Plum Tomatoes (tins)', 3),
  //     new Ingredient('Cannellini Beans (tins)', 1),
  //     new Ingredient('Sage Leaves', 8),
  //     new Ingredient('Sausages', 18),
  //   ]),
  // ];

  recipes: Recipe[] = [];

  recipesUpdated = new Subject();

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesUpdated.next();
  }

  addRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesUpdated.next();
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesUpdated.next();
  }

  deleteRecipe(index: number) {
    console.log('RecipeService: deleteRecipe: index: ', index);
    this.recipes.splice(index, 1);
    this.recipesUpdated.next();
  }

  addIngredientsToList( ingredients: Ingredient[] ) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
