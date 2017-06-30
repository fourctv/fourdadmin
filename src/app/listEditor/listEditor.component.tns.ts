import { Component, Input, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';

import { FourDInterface } from '../js44D/js44D/JSFourDInterface';

@Component({
    moduleId: module.id,
    selector: 'list-editor',
    templateUrl: 'listEditor.component.html',
    styles: [`
        .highlight {
            background-color: #eee;
        }
    `],
    changeDetection: ChangeDetectionStrategy.Default
})

export class ListEditorComponent implements AfterContentInit {

    public listCount = 0;
    @Input() public listNames = [];
    public selectedListName = '';
    @Input() public listItems = [];
    public selectedItemIndex = -1;
    @Input() public selectedItemValue: string = '';

    constructor(private fourD: FourDInterface) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOf4DLists', {})
            .subscribe(response => {
                let resultJSON = response.json();
                this.listCount = resultJSON.listCount;
                this.listNames = resultJSON.listNames;

            });
    }


    selectList(listIndex) {
        this.selectedItemValue = '';
        this.selectedItemIndex = -1;
  
        this.selectedListName = this.listNames[listIndex];
        let body: any = { list: this.selectedListName };
        this.fourD.call4DRESTMethod('REST_Get4DList', body)
            .subscribe((response) => {
                let resultJSON = response.json();
                this.listItems = resultJSON.values;
                this.selectedItemIndex = -1;
            });
    }

    selectItem(itemIndex) {
        this.selectedItemIndex = itemIndex;
        this.selectedItemValue = this.listItems[this.selectedItemIndex];

    }

    addItem() {
        if (this.selectedItemValue !== '') {
            this.listItems.push(this.selectedItemValue);
            this.update4DList();
            this.selectedItemValue = '';
            this.selectedItemIndex = -1;
        }
    }

    changeItem() {
        if (this.selectedItemIndex >= 0) {
            this.listItems[this.selectedItemIndex] = this.selectedItemValue;
            this.update4DList();
        }
    }

    deleteItem() {
        if (this.selectedItemIndex >= 0) {
            this.listItems.splice(this.selectedItemIndex, 1);
            this.update4DList();
            this.selectedItemValue = '';
            this.selectedItemIndex = -1;
        }

    }

    onItemReordered(event) {
        this.update4DList();
        this.selectedItemValue = '';
        this.selectedItemIndex = -1;
    }

    update4DList() {
        this.fourD.call4DRESTMethod('REST_Update4DList', { listName: this.selectedListName, listValues: JSON.stringify({ items: this.listItems }) })
            .subscribe();

        // trick to force screen update
        let copy = this.listItems;
        this.listItems = [];
        copy.forEach(element => { this.listItems.push(element); });
    }
}