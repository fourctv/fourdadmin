import { Component, AfterContentInit } from '@angular/core';

//import { LogService } from '../core/services/logging/log.service';
import { ModalConfig } from '../js44D/angular2-modal/models/ModalConfig';
import { ICustomModalComponent } from '../js44D/angular2-modal/models/ICustomModalComponent';
import { ModalDialogInstance } from '../js44D/angular2-modal/models/ModalDialogInstance';

import { FourDInterface } from '../js44D/js44D/JSFourDInterface';

@Component({
    moduleId: module.id,
    selector: 'list-editor',
    templateUrl: 'listEditor.component.html',
    styleUrls: ['listEditor.component.css']
})

export class ListEditorComponent implements ICustomModalComponent, AfterContentInit {
    public static dialogConfig: ModalConfig = <ModalConfig>{
            actions:['Maximize', 'Minimize', 'Close'], position: {top:100, left:150},selfCentered:true,
            title:'4D List Editor',
            isResizable:true,
            width:1100, height:510
        };

    public dialog: ModalDialogInstance;

    public listCount = 0;
    public listNames = [];
    public selectedList: any;
    public selectedListName = '';
    public listItems = [];
    public selectedItem: any;
    public selectedItemIndex = -1;
    public selectedItemValue = '';

    constructor(private fourD: FourDInterface/*, private logger: LogService*/) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOf4DLists', {})
            .subscribe(response => {
                let resultJSON = response.json();
                this.listCount = resultJSON.listCount;
                this.listNames = resultJSON.listNames;

            });
    }

    selectList(event, list) {
        if (this.selectedList) {
            this.selectedList.classList.remove('selectedItem');
        }
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selectedItem');
            this.selectedItemValue = '';
            this.selectedItemIndex = -1;
        }

        this.selectedList = event.target;
        this.selectedListName = list;
        this.fourD.get4DList(this.selectedListName)
            .then((values) => {
                this.selectedList.classList.add('selectedItem');
                this.listItems = values;
                this.selectedItem = null;
                this.selectedItemIndex = -1;
            });
    }

    selectItem(event, item) {
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selectedItem');
        }

        this.selectedItemValue = item;
        this.selectedItemIndex = event.currentTarget.rowIndex;
        this.selectedItem = event.target;
        this.selectedItem.classList.add('selectedItem');

    }

    addItem() {
        if (this.selectedItemValue !== '') {
            this.listItems.push(this.selectedItemValue);
            this.update4DList();
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
            this.listItems.splice(this.selectedItemIndex,1);
            this.update4DList();
        }

    }

    update4DList() {
        this.fourD.update4DList(this.selectedListName, this.listItems);
    }


    startDrag(event, type) {
        event.effectAllowed = 'copy';
        event.dataTransfer.setData('row', event.currentTarget.rowIndex);
   }

    allowDrop(event) {
        if (event.preventDefault)  event.preventDefault(); // Necessary. Allows us to drop.
        if (event.stopPropagation)  event.stopPropagation(); 


        if (event.type === 'dragenter') {
            event.target.classList.add('droppable');
            event.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
        }
        return false;    
    }

    disableDrop(event) {
        if (event.stopPropagation)  event.stopPropagation(); 
        event.target.classList.remove('droppable');
    }

    handleDrop(event) {
        if (event.stopPropagation)  event.stopPropagation(); 
        
        this.disableDrop(event);

        let row = event.dataTransfer.getData('row');
        let moveToIndex = event.currentTarget.rowIndex;
        let item = this.listItems.splice(row,1);
        if (row < moveToIndex) {
            // moving up...
            this.listItems.splice(event.currentTarget.rowIndex-1,0,item[0]);
        } else {
            // moving down
            this.listItems.splice(event.currentTarget.rowIndex,0,item[0]);
        }
 
        this.update4DList();
    }
}