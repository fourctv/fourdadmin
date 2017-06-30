import { Component, AfterContentInit, ViewContainerRef} from '@angular/core';
import { Http } from '@angular/http';
import { RouterExtensions } from 'nativescript-angular';

import { Config } from '../common/index';

import { LoginComponent } from '../login/login.component';
import { FourDInterface } from '../js44D/js44D/JSFourDInterface';

import { BlankPage } from './blankPage';


@Component({
    moduleId: module.id,
    selector: 'sd-fourdadmin',
    providers: [ FourDInterface ],
    templateUrl: 'fourDAdmin.component.html',
    styleUrls: ['fourDAdmin.component.css']
})


export class FourDAdminComponent implements AfterContentInit {
    public get currentUser(): string {
        return (FourDInterface.authentication) ? FourDInterface.currentUser : '?';
    }

    constructor (public router:RouterExtensions, private http:Http, private viewref: ViewContainerRef) {
        FourDInterface.http = http;
//        FourDInterface.fourDUrl = 'http://localhost:8080';
        FourDInterface.fourDUrl = 'http://54.191.46.243:8080';
    }

    ngAfterContentInit() {
             // no predefined user, login...
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
    }



    openApp(menu) {
       if (FourDInterface.authentication) {
           this.router.navigate([menu.routePath], { skipLocationChange: true });
       }
    }
}
