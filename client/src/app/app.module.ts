import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { MoomooComponent } from './moomoo/moomoo.component';
import { BackendService } from './services/backend.service';

@NgModule({
  declarations: [
    AppComponent,
    MoomooComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
