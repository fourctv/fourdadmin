// angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// app
import { FourDAdminComponent } from './fourDAdmin/fourDAdmin.component';
import { routes } from './fourDAdmin/fourDAdmin.component';

// applets
import { BlankPage } from './fourDAdmin/blankPage';
import { LoginComponent } from './login/login.component';

// feature modules
import { FourDModule, JS44DModule, ModalModule } from 'js44d';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

const routerModule = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });



@NgModule({
    imports: [
        BrowserModule, BrowserAnimationsModule,
        FormsModule, ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        routerModule,
        MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,
        FourDModule, JS44DModule, ModalModule
    ],
    declarations: [FourDAdminComponent, BlankPage, LoginComponent
    ],
    exports: [FourDModule, JS44DModule, ModalModule],
    entryComponents: [LoginComponent],
    bootstrap: [FourDAdminComponent]
})

export class WebModule { }
