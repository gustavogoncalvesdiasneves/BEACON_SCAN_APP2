import { Component, NgZone, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, TemplateRef, numberAttribute } from '@angular/core';
import { NavController } from '@ionic/angular';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
//import { error } from 'console';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothLE, InitParams, Device, ScanStatus } from '@awesome-cordova-plugins/bluetooth-le/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { filter, identity } from 'rxjs';

@Component({
  selector: 'app-radar-ble',
  templateUrl: './radar-ble.page.html',
  styleUrls: ['./radar-ble.page.scss'],
})
export class RadarBlePage {

  activateBluetoothError: string = '';
  scanDevicesError: string = '';
  devices: any[] = [];
  devices_mac_filter: any[] = [];
  rssiValue: number = 0; // Inicializa com um valor padrão


  constructor(
    private navCtrl : NavController,
    private bluetoothSerial: BluetoothSerial,
    private alertContrl : AlertController,
    //private bluetoothLE : BluetoothLE,
    private ble: BLE,
    private geolocation: Geolocation
    ) {
    
    }

    filterMacAddr(){
      const alert = this.alertContrl.create({
        inputs:[
        {
          placeholder: 'MAC ID',
          attributes: {
            maxlength: 17,
          },
  
        }],
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("confirm cancel")
            }
          },
          {
            text: "Salvar",
            handler: () => {
              
              //()=> {
                //this.listarTarefa();
              //}
            }
            }]
        });
      }
    
    @ViewChild('mylbl', { read: ElementRef }) mylbl!: ElementRef;

    @ViewChild('newContainer', { read: ElementRef }) newContainer!: ElementRef;

    @ViewChild('newItem', { static: true }) newItem!: TemplateRef<any>;

    @ViewChild('itemValor', { read: ElementRef }) itemValor!: TemplateRef<any>;

    crate_mac_input() {
      const newItem = this.newItem.createEmbeddedView(null).rootNodes[0];
      newItem.querySelector('ion-input').value = '';
      
      this.newContainer.nativeElement.appendChild(newItem);
    }

    mac_validate(itemValor: any) {
      //const teste_array = [];
      //teste_array.push({name: "ble", rssi: -51, id: '0A.00.27.00.00.08'})
      const macAddressRegex = /^([0-9A-Fa-f]{2}[:.]){5}([0-9A-Fa-f]{2})$/;
      //filterCondition = (item: any) => item.category === 'Category A';
      console.log(this.devices)
      if (macAddressRegex.test(itemValor) ) {
        console.log("Valid MAC address");
        const foundItem = this.devices.find(mac => mac.id === itemValor); //variavel que armazena o item achado
      
          if (foundItem) {
            console.log("MAC é valido e existe no teste_array:", foundItem);
            console.log(this.mylbl)
    
            // Adiciona a nova label ao container
              
            const newItem = this.newItem.createEmbeddedView(null).rootNodes[0];
            newItem.querySelector('ion-input').value = '';
          
            this.newContainer.nativeElement.appendChild(newItem);

            
            this.devices.push(itemValor);
            console.log(this.devices)

          } else {
            console.log("MAC não é valido e não existe no array");
          }
        }
      }

      
  filterDeviceMacAddr(itemValor: any){
    //6 pares de bites
    this.devices = [];
    this.devices = [itemValor];
    console.log(this.devices)
  }
  // Função para calcular a posição de um dispositivo no círculo baseado no RSSI
  getDevicePosition(rssi: number, device_mac: any): string {
    const angle = (rssi + 100) * 1.8; 
    const x = 150 + 100 * Math.cos((angle * Math.PI) / 180);
    const y = 150 + 100 * Math.sin((angle * Math.PI) / 180);
    return `translate(${x}px, ${y}px)`;
  }

  // Função para simular a detecção de dispositivos BLE próximos
  simulateScan() {
    this.devices = [
      { name: 'Device 1', rssi: -90 },
      { name: 'Device 2', rssi: -70 },
      // Adicione mais dispositivos com nomes e RSSI simulados
    ];
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

  navBluetoothHome() {
    this.navCtrl.navigateForward('tabs')
  }

  navRadarBLE() {
    this.navCtrl.navigateForward('radar-ble')
    
  }

  
}
