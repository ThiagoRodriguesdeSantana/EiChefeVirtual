import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//ViaCep npm install @brunoc/ngx-viacep --save
import { ViacepModule } from '@brunoc/ngx-viacep';

//FireBase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './pages/home/home.component';
import { EntityService } from './services/db-services/entity.service';
import { CommonService } from './services/common-servces/common.service';
import { AppRoutsRoutes } from './app-routs.routing';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { EntityComponent } from './pages/entity/entity.component';
import { ItemComponent } from './pages/item/item.component';
import { FormsModule } from '@angular/forms';
import { UploadImagePageComponent } from './pages/upload-image-page/upload-image-page.component';
import { HeaderPageComponent } from './pages/header-page/header-page.component';
import { FooterPageComponent } from './pages/footer-page/footer-page.component';
import { CreateItemComponent } from './pages/item/create-item/create-item.component';
import { ListItemComponent } from './pages/item/list-item/list-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatTableModule,
  MatCheckbox,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';

import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderComponent } from './pages/order/order.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginPageComponent,
    EntityComponent,
    ItemComponent,
    HeaderPageComponent,
    FooterPageComponent,
    CreateItemComponent,
    ListItemComponent,
    UploadImagePageComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    ViacepModule,
    AppRoutsRoutes,
    FormsModule,
    NgxSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule
    
  ],
  providers: [EntityService, CommonService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
