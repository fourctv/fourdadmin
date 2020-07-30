import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';
// feature modules
import { FourDModule, JS44DModule, ModalModule } from 'js44d';
import { AdminGroupsEditDialog } from './admin-groups-edit.dialog';
import { AdminUserManagerComponent } from './admin-user-manager.component';
import { AdminUserDialog } from './admin-users-dialog.component';
import { AdminUsersEditDialog } from './admin-users-edit.dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



export const AdminUserManagerRoutes: Routes = [
    {
        path: '',
        component: AdminUserDialog
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule.forChild(AdminUserManagerRoutes),
        MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,
        FourDModule, JS44DModule, ModalModule
    ],
    declarations: [AdminUserDialog, AdminUserManagerComponent, AdminGroupsEditDialog, AdminUsersEditDialog],
    entryComponents: [AdminUserManagerComponent, AdminGroupsEditDialog, AdminUsersEditDialog],

})
export class AdminUserManagerModule { }
