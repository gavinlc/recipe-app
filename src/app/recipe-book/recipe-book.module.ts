import { NgModule } from '@angular/core';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeWelcomeComponent } from './recipe-welcome/recipe-welcome.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeBookComponent } from './recipe-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeBookRoutingModule } from './recipe-book-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RecipeBookComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeWelcomeComponent,
    RecipeEditComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RecipeBookRoutingModule,
  ]
})
export class RecipeBookModule {

}
