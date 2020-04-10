import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipe-book/recipe.service';
import { Recipe } from '../recipe-book/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})

export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {

  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://pepper-recipe-book.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log('DataStorage: storeRecipes: response: ', response);
      });
  }

  getRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://pepper-recipe-book.firebaseio.com/recipes.json',
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          console.log('DataStorage: getRecipes: tapped recipes: ', recipes);
          this.recipeService.addRecipes(recipes);
        })
      );
  }


}
