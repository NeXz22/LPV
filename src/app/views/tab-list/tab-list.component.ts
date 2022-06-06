import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import ShowCaseJSON from '../../../assets/data/showcase.json'

@Component({
    selector: 'app-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrls: ['./tab-list.component.scss']
})
export class TabListComponent implements OnInit {

    jsonData: any[] = ShowCaseJSON;
    children: any[];
    activeTab: number = 0;
    tabChangeSubject = new Subject();

    constructor() {
    }

    ngOnInit(): void {
        this.children = this.jsonData.flatMap(category => category.children);
    }

    onTabListItemClicked(tabIndex: number): void {
        if (tabIndex !== this.activeTab) {
            this.activeTab = tabIndex;
            this.tabChangeSubject.next(tabIndex);
        }
    }
}
