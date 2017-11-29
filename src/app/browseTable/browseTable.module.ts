import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { BrowseTableDialog } from './browseTableDialog.component';
import { BrowseTableComponent } from './browseTable.component';
import { BrowseQueryBand } from './browseQuery.component';
import { BrowseQueryField } from './browseQueryField.component';
import { BrowseInputField } from './browseInputField.component';
import { BrowseFormDialog } from './browseFormDialog.component';
import { BrowseFieldDialog } from './browseFieldDialog.component';


// feature modules
import { fourDModule } from 'js44d';
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
    HttpClientModule,
    RouterModule.forChild(BrowseRoutes),
    fourDModule, JS44DModule, ModalModule
  ],
  providers: [HttpClient],
  declarations: [BrowseTableDialog, BrowseTableComponent, BrowseQueryBand, BrowseQueryField,
    BrowseFormDialog, BrowseInputField, BrowseFieldDialog],
  entryComponents: [BrowseFormDialog, BrowseTableComponent, BrowseFieldDialog]
})
export class BrowseTableModule { }
