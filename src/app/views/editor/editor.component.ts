import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import hljs from 'highlight.js';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {

    @ViewChild('highlightContent', {static: true}) highlightContent: ElementRef<HTMLElement>;
    @ViewChild('textarea', {static: true}) textarea: ElementRef<HTMLTextAreaElement>;

    @Output() editorInputChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() language: string;
    @Input() label: string;
    @Input() initialValue: string;

    scrollTop = 0;
    scrollLeft = 0;

    ngAfterViewInit(): void {
        this.textarea.nativeElement.textContent = this.initialValue;
        this.highlightContent.nativeElement.textContent = this.initialValue;
        hljs.highlightElement(this.highlightContent.nativeElement);
    }

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
