import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import hljs from 'highlight.js';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {

    @ViewChild('highlight', {static: true}) highlightRef: ElementRef<HTMLPreElement>;
    @ViewChild('highlightContent', {static: true}) highlightContentRef: ElementRef<HTMLElement>;
    @ViewChild('textarea', {static: true}) textareaRef: ElementRef<HTMLTextAreaElement>;

    @Output() editorInputChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() language: string;
    @Input() label: string;
    @Input() initialValue: string;

    ngAfterViewInit(): void {
        this.textareaRef.nativeElement.textContent = this.initialValue;
        this.highlightContentRef.nativeElement.textContent = this.initialValue;
        hljs.highlightElement(this.highlightContentRef.nativeElement);
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

    onScroll(): void {
        this.highlightRef.nativeElement.scrollTop = this.textareaRef.nativeElement.scrollTop;
        this.highlightRef.nativeElement.scrollLeft = this.textareaRef.nativeElement.scrollLeft;
        this.highlightContentRef.nativeElement.scrollTop = this.textareaRef.nativeElement.scrollTop;
        this.highlightContentRef.nativeElement.scrollLeft = this.textareaRef.nativeElement.scrollLeft;
    }
}
