import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, BluetoothSerial, BluetoothLE,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
