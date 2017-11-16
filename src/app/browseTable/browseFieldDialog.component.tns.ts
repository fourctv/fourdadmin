import { Component, Input } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { FieldDescription } from './browseTable.component';

@Component({
    moduleId: module.id,
    selector: 'record-content',
    template: `
        <StackLayout class="form" style="padding-top:40" padding="10">
        <Label text="Browse Field:{{field.name}}" class="label"></Label>
        <StackLayout orientation="horizontal" marginTop="15" width="100%" >
            <Label text="Title:" class="label"></Label>
            <TextField [(ngModel)]="field.title" margin="10" autocorrect="false" autocapitalizationType="none" class="input" borderWidth=".5" width="100%"></TextField>
        </StackLayout>
        <StackLayout orientation="horizontal" marginTop="15" >
            <Label text="present on Query form?" class="label"></Label>
            <Switch checked="{{field.quickQuery}}" (checkedChange)="field.quickQuery=$event.object.checked" margin="10"></Switch>
        </StackLayout>
        <StackLayout  orientation="horizontal" marginTop="15" horizontalAlignment="center">
            <Button text="Save" (tap)="close()" class="btn btn-primary btn-active btn-rounded-lg" width="120"></Button>
        </StackLayout>
    </StackLayout>
    `
})

export class BrowseFieldDialog {

    @Input() field: FieldDescription;


    constructor(private params: ModalDialogParams) {
        this.field = params.context.field;
    }


    public close() {
        this.params.closeCallback(this.field);
    }
}

