import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ShoppingListService {

  // ingredientsUpdated = new EventEmitter();
  ingredientsUpdated = new Subject();
  startedEditing = new Subject<number>();

  // manage list
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient( 'Pears', 12)
  ];
  // add ingredient

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsUpdated.next();
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsUpdated.next();
  }

  addIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsUpdated.next();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push( ...ingredients );
    this.ingredientsUpdated.next();
  }
}
