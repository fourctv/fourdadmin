import { Component, AfterViewInit } from '@angular/core';

import { RecordEditWindow } from 'js44d';
import { ModalConfig } from 'js44d';
import { FourDModel } from 'js44d';

@Component({
    moduleId: module.id,
    selector: 'modal-content',
    template: `
    <div style="display:flex;flex-direction:column;height:calc(100% - 20px);">
                <form style="display:grid;overflow:scroll;margin:20px 20px 5px 20px;padding-left:10px;border-style:outset">
                    <browse-inputfield *ngFor='let field of currentRecord.fields' [inputField]= "field" [currentRecord]="currentRecord"></browse-inputfield>                    
                </form>
                <div class="buttonBar" style="align-self:flex-end">
                    <button class="regularButton" style="width:90px;" (click)="dialog.close('cancel')">Cancel</button>
                    <button class="regularButton" style="margin-left:20px;width:90px;" (click)="saveRecord()">SAVE</button>
                </div>
    </div>
            `
})

export class BrowseFormDialog extends RecordEditWindow implements AfterViewInit {
    public static dialogConfig: ModalConfig = <ModalConfig>{
        actions: ['Maximize', 'Minimize', 'Close'], position: { top: 100, left: 100 }, selfCentered: true,
        title: 'Record Details',
        isResizable: true,
        width: 950, height: 500
    };

    currentRecord: FourDModel;


    ngAfterViewInit() {
        this.dialog.setTitle('Edit Record: ' + this.currentRecord.tableName);

        /**
         * as I'm dealing with a fake FourDModel instance, I need to populate
         * the model's attributes so data modification gets properly flagged
         */
        this.currentRecord.fields.forEach(element => {
            this.currentRecord.set(element.name, this.currentRecord[element.name]);
        });
        this.currentRecord.clearRecordDirtyFlag();
    }

}
