import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedListsPage } from './saved-lists.page';

const routes: Routes = [
  {
    path: '',
    component: SavedListsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedListsPageRoutingModule {}
