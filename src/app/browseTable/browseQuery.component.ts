import { Component, Input } from '@angular/core';

import { FieldDescription } from './browseTable.component';

@Component({
    moduleId: module.id,
    selector: 'browse-queryband',
    template: `
                <form style="display:flex;overflow:auto">
                    <div *ngFor='let field of queryFields'  style="float: left;height: 100%; margin-right: 10px;">
                        <browse-queryfield *ngIf='field.quickQuery' [queryField]= "field" [queryData]="queryData"></browse-queryfield>
                    </div>
                </form>
            `
})


export class BrowseQueryBand {
    //
    // declare quey band fields
    //
    @Input() queryFields: Array<FieldDescription>;
    @Input() queryData: any = {};

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
                    case 'Number':
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
}
