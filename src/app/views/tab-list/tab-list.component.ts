import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-tab-list',
    templateUrl: './tab-list.component.html',
    styleUrls: ['./tab-list.component.scss']
})
export class TabListComponent implements OnInit {

    tabs: any[] = [1, 2, 3];
    activeTab: number = 0;
    tabChangeSubject = new Subject();

    constructor() {
    }

    ngOnInit(): void {
    }

    onTabListItemClicked(tabIndex: number): void {
        if (tabIndex !== this.activeTab) {
            this.activeTab = tabIndex;
            this.tabChangeSubject.next(tabIndex);
        }
    }
}
