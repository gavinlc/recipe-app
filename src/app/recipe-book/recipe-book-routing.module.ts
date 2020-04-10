import { NgModule } from '@angular/core';
import { RecipeBookComponent } from './recipe-book.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeWelcomeComponent } from './recipe-welcome/recipe-welcome.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RecipeBookComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: RecipeWelcomeComponent},
      {path: 'new', component: RecipeEditComponent},
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService]
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RecipeBookRoutingModule {


}
