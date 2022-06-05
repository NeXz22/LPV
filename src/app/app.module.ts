import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EditorComponent} from './views/editor/editor.component';
import {RenderComponent} from './views/render/render.component';
import {TabListComponent} from './views/tab-list/tab-list.component';
import { TabContentComponent } from './views/tab-content/tab-content.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        RenderComponent,
        TabListComponent,
        TabContentComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
