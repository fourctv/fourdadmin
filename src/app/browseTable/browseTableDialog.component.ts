import { Component, ContentChild, ElementRef, ViewContainerRef, AfterContentInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalConfig } from '../js44D/angular2-modal/models/ModalConfig';
import { Modal } from '../js44D/angular2-modal/providers/Modal';
import { ICustomModalComponent } from '../js44D/angular2-modal/models/ICustomModalComponent';

import { BrowseTableComponent } from './browseTable.component'

@Component({
    selector: 'browse-table-dialog',
    template: '<div></div>',
    providers: [Modal]
})

export class BrowseTableDialog implements AfterContentInit {
 
    constructor(private modal: Modal, public router:Router, private elementRef: ElementRef, private viewRef:ViewContainerRef) {
    }

    /**
     * AFter our view gets initialized, subscribe to various events on the Query band and the Grid
     */
    ngAfterContentInit() {
        this.router.navigate(['/blank'], { skipLocationChange: true });
        this.modal.openDialog(BrowseTableComponent, {});
    }
}
