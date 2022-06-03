import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import hljs from 'highlight.js';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

    @Output()
    editorInputChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    language;
    scrollTop = 0;
    scrollLeft = 0;

    constructor() {
    }

    ngOnInit(): void {
    }

    onTextareaInput(textarea: HTMLTextAreaElement, highlightContent: HTMLElement): void {
        let code = textarea.value;

        if (code[code.length - 1] == "\n") { // If the last character is a newline character
            code += " "; // Add a placeholder space character to the final line
        }

        highlightContent.textContent = code;
        hljs.highlightElement(highlightContent);
        this.editorInputChange.next(code);
    }

    onScroll(textarea: HTMLTextAreaElement): void {
        console.log('onScroll');
        this.scrollTop = textarea.scrollTop;
        this.scrollLeft = textarea.scrollLeft;
    }
}
