import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//ViaCep npm install @brunoc/ngx-viacep --save
import { ViacepModule } from '@brunoc/ngx-viacep';

//FireBase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ViacepModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
