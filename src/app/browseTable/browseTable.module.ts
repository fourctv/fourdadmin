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
import { FourDInterface } from '../js44D/js44D/JSFourDInterface';
import { FourDModel } from '../js44D/js44D/JSFourDModel';
import { FourDCollection } from '../js44D/js44D/JSFourDCollection';

// feature modules
import { JS44DModule } from '../js44D/js44D.module';
import { ModalModule } from '../js44D/modal.module';

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
  entryComponents: [ BrowseFormDialog, BrowseTableComponent, BrowseFieldDialog ]
})
export class BrowseTableModule { }
