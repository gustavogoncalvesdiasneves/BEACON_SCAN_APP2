import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

import { BLE } from '@ionic-native/ble/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/sensors/ngx';
import { Injectable } from '@angular/core';
// import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
// import { Gyroscope } from '@ionic-native/gyroscope/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Injectable, Geolocation, BLE, BluetoothSerial, BluetoothLE, //Gyroscope ,DeviceMotion,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
