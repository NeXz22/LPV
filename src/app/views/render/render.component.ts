import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';

@Component({
    selector: 'app-render',
    templateUrl: './render.component.html',
    styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('iframe') iframeRef: ElementRef<HTMLIFrameElement>;
    @ViewChild('iframeContainer', {static: true}) iframeContainerRef: ElementRef<HTMLDivElement>;

    @Input() htmlCode: Subject<string>;
    @Input() cssCode: Subject<string>;
    @Input() tabChangeSubject = new Subject();

    destroyNotifier = new Subject<any>();
    iframeContainerHeight: number;
    iframeContainerWidth: number;
    initialIframeContainerHeight = 0;
    initialIframeContainerWidth = 0;

    private latestHtmlCode = '';
    private latestCssCode = '';
    private resizeObserver: ResizeObserver;
    private baseStyles = '* {box-sizing: border-box;} html, body {margin: 0; padding: 0; width: 100%;}';

    constructor(
        private zone: NgZone,
        private renderer: Renderer2
    ) {
    }

    ngOnInit(): void {
        this.htmlCode
            .pipe(takeUntil(this.destroyNotifier))
            .subscribe({
                next: htmlCode => {
                    this.latestHtmlCode = htmlCode;
                    this.render(htmlCode, this.latestCssCode);
                },
            });

        this.cssCode
            .pipe(takeUntil(this.destroyNotifier))
            .subscribe({
                next: cssCode => {
                    this.latestCssCode = cssCode;
                    this.render(this.latestHtmlCode, cssCode);
                },
            });

        this.tabChangeSubject
            .pipe(takeUntil(this.destroyNotifier))
            .subscribe({
                next: () => this.onResetRenderSize(),
            })
    }

    ngAfterViewInit(): void {
        this.initialIframeContainerHeight = this.iframeContainerRef.nativeElement.offsetHeight;
        this.initialIframeContainerWidth = this.iframeContainerRef.nativeElement.offsetWidth;

        this.resizeObserver = new ResizeObserver((div) => {
            this.zone.run(() => {
                if (!this.initialIframeContainerHeight || !this.initialIframeContainerWidth) {
                    this.initialIframeContainerHeight = div[0].contentRect.height;
                    this.initialIframeContainerWidth = div[0].contentRect.width;
                }
            });
        });

        this.resizeObserver.observe(this.iframeContainerRef.nativeElement);
    }

    onLoad(): void {
        this.render(this.latestHtmlCode, this.latestCssCode);
    }

    onResetRenderSize(): void {
        if (this.initialIframeContainerHeight && this.initialIframeContainerWidth) {
            this.renderer.setStyle(this.iframeContainerRef.nativeElement, 'height', this.initialIframeContainerHeight + 'px');
            this.renderer.setStyle(this.iframeContainerRef.nativeElement, 'width', this.initialIframeContainerWidth + 'px');
        }
    }

    private render(htmlCode, cssCode): void {
        this.iframeRef.nativeElement.contentWindow.document.open();
        this.iframeRef.nativeElement.contentWindow.document.write(htmlCode);
        this.iframeRef.nativeElement.contentWindow.document.close();

        const styles = document.createElement("style");
        styles.textContent = (this.baseStyles + cssCode);
        this.iframeRef.nativeElement.contentDocument.head.appendChild(styles);
    }

    ngOnDestroy(): void {
        this.resizeObserver.unobserve(this.iframeContainerRef.nativeElement);
        this.destroyNotifier.next(null);
        this.destroyNotifier.complete();
    }
}
