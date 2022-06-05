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
    @Input() tabChangeSubject = new Subject();

    destroyNotifier = new Subject<any>();
    iframe: HTMLIFrameElement = null;
    iframeContainer: HTMLDivElement = null;
    iframeContainerHeight: number;
    iframeContainerWidth: number;
    renderInitialised = false;

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
            console.log('resizeObserver');
            this.zone.run(() => {
                if (!this.renderInitialised) {
                    this.initialIframeContainerHeight = div[0].contentRect.height;
                    this.initialIframeContainerWidth = div[0].contentRect.width;
                    this.renderInitialised = true;
                }
                this.iframeContainerHeight = div[0].contentRect.height;
                this.iframeContainerWidth = div[0].contentRect.width;
            });
        });

        this.tabChangeSubject
            .pipe(takeUntil(this.destroyNotifier))
            .subscribe({
                next: () => this.onResetRenderSize(),
            })
    }

    onLoad(iframe: HTMLIFrameElement, iframeContainer: HTMLDivElement): void {
        console.log('onload');
        console.log(this.iframeContainerHeight);
        console.log(this.initialIframeContainerHeight);
        this.iframe = iframe;
        if (!this.iframeContainer) {
            this.iframeContainer = iframeContainer;
            this.resizeObserver.observe(this.iframeContainer);
        }
        this.render(this.latestHtmlCode, this.latestCssCode);
    }

    onResetRenderSize(): void {
        if (this.renderInitialised) {
            this.iframeContainerHeight = this.initialIframeContainerHeight;
            this.iframeContainerWidth = this.initialIframeContainerWidth;
        }
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
