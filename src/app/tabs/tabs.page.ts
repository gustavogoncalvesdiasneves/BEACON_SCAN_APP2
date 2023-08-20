import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
//import { error } from 'console';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';


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
    private BLE : BluetoothLE,
    private ngZone : NgZone,
    ) {
      this.updateRSSI();
      setInterval(() => {
        this.updateRSSI();
      }, 1500); // Atualiza a cada 1,5 segundos
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

  navOrc() {
    this.navCtrl.navigateForward('orcamento')
    
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
  


  scanDevices() {
    this.bluetoothSerial.list().then((devices) => {
      this.devices = devices;
      this.scanDevicesError = ''; // Limpa o erro anterior se tiver sucesso
    }).catch(error => {
      this.scanDevicesError = 'Erro ao buscar dispositivos: ' + (error.message || error);
      console.error('Erro ao buscar dispositivos:', error);
    });
  }

  // Função para atualizar o valor do RSSI
  updateRSSI() {
    this.bluetoothSerial.readRSSI().then((rssi) => {
      this.rssiValue = rssi;
    }).catch((error) => {
      console.error('Erro ao ler RSSI:', error);
    });
  }

}
