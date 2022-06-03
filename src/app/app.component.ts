import {Component} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'LPV';
    htmlCodeSubject = new Subject<string>();
    cssCodeSubject = new Subject<string>();

    htmlEditorInputChange(htmlCode: string): void {
        this.htmlCodeSubject.next(htmlCode);
    }

    cssEditorInputChange(cssCode: string): void {
        this.cssCodeSubject.next(cssCode);
    }
}
