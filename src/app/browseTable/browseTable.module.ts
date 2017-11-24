import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { BrowseTableDialog } from './browseTableDialog.component';
import { BrowseTableComponent } from './browseTable.component';
import { BrowseQueryBand } from './browseQuery.component';
import { BrowseQueryField } from './browseQueryField.component';
import { BrowseInputField } from './browseInputField.component';
import { BrowseFormDialog } from './browseFormDialog.component';
import { BrowseFieldDialog } from './browseFieldDialog.component';


// libs
import { FourDInterface, FourDModel, FourDCollection } from 'js44d';

// feature modules
import { JS44DModule } from 'js44d';
import { ModalModule } from 'js44d';

export const BrowseRoutes: Routes = [
  {
    path: '',
    component: BrowseTableDialog
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(BrowseRoutes),
    JS44DModule, ModalModule
  ],
  declarations: [BrowseTableDialog, BrowseTableComponent, BrowseQueryBand, BrowseQueryField,
    BrowseFormDialog, BrowseInputField, BrowseFieldDialog],
  providers: [
    FourDInterface, FourDModel, FourDCollection
  ],
  entryComponents: [BrowseFormDialog, BrowseTableComponent, BrowseFieldDialog]
})
export class BrowseTableModule { }
