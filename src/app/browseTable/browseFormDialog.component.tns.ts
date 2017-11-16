import { Component, Input } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { FourDModel } from 'js44d';
import { FieldDescription } from './browseTable.component';

@Component({
    moduleId: module.id,
    selector: 'record-content',
    templateUrl: 'browseFormDialog.component.html'
})

export class BrowseFormDialog {

    @Input() tableName = '';
    @Input() fieldList: Array<FieldDescription>;
    @Input() fieldData = {};
    private currentRecord: FourDModel;

    constructor(private params: ModalDialogParams) {
        this.tableName = params.context.tableName;
        this.currentRecord = params.context.record;
        this.fieldList = params.context.fieldList;
        //
        // stupid RadDataForm does not provide a way to omit fields from the form!
        // so, I move field info to a separate object
        //
        this.fieldData = {};
        for (let index = 0; index < this.fieldList.length; index++) {
            const field = this.fieldList[index];
            if ((this.currentRecord).hasOwnProperty(field.name)) { this.fieldData[field.name] = this.currentRecord[field.name]; }
        }
    }


    public close() {
        this.params.closeCallback();
    }
}

