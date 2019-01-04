import { Component, Input, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

import { FourDInterface } from 'js44d';

@Component({
    moduleId: module.id,
    selector: 'list-editor',
    templateUrl: 'listEditor.component.html',
    styles: [`
        .highlight {
            background-color: #00FF00;
        }
    `],
    changeDetection: ChangeDetectionStrategy.Default
})

export class ListEditorComponent implements AfterContentInit {

    public listCount = 0;
    public listNames:ObservableArray<string> = new ObservableArray();
    public selectedListName = '';
    public selectedListIndex = -1;
    public listItems: ObservableArray<string> = new ObservableArray([]);
    public selectedItemIndex = -1;
    public selectedItemValue = '';

    constructor(private fourD: FourDInterface, private router: RouterExtensions) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOf4DLists', {})
            .subscribe(resultJSON => {
                this.listCount = resultJSON.listCount;
                this.listNames = new ObservableArray(resultJSON.listNames);
            });
    }


    selectList(listIndex) {
        this.selectedItemValue = '';
        this.selectedListIndex = listIndex;

        this.selectedListName = this.listNames.getItem(listIndex);
        const body: any = { list: this.selectedListName };
        this.fourD.call4DRESTMethod('REST_Get4DList', body)
            .subscribe((resultJSON) => {
                this.listItems = new ObservableArray(resultJSON.values);
                this.selectedItemIndex = -1;
            });
    }

    selectItem(itemIndex) {
        this.selectedItemIndex = itemIndex;
        this.selectedItemValue = this.listItems.getItem(this.selectedItemIndex);
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
            this.listItems.setItem(this.selectedItemIndex, this.selectedItemValue);
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
        let body = { listName: this.selectedListName, listValues: JSON.stringify({ items: this.listItems.filter(() => { return true }) }) };
        console.log(body);
        this.fourD.call4DRESTMethod('REST_Update4DList', body )
            .subscribe();
    }

    onNavBtnTap() {
        this.router.navigate(['/back'], { clearHistory: true });
    }

}
