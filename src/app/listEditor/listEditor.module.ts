import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { ListEditorDialog } from './listEditorDialog.component';
import { ListEditorComponent } from './listEditor.component';


// libs
import { FourDInterface } from '../js44D/js44D/JSFourDInterface';

// feature modules
import { JS44DModule } from '../js44D/js44D.module';
import { ModalModule } from '../js44D/modal.module';

export const ListEditorRoutes: Routes = [
    {
        path: '',
        component: ListEditorDialog
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ListEditorRoutes),
    JS44DModule, ModalModule
  ],
  declarations: [ListEditorDialog, ListEditorComponent],
  providers: [
    FourDInterface, 
  ],
  entryComponents: [ ListEditorComponent ],

})
export class ListEditorModule { }
