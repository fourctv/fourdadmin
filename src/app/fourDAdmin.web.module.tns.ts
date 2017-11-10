import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from '@angular/core';
import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// nativescript
import { NSModuleFactoryLoader } from 'nativescript-angular/router';
import { NativeScriptHttpModule } from 'nativescript-angular/http';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// plugins
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-pro-ui/dataform/angular";

// libs
import { FourDInterface } from './js44D/js44D/JSFourDInterface';
import { FourDModel } from './js44D/js44D/JSFourDModel';
import { FourDCollection } from './js44D/js44D/JSFourDCollection';

// app
import { Config } from './common/index';
import { FourDAdminComponent } from './fourDAdmin/fourDAdmin.component';

// sidebar
import { SideBarMenu } from './sideBarMenu/sideBarMenu';

// applets
import { BlankPage } from './fourDAdmin/blankPage';
import { LoginComponent  } from './login/login.component';
import { BrowseTableComponent } from './browseTable/browseTable.component';
import { BrowseQueryBand } from './browseTable/browseQuery.component';
import { BrowseFormDialog } from './browseTable/browseFormDialog.component';
import { BrowseFieldDialog } from './browseTable/browseFieldDialog.component';
import { ListEditorComponent } from './listEditor/listEditor.component';

// feature modules
//import { JS44DModule } from './js44D/js44D.module';

Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;

const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'browseTable', component: BrowseTableComponent},
    {path: 'listEditor', component: ListEditorComponent},
    {path: '**',  component: BlankPage}
];

@NgModule({
    bootstrap: [
        FourDAdminComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(<any>routes),
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule,
        HttpClientModule
    ],
    exports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule
        //MultilingualModule
    ],
    declarations: [
        FourDAdminComponent, SideBarMenu, BlankPage, LoginComponent, BrowseTableComponent, BrowseQueryBand, BrowseFormDialog, BrowseFieldDialog, ListEditorComponent
        ],
    providers: [
        // Allows your {N} application to use lazy-loading
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
        FourDInterface, FourDModel, FourDCollection
    ],
    entryComponents: [BrowseQueryBand, BrowseFormDialog, BrowseFieldDialog],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class WebModule { }
