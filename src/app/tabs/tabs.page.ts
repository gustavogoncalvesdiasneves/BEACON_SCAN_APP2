import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
//import { error } from 'console';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothLE, InitParams, Device, ScanStatus } from '@awesome-cordova-plugins/bluetooth-le/ngx';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

  activateBluetoothError: string = '';
  scanDevicesError: string = '';
  devices: any[] = [];
  rssiValue: number = 0; // Inicializa com um valor padrão


  constructor(
    private navCtrl : NavController,
    private bluetoothSerial: BluetoothSerial,
    private alertContrl : AlertController,
    //private bluetoothLE : BluetoothLE,
    private ngZone : NgZone,
    private ble: BLE
    ) {
    
    }
  
    activateBluetooth() {
      this.bluetoothSerial.isEnabled().then(response => {
        this.isEnabled('IsOn');
      }).catch(error => {
        this.activateBluetoothError = 'Erro ao ativar o Bluetooth: ' + error.message;
        this.isEnabled('IsOff');
      })
    }
  //activateBluetooth() {
  //  this.bluetoothSerial.isEnabled().then(response => {
  //    this.isEnabled('IsOn');
  //  }, error => {
  //    this.isEnabled('IsOff');
  //  })
  //}

  connect(address:any){
    this.bluetoothSerial.connect(address).subscribe(successs => {
      this.deviceConnected()
    }, error => {
      console.log('error')
    })
  }

  setData(){
    this.bluetoothSerial.write("7").then(response => {
      console.log("Okay")
    }, error => {
      console.log('error')
    })
  }

  disconnected(){
    this.bluetoothSerial.disconnect()
    console.log('Dispositivo desconectado')
  }

  scanForDevices() {
    this.devices = []; // Limpa a lista de dispositivos antes de escanear novamente
    this.ble.scan([], 5).subscribe(device => {
      console.log(device);
      this.devices.push(device);
    });
  }


  deviceConnected(){
    this.bluetoothSerial.subscribe('/n').subscribe(success =>{
      this.handler(success)
    })
  }

  handler(value:any){
    console.log(value)
  }

  listDevices(){
    this.bluetoothSerial.list().then(response=>{
      this.devices=response
    }, error => {
      console.log('error')
    })
  }

  async isEnabled(msg:any) {
    const alert = await this.alertContrl.create({
      header: 'Alerta',
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Okay')
        }
      }]
    })
  }

  navigate_to_home(){
    this.navCtrl.navigateForward('home')
  }

  navHome() {
    this.navCtrl.navigateForward('home')
  }

  navRadarBLE() {
    this.navCtrl.navigateForward('radar-ble')
    
  }

  
}















//scanDevices() {
  //  const scanParams = { services: [] }; // Você pode especificar os serviços a serem procurados
  //  this.BLE.startScan(scanParams).subscribe(
  //    (device) => {
  //      console.log('Device found:', device);
  //      // Verifica se o dispositivo já existe na lista
  //      const existingDeviceIndex = this.devices.findIndex(dev => dev.address === device.address);
  //      if (existingDeviceIndex !== -1) {
  //        // Atualiza o valor RSSI para o dispositivo existente
  //        this.devices[existingDeviceIndex].rssi = device.rssi;
  //      } else {
  //        // Adiciona um novo dispositivo à lista
  //        this.devices.push({
  //          name: device.name,
  //          address: device.address,
  //          isConnected: false,
  //          rssi: device.rssi
  //        });
  //      }
  //    },
  //    (error) => {
  //      this.scanDevicesError = 'Erro ao buscar dispositivos: ' + error;
  //      console.error('Erro ao buscar dispositivos:', error);
  //    }
  //  );
  //}
  
  //scanDevices() {
  //  const params: InitParams = {
  //    request: true,
  //    statusReceiver: true,
  //  };
//
  //  this.bluetoothLE.initialize(params).subscribe(
  //    () => {
  //      console.log('BluetoothLE initialized');
//
  //      const scanParams = {
  //        services: [], // Put the services you want to search for here
  //        allowDuplicates: true,
  //        scanMode: this.bluetoothLE.SCAN_MODE_LOW_LATENCY,
  //      };
//
  //      this.bluetoothLE.startScan(scanParams).subscribe(
  //        (result) => {
  //          if (result.status === 'scanResult') {
  //            const scanResult = result as ScanStatus;
  //            console.log('Device found:', scanResult);
  //            this.devices.push(scanResult);
  //          } else if (result.status === 'scanStarted') {
  //            console.log('Scan started');
  //          }
  //        },
  //        (error) => {
  //          console.error('Scan error:', error);
  //        }
  //      );
  //    },
  //    (error) => {
  //      console.error('BluetoothLE initialization error:', error);
  //    }
  //  );
  //}

  //scanDevices() {
  //  this.bluetoothSerial.list().then((devices) => {
  //    this.devices = devices;
  //    this.scanDevicesError = ''; // Limpa o erro anterior se tiver sucesso
  //  }).catch(error => {
  //    this.scanDevicesError = 'Erro ao buscar dispositivos: ' + (error.message || error);
  //    console.error('Erro ao buscar dispositivos:', error);
  //  });
  //}

  // Função para atualizar o valor do RSSI
  //updateRSSI() {
  //  this.bluetoothSerial.readRSSI().then((rssi) => {
  //    this.rssiValue = rssi;
  //  }).catch((error) => {
  //    console.error('Erro ao ler RSSI:', error);
  //  });
  //}
