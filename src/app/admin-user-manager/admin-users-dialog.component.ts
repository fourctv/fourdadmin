import { AfterContentInit, Component, ElementRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'js44d';
import { AdminUserManagerComponent } from './admin-user-manager.component';



@Component({
    selector: 'admin-user-dialog',
    template: '<div></div>',
    providers: [Modal]
})

export class AdminUserDialog implements AfterContentInit {
    constructor(private modal: Modal, public router: Router, private elementRef: ElementRef, private viewRef: ViewContainerRef) {
    }

    /**
     * AFter our view gets initialized, subscribe to various events on the Query band and the Grid
     */
    ngAfterContentInit() {
        this.router.navigate(['/blank'], { skipLocationChange: true });
        this.modal.openDialog(AdminUserManagerComponent, {}); // open edit dialog
    }
}
