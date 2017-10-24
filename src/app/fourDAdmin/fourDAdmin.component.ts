import { Component, AfterContentInit, ViewContainerRef} from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Http } from '@angular/http';

import { Config } from '../common/index';

import { LoginComponent } from '../login/login.component';
import { Modal } from '../js44D/angular2-modal/providers/Modal';
import { FourDInterface } from '../js44D/js44D/JSFourDInterface';

import { BlankPage } from './blankPage';

export const routes: Routes = [
    {path: 'login', component: BlankPage},
    {path: 'browseTable', loadChildren: 'app/browseTable/browseTable.module#BrowseTableModule'},
    {path: 'listEditor', loadChildren: 'app/listEditor/listEditor.module#ListEditorModule'},
    {path: '**',  component: BlankPage}
];


@Component({
    moduleId: module.id,
    selector: 'sd-fourdadmin',
    providers: [ Modal, FourDInterface ],
    templateUrl: 'fourDAdmin.component.html',
    styleUrls: ['fourDAdmin.component.css']
})


export class FourDAdminComponent implements AfterContentInit {
    public menuList = [
        {
            routePath: '/browseTable',
            title: 'Browse Table'
        },
        {
            routePath: '/listEditor',
            title: 'List Editor'
        },
        {
            routePath: '/userManager',
            title: 'User Manager'
        }
    ];

    public get currentUser(): string {
        return (FourDInterface.authentication) ? FourDInterface.currentUser : '?';
    }

    constructor (public router:Router, private http:Http, private modal: Modal, private viewref: ViewContainerRef) {
        FourDInterface.http = http;
        if (window.location.hostname === 'localhost' && window.location.port === "4200") {
            FourDInterface.fourDUrl = 'http://www.vakeano.com';   
            //FourDInterface.fourDUrl = 'http://localhost:8080';   
        } else {
            FourDInterface.fourDUrl = window.location.origin;
        }
        Modal.hostViewRef = this.viewref;
    }

    ngAfterContentInit() {
             // no predefined user, login...
        if (Config.PLATFORM_TARGET === Config.PLATFORMS.WEB) this.showLoginDialog();
    }
    
    userHasLoggedIn() {
        // load current profile user functions
        if (this.userIsLoggedIn) {
            FourDInterface.runningInsideWorkspace = true; // we are indeed running inside the workspace
       }

    }


    get userIsLoggedIn(): boolean { return FourDInterface.authentication !== undefined && FourDInterface.authentication !== null; }

    doLogin() {
        FourDInterface.authentication = null;
        this.router.navigate(['/login'], { skipLocationChange: true });
        if (Config.PLATFORM_TARGET === Config.PLATFORMS.WEB) this.showLoginDialog();
    }

    showLoginDialog() {
        this.modal.openInside(<any>LoginComponent, this.viewref, null, LoginComponent['dialogConfig'])
            .then((result) => {
                    this.userHasLoggedIn();
            });        
    }


    openApp(menu) {
       if (FourDInterface.authentication) {
           this.router.navigate([menu.routePath], { skipLocationChange: true });
       }
    }
}
