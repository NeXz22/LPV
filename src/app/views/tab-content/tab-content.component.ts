import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss']
})
export class TabContentComponent implements OnInit, AfterViewInit {

    @Input() tabChangeSubject = new Subject();
    @Input() tabJSON;

    htmlCodeSubject = new Subject<string>();
    cssCodeSubject = new Subject<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    htmlEditorInputChange(htmlCode: string): void {
        this.htmlCodeSubject.next(htmlCode);
    }

    cssEditorInputChange(cssCode: string): void {
        this.cssCodeSubject.next(cssCode);
    }

    ngAfterViewInit(): void {
        this.htmlCodeSubject.next(this.tabJSON.html);
        this.cssCodeSubject.next(this.tabJSON.css);
    }
}
