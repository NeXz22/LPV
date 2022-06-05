import {Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';

@Component({
    selector: 'app-render',
    templateUrl: './render.component.html',
    styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit, OnDestroy {

    @Input() htmlCode: Subject<string>;
    @Input() cssCode: Subject<string>;

    destroyNotifier = new Subject<any>();
    iframe: HTMLIFrameElement = null;
    iframeContainer: HTMLDivElement = null;
    iframeContainerHeight: number;
    iframeContainerWidth: number;

    private initialIframeContainerHeight = 0;
    private initialIframeContainerWidth = 0;
    private latestHtmlCode = '';
    private latestCssCode = '';
    private resizeObserver: ResizeObserver;
    private baseStyles = '* {box-sizing: border-box;} html, body {overflow: hidden; margin: 0; padding: 0; width: 100%;}';

    constructor(
        private zone: NgZone
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

        this.resizeObserver = new ResizeObserver((div) => {
            this.zone.run(() => {
                if (!this.iframeContainerHeight || !this.iframeContainerWidth) {
                    this.initialIframeContainerHeight = div[0].contentRect.height;
                    this.initialIframeContainerWidth = div[0].contentRect.width;
                }
                this.iframeContainerHeight = div[0].contentRect.height;
                this.iframeContainerWidth = div[0].contentRect.width;
            });
        });
    }

    onLoad(iframe: HTMLIFrameElement, iframeContainer: HTMLDivElement): void {
        this.iframe = iframe;
        if (!this.iframeContainer) {
            this.iframeContainer = iframeContainer;
            this.resizeObserver.observe(this.iframeContainer);
        }
        this.render(this.latestHtmlCode, this.latestCssCode);
    }

    onResetRenderSize(): void {
        this.iframeContainerHeight = this.initialIframeContainerHeight;
        this.iframeContainerWidth = this.initialIframeContainerWidth;
    }

    private render(htmlCode, cssCode): void {
        this.iframe.contentWindow.document.open();
        this.iframe.contentWindow.document.write(htmlCode);
        this.iframe.contentWindow.document.close();

        const styles = document.createElement("style");
        styles.textContent = (this.baseStyles + cssCode);
        this.iframe.contentDocument.head.appendChild(styles);
    }

    ngOnDestroy(): void {
        this.resizeObserver.unobserve(this.iframeContainer);
        this.destroyNotifier.next(null);
        this.destroyNotifier.complete();
    }
}
