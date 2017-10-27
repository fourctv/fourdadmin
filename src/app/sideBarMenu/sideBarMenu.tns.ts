import { Component, Input, Output, ChangeDetectionStrategy, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { SideDrawerLocation } from "nativescript-pro-ui/sidedrawer";
import { isAndroid, isIOS } from 'platform';

@Component({
    moduleId: module.id,
    selector: 'side-bar',
    template: `
    <ActionBar class="action-bar" [title]="pageTitle">
        <ActionItem (tap)="toggleSideBar()" icon="~/assets/icons/mobile_menu.png" ios.position="left" android.position="actionBar" android.systemIcon="ic_menu_manage"></ActionItem>
    </ActionBar>
    <RadSideDrawer [drawerLocation]="currentLocation">
        <StackLayout tkDrawerContent class="sideStackLayout" style="background-color: lightgray;" verticalAlignment="top" marginTop="5" height="185" width="250" padding="10">
            <StackLayout class="sideTitleStackLayout">
                <Label text="FourD Admin" class="text-center h2"></Label>
            </StackLayout>

            <StackLayout class="hr-light"></StackLayout>
            <StackLayout class="hr-dark"></StackLayout>
            <StackLayout class="hr-light"></StackLayout>

            <StackLayout class="sideStackLayout">
                <StackLayout>
                    <Label class="p-t-5"
                        *ngFor="let menuItem of menuList"
                        [text]="menuItem.title"
                        (tap)="closeDrawer();selectMenu(menuItem)"></Label>
                </StackLayout>
                <StackLayout class="hr-dark" marginTop="5"></StackLayout>
                <StackLayout class="hr-dark"></StackLayout>

                <Label text="Logout" class="p-t-5" (tap)="closeDrawer();login()"></Label>
            </StackLayout>
        </StackLayout>

        <StackLayout tkMainContent width="100%" height="100%">
                <ng-content></ng-content>
         </StackLayout>
    </RadSideDrawer>        
`,
    changeDetection: ChangeDetectionStrategy.Default
})

export class SideBarMenu implements OnInit {
    public menuList = [
        {
            routePath: '/browseTable',
            title: 'Browse Table'
        },
        {
            routePath: '/listEditor',
            title: 'List Editor'
        },
       /* {
            routePath: '/userManager',
            title: 'User Manager'
        }*/
    ];

    @Input() pageTitle:string = '';

    @Input() currentLocation = SideDrawerLocation.Left;

    @Output() public onSwipe: EventEmitter<any> = new EventEmitter();

    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;


    constructor(private router:RouterExtensions) {
       
    }

    ngOnInit() {
        // need to set drawer location because on iOS it show on the left, but on android it comes up on the right
        if (isAndroid) this.currentLocation = SideDrawerLocation.Right;
    }

    selectMenu (menuItem) {

        this.router.navigate([menuItem.routePath], { clearHistory:true });
    }

    toggleSideBar() {
        this.drawerComponent.sideDrawer.toggleDrawerState();
    }

    closeDrawer() {
       this.drawerComponent.sideDrawer.closeDrawer();
    }

    doSwipe(event:any) {
        console.log('swipe:'+event.direction);
        this.onSwipe.emit(event);
    }

    login() {
        this.router.navigate(['/login'], { clearHistory:true });
    }

}
