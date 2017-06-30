import { Component, Input } from '@angular/core';

import { FieldDescription } from './browseTable.component';

@Component({
    moduleId: module.id,
    selector: 'browse-queryfield',
    template: `
                <label class="fieldPrompt" [attr.for]="queryField.name" style="margin-right:10px;">{{queryField.title}}:&nbsp;&nbsp;
                    <div [ngSwitch]="queryField.type">
                        <input *ngSwitchCase="'string'"  [name]="queryField.name" type="text" class="fieldEntry"  style="width:180px;height:20px;" [(ngModel)]="queryData[queryField.name]"/>
                        <input *ngSwitchCase="'Date'"  [name]="queryField.name" type="date" class="fieldEntry"  style="width:125px;height:20px;" [(ngModel)]="queryData[queryField.name]"/>
                        <input *ngSwitchCase="'Time'"  [name]="queryField.name" type="time" class="fieldEntry"  style="width:100px;height:20px;" [(ngModel)]="queryData[queryField.name]"/>
                        <input *ngSwitchCase="'number'"  [name]="queryField.name" type="number" class="fieldEntry"  style="width:80px;height:20px;" [(ngModel)]="queryData[queryField.name]"/>
                        <input *ngSwitchCase="'float'"  [name]="queryField.name" type="number" class="fieldEntry"  style="width:80px;height:20px;" [(ngModel)]="queryData[queryField.name]"/>
                        <input *ngSwitchCase="'boolean'"  [name]="queryField.name" type="checkbox" class="fieldEntry"  style="width:80px;height:20px;" [(ngModel)]="queryData[queryField.name]"/>
                     </div>    
                </label>
 
            `
})


export class BrowseQueryField {
    //
    // declare quey band fields
    //
    @Input() queryField:FieldDescription;
    @Input() queryData:any = {};


}
