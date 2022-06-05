import {Component, EventEmitter, Input, Output} from '@angular/core';
import hljs from 'highlight.js';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

    @Output() editorInputChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() language: string;
    @Input() label: string;

    scrollTop = 0;
    scrollLeft = 0;

    onTextareaInput(textarea: HTMLTextAreaElement, highlightContent: HTMLElement): void {
        let code = textarea.value;

        if (code[code.length - 1] === "\n") {
            code += " ";
        }

        highlightContent.textContent = code;
        hljs.highlightElement(highlightContent);
        this.editorInputChange.next(code);
    }

    onScroll(textarea: HTMLTextAreaElement): void {
        this.scrollTop = textarea.scrollTop;
        this.scrollLeft = textarea.scrollLeft;
    }
}
