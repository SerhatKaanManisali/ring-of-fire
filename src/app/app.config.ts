import { ApplicationConfig, NgModule, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-ba7dc","appId":"1:303030454483:web:0dca2b06b9ac9b01152c26","storageBucket":"ring-of-fire-ba7dc.appspot.com","apiKey":"AIzaSyCxTZSVsWEKbwQEgWjHf9KIaoTdEIodJ4c","authDomain":"ring-of-fire-ba7dc.firebaseapp.com","messagingSenderId":"303030454483"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};