import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedListsPageRoutingModule } from './saved-lists-routing.module';

import { SavedListsPage } from './saved-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedListsPageRoutingModule
  ],
  declarations: [SavedListsPage]
})
export class SavedListsPageModule {}
