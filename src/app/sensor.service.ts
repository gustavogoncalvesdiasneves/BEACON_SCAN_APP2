import { Injectable } from '@angular/core';

declare var accelerometer: any; // Declare as variáveis do plugin

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor() { }

  startGyroscope(callback: (orientation: any) => void) {
    const gyro = new accelerometer({
      frequency: 1000, // Freqüência de atualização em milissegundos
    });
    gyro.watchReadings((orientation: any) => {
      callback(orientation);
    });
  }
  
}
