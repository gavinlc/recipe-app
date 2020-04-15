import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import { Ingredient } from '../../shared/ingredient.model';

export interface State {
  recipes: Recipe[];
}

const initialState = {
  recipes: []
};

// const initialState = {
//   recipes: [
//     new Recipe(
//     'Fat loss Breakfast', 'no carb should be standard every morning if you haven\'t yet trained',
//     'https://iamafoodblog.com/wp-content/uploads/2019/02/full-english-7355w.jpg',
//     [
//       new Ingredient('Quality Sausages', 2),
//       new Ingredient('Eggs', 4),
//       new Ingredient('Asparagus', 1),
//       new Ingredient('Mushrooms', 4),
//       new Ingredient('Feta Cheese', 1)
//     ]),
//     new Recipe(
//     'Sausage Casserole',
//     'Almost like a casoulet, but not.',
//     'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--901576_11.jpg?itok=tApY0_p0',
//     [
//       new Ingredient('Red Onion', 2),
//       new Ingredient('Red Chilli', 1),
//       new Ingredient('Plum Tomatoes (tins)', 3),
//       new Ingredient('Cannellini Beans (tins)', 1),
//       new Ingredient('Sage Leaves', 8),
//       new Ingredient('Sausages', 18),
//     ]),
//   ]
// };

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      const updateRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      };
      const updateRecipes = [...state.recipes];
      updateRecipes[action.payload.index] = updateRecipe;
      return {
        ...state,
        recipes: updateRecipes
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      };

    default:
      return state;
  }
}
