import { Component, Input } from '@angular/core';

import { FieldDescription } from './browseTable.component';
import { FourDModel } from '../js44D/js44D/JSFourDModel';

@Component({
    moduleId: module.id,
    selector: 'browse-inputfield',
    template: `<div style="display:inline-block;margin:15px;width:calc(100% - 30px)">
                <label class="formHeaderSmall" [attr.for]="inputField.name" style="margin-right:10px;width:180px;vertical-align:top">{{inputField.title}}:&nbsp;&nbsp;</label>
                    <span [ngSwitch]="inputField.type">
                        <span *ngSwitchCase="'string'">
                            <textarea *ngIf='inputField.length > 0' [maxlength]="inputField.length" [name]="inputField.name" type="text" class="fieldEntry"  cols="90" style="resize:vertical;width:75%" [(ngModel)]="stringField"></textarea>
                            <textarea *ngIf='!inputField.length'  [name]="inputField.name" type="text" class="fieldEntry"  cols="90" style="resize:vertical;width:75%" [(ngModel)]="stringField" [disabled]="inputField.readonly"></textarea>
                        </span>
                        <input *ngSwitchCase="'Date'"  [name]="inputField.name" type="date" class="fieldEntry"  style="width:125px;height:20px;" [(ngModel)]="dateField" [disabled]="inputField.readonly"/>
                        <input *ngSwitchCase="'Time'"  [name]="inputField.name" type="time" class="fieldEntry"  style="width:100px;height:20px;" [(ngModel)]="stringField" [disabled]="inputField.readonly"/>
                        <input *ngSwitchCase="'number'"  [name]="inputField.name" type="number" class="fieldEntry"  style="width:80px;height:20px;text-align:right;" [(ngModel)]="numberField" [disabled]="inputField.readonly"/>
                        <input *ngSwitchCase="'float'"  [name]="inputField.name" type="number" class="fieldEntry"  style="width:80px;height:20px;" [(ngModel)]="numberField" [disabled]="inputField.readonly"/>
                        <input *ngSwitchCase="'boolean'"  [name]="inputField.name" type="checkbox" class="fieldEntry" style="height:30px;width:50px;margin-top:-6px;" [(ngModel)]="booleanField" [disabled]="inputField.readonly"/>
                        <textarea *ngSwitchCase="'json'"  [name]="inputField.name" type="text" class="fieldEntry"  cols="90" style="resize:vertical;width:75%" [(ngModel)]="objectField" [disabled]="inputField.readonly"></textarea>
                     </span>    
               
                </div>
 
            `
})


export class BrowseInputField {
    //
    // declare quey band fields
    //
    @Input() inputField:FieldDescription;
    @Input() currentRecord: FourDModel;

    /**
     * Here I have to use a trick to deal with the fact that I'm using a fake FourDModel
     * which has not get/set methods for each property
     * so I'm using generic typed variables that do the get/set functions I need
     */
    @Input() get stringField():string {
        return this.currentRecord.get(this.inputField.name);
    }
    set stringField(v:string) {
        this.currentRecord.set(this.inputField.name, v);
        this.currentRecord[this.inputField.name] = v;
    }

    @Input() get numberField():number {
        return this.currentRecord.get(this.inputField.name);
    }
    set numberField(v:number) {
        this.currentRecord.set(this.inputField.name, v);
        this.currentRecord[this.inputField.name] = v;
    }

    @Input() get booleanField():boolean {
        return this.currentRecord.get(this.inputField.name);
    }
    set booleanField(v:boolean) {
        this.currentRecord.set(this.inputField.name, v);
        this.currentRecord[this.inputField.name] = v;
    }

    @Input() get dateField():Date {
        return this.currentRecord.get(this.inputField.name);
    }
    set dateField(v:Date) {
        this.currentRecord.set(this.inputField.name, v);
        this.currentRecord[this.inputField.name] = new Date(v);
    }

    @Input() get objectField():string {
        return this.currentRecord.get(this.inputField.name);
    }
    set objectField(v:string) {
        this.currentRecord.set(this.inputField.name, v);
        this.currentRecord[this.inputField.name] = v;
    }
}
