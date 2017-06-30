// angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule }      from '@angular/common';
import { HttpModule }      from '@angular/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// libs
import { FourDInterface } from './js44D/js44D/JSFourDInterface';
import { FourDModel } from './js44D/js44D/JSFourDModel';
import { FourDCollection } from './js44D/js44D/JSFourDCollection';

// app
import { FourDAdminComponent } from './fourDAdmin/fourDAdmin.component';
import { routes } from './fourDAdmin/fourDAdmin.component';

// applets
import { BlankPage } from './fourDAdmin/blankPage';
import { LoginComponent  } from './login/login.component';

// feature modules
import { JS44DModule } from './js44D/js44D.module';
import { ModalModule } from './js44D/modal.module';

let routerModule = RouterModule.forRoot(routes);



@NgModule({
  imports: [
    BrowserModule,  
    FormsModule,
    CommonModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    routerModule,
    JS44DModule, ModalModule
  ],
  declarations: [ FourDAdminComponent, BlankPage, LoginComponent
                ],
  providers: [
    FourDInterface, FourDModel, FourDCollection
  ],
  exports: [JS44DModule, ModalModule ],
  entryComponents: [ LoginComponent ],
  bootstrap: [ FourDAdminComponent ]
})

export class WebModule { }
