import { Component, Input } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { FourDInterface } from 'js44d';
import { FieldDescription } from './browseTable.component';

@Component({
    moduleId: module.id,
    selector: 'browse-queryband',
    templateUrl: 'browseQuery.component.html'
})


export class BrowseQueryBand {
    //
    // declare quey band fields
    //
    @Input() tableName = '';
    @Input() queryFields: Array<FieldDescription>;
    @Input() queryData: any = {};
    @Input() queryChoiceList: any = {};

    constructor(private fourD: FourDInterface, private params: ModalDialogParams) {
        this.tableName = params.context.table;
        this.queryFields = params.context.queryFields;
        this.queryData = params.context.previousQuery;
        if (JSON.stringify(this.queryData) === '{}') { this.clearQuery(); }
    }

    public runQuery() {
        const query = this.currentQuery;
        this.params.closeCallback({ currentQuery: query, queryData: this.queryData });
    }

    public clearQuery() {
        this.queryChoiceList = {};
        this.queryData = {};
        for (let index = 0; index < this.queryFields.length; index++) {
            const field = this.queryFields[index];
            if (field.quickQuery) {
                switch (field.type) {
                    case 'string':
                        this.queryData[field.name] = '';
                        if (field.choiceList !== '') {
                            this.getChoiceList(field);
                        }
                        break;

                    case 'boolean':
                        this.queryData[field.name] = false;
                        break;

                    case 'number':
                    case 'float':
                    case 'Time':
                    case 'Date':
                        this.queryData[field.name] = null;
                        break;

                }
            }

        }

    }

    public close() {
        this.params.closeCallback({ currentQuery: [], queryData: this.queryData });
    }
    //
    // build 4C-TV query based on items from query band
    //
    public get currentQuery(): any {
        const currQuery = [];

        this.queryFields.forEach(field => {
            if (field.quickQuery) {
                switch (field.type) {
                    case 'string':
                        if (this.queryData[field.name] && this.queryData[field.name] !== '') {
                            currQuery.push(field.field + ';contains;' + this.queryData[field.name] + ';AND');
                        }
                        break;

                    case 'number':
                    case 'float':
                    case 'boolean':
                    case 'Time':
                        if (this.queryData[field.name] && this.queryData[field.name] !== '') {
                            currQuery.push(field.field + ';=;' + this.queryData[field.name] + ';AND');
                        }
                        break;

                    case 'Date':
                        if (this.queryData[field.name] && this.queryData[field.name] !== '') {
                            currQuery.push(field.field + ';=;' + (<string>(this.queryData[field.name]).replace(/-/g, '')) + ';AND');
                        }
                        break;

                }
            }
        });


        return (currQuery.length > 0) ? { query: currQuery } : null; // {query:['all']};

    }

    private getChoiceList(field) {
        this.queryChoiceList[field.name] = [];
        this.fourD.get4DList(field.choiceList)
            .then(list => { this.queryChoiceList[field.name] = list; })
    }
}
