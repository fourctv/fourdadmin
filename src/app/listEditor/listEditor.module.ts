import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { ListEditorDialog } from './listEditorDialog.component';
import { ListEditorComponent } from './listEditor.component';


// feature modules
import { FourDModule } from 'js44d';
import { JS44DModule } from 'js44d';
import { ModalModule } from 'js44d';

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
    FourDModule, JS44DModule, ModalModule
  ],
  declarations: [ListEditorDialog, ListEditorComponent],
  entryComponents: [ListEditorComponent],

})
export class ListEditorModule { }
