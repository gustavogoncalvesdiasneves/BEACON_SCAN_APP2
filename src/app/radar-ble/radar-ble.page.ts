import { Component, NgZone, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, TemplateRef, numberAttribute } from '@angular/core';
import { NavController } from '@ionic/angular';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
//import { error } from 'console';
import { BLE } from '@ionic-native/ble/ngx';
import {
  BleClient,
  dataViewToText,
  numbersToDataView,
  ScanResult,
} from '@capacitor-community/bluetooth-le';//import { Gyroscope } from 'ionic-native';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';



@Component({
  selector: 'app-radar-ble',
  templateUrl: './radar-ble.page.html',
  styleUrls: ['./radar-ble.page.scss'],
})

export class RadarBlePage {

  activateBluetoothError: string = '';
  scanDevicesError: string = '';
  devices: any[] = [];
  devices_filter: any[] = [];
  rssiValue: number = 0; // Inicializa com um valor padrão
  selectedDevice: any = null; // Inicialmente nulo
  //deviceIds: string[]=[];
  deviceIds: any[] = []; //this.devices.map(device => device.id);
  //arrowRotation: number = 0; // Defina um valor inicial adequado
  //arrowRotation = '0deg';
  accelerationX!: number;
  accelerationY!: number;
  accelerationZ!: number;
  latitude_coords!: any;
  longitude_coords!: any;
  arrowRotation!: number; // Initialize with an initial rotation angle
  cordinates_gyroscopy!: any;

  advertisingDataParsed: any;
  device_advertising: any;

  logs: string[] = [];

  bluetoothScanResults: ScanResult[] = [];
  bluetoothIsScanning = false;


  constructor(
    private navCtrl : NavController,
    private bluetoothSerial: BluetoothSerial,
    private alertContrl : AlertController,
    //private bluetoothLE : BluetoothLE,
    private ble: BLE,
    // private ble: BleServices,
    ) {
      
      // BleClient.initialize({ androidNeverForLocation: true });
    }
    

    async addDevice() {
      const alert = await this.alertContrl.create({
        header: 'Selecione um Dispositivo',
        inputs: this.devices.map(device => ({
          type: 'radio',
          label: device.id,
          value: device,
        })),
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Adicionar',
            handler: (selectedDevice:any) => {
              if (selectedDevice) {
                // Verifique se o dispositivo já não está na lista de filtros
                const existsInFilter = this.devices_filter.some(device => device.id === selectedDevice.id);
  
                if (!existsInFilter) {
                  // Adicione o dispositivo selecionado à lista de filtros
                  this.devices_filter.push(selectedDevice);
  
                  // Encontre o índice do dispositivo na lista de IDs
                  const index = this.devices.findIndex(device => device.id === selectedDevice.id);
  
                  // Se o dispositivo estiver na lista de IDs, remova-o pelo índice
                  if (index !== -1) {
                    this.devices.splice(index, 1);
                  }
                }
              }
            },
          },
        ],
      });
  
      await alert.present();
    }
  
    
    
    @ViewChild('mylbl', { read: ElementRef }) mylbl!: ElementRef;

    @ViewChild('newContainer', { read: ElementRef }) newContainer!: ElementRef;

    @ViewChild('newItem', { static: true }) newItem!: TemplateRef<any>;

    @ViewChild('itemValor', { read: ElementRef }) itemValor!: TemplateRef<any>;

    crate_mac_input() {
      
      const newItem = this.newItem.createEmbeddedView(null).rootNodes[0];
      newItem.querySelector('ion-input').value = '';
      
      this.newContainer.nativeElement.appendChild(newItem);
      //Teste position:
      this.devices.push({name: 'myPos', id: '00.00.00.00.00.0F', rssi: 0 })

      //Teste dispositivo 2
      //this.devices.push({name: 'Device', id: '00.00.00.00.00.2F', rssi: -90 })
      console.log(this.devices)
    }

    mac_validate(itemValor: any) {
      //deviceIds: string[] = this.devices.map(device => device.id);
      
      //const teste_array = [];
      //teste_array.push({name: "ble", rssi: -51, id: '0A.00.27.00.00.08'})
      const macAddressRegex =  /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      //     /^([0-9A-Fa-f]{2}[:.]){5}([0-9A-Fa-f]{2})$/;
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

            
            this.devices_filter.push(foundItem);
            console.log(this.devices_filter)

          } else {
            console.log("MAC não é valido e não existe no array");
          }
        }
      }

      filterDevices() {
        if (this.selectedDevice) {
          //this.deviceIds.push(this.devices.map(device => device.id))
          const device_filter = this.devices.filter(device => device.id === this.selectedDevice);
           // Adiciona a nova label ao container
              
           const newItem = this.newItem.createEmbeddedView(null).rootNodes[0];
           newItem.querySelector('ion-input').value = '';
         
           this.newContainer.nativeElement.appendChild(newItem);

           this.devices_filter.push(device_filter);
            console.log(this.devices_filter)

        } else {
          this.devices_filter = this.devices.slice(); // Se nenhum dispositivo for selecionado, copie todos os dispositivos para a lista filtrada.
        }
      }

      getDevicePosition(rssi: number, device_mac: any): string {
        const center = 150; // Posição central do círculo
        const maxDistance = 100; // Distância máxima do centro
      
        if (rssi === 0) {
          return `translate(${center}px, ${center}px)`;
        }
      
        // Calcule a distância em relação ao centro com base no valor absoluto do RSSI
        const distance = (Math.abs(rssi) / 100) * maxDistance;
      
        // Calcule o ângulo com base no RSSI
        const angle = (rssi > 0 ? 1 : -1) * Math.acos(distance / maxDistance) * (180 / Math.PI);
      
        const x = center + distance * Math.cos((angle * Math.PI) / 180);
        const y = center + distance * Math.sin((angle * Math.PI) / 180);
        return `translate(${x}px, ${y}px)`;
      }
      
      
      
  // Função para calcular a posição de um dispositivo no círculo baseado no RSSI
  //getDevicePosition(rssi: number, device_mac: any): string {
  //  const angle = (rssi + 100) * 1.8; 
  //  const x = 150 + 100 * Math.cos((angle * Math.PI) / 180);
  //  const y = 150 + 100 * Math.sin((angle * Math.PI) / 180);
  //  return `translate(${x}px, ${y}px)`;
  //}

  // Função para simular a detecção de dispositivos BLE próximos
  simulateScan() {
    this.devices = [
      { name: 'Device 1', rssi: -90 },
      { name: 'Device 2', rssi: -70 },
      // Adicione mais dispositivos com nomes e RSSI simulados
    ];
  }

  

  activateBluetooth2() {
    // this.deviceIds.push({name: 'Device1',id: '0A.00.27.00.00.08', rssi: -52})
    // this.deviceIds.push({name: 'Device2', id: '0A.00.27.00.00.02', rssi: -32})
    console.log(this.deviceIds)
    this.bluetoothSerial.isEnabled().then(response => {
      this.isEnabled('IsOn');
    }).catch(error => {
      this.activateBluetoothError = 'Erro ao ativar o Bluetooth: ' + error.message;
      this.isEnabled('IsOff');
    })
  }

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

  scanForDevices2() {
    this.devices = []; // Limpa a lista de dispositivos antes de escanear novamente
    if (this.devices_filter.length >= 1){
      this.ble.scan(this.devices_filter, 5).subscribe(device => {
        // console.log(device);
        this.devices.push(this.devices_filter);
        console.log("if (this.devices_filter.length >= 1)")
        //this.updateDeviceIds(); // Atualiza a lista de IDs após adicionar um dispositivo
      });
    } else {
      this.ble.scan([], 5).subscribe(device => {
        console.log(device);
        const convertedData = this.convertAdvertisingData(device.advertising, device);
        // const dataNumbersParse = this.advertisingDataParsed
        const convertedDevice = {
          name: device.name,
          id: device.id,
          rssi: device.rssi,

          advertisingData: convertedData,
          // advertisingDataParsed: dataNumbersParse,

        };
        this.devices.push(convertedDevice);
        console.log("else scanForDevices()")
        //this.updateDeviceIds(); // Atualiza a lista de IDs após adicionar um dispositivo
      });
    } 
  }

  
  convertAdvertisingData(data: ArrayBuffer, device: any): string {
    // const dataView = new DataView(data);
    const dataView = new Uint8Array(data);

    //Convert Bits 

    const bitsArray = new Uint8Array(dataView.buffer);

    const totalBits = bitsArray.length * 8;

    let bitsString = '';
    for (let i = 0; i < bitsArray.length; i++) {
      bitsString += bitsArray[i].toString(2).padStart(8, '0'); // Convert each number to an 8-bit binary string
    }

    // console.log('Total Bits:', totalBits);
    this.logs.push('Total Bits:', String(totalBits));
    // console.log('Bits String:', bitsString);
    this.logs.push('Bits String:', String(bitsString));

    // Get Temperature
  
    


    // Get Battery Percentage
    const battery = {
      service: "180F",
      level: "2A19"
    };

    
    // const batteryLevel = this.readBatteryLevel(device.id)    
    const batteryLevel = dataView[0]
    // const teste_battery_beacon_h = dataView.getUint8(2);

    const otherData_1 = dataView[1]; 
    const otherData_2 = dataView[2];
    const otherData_3 = dataView[3];

    this.logs.push('Battery Percentage:', String(batteryLevel));
    this.logs.push('OtherData_1: dataView.getUint8(1)', String(otherData_1));
    this.logs.push('OtherData_2 dataView.getUint8(2):', String(otherData_2));
    this.logs.push('OtherData_3 dataView.getUint8(3):', String(otherData_3));
  
    // Agora você pode usar batteryPercentage ou otherData conforme necessário

    // test led color:

    const data_led = new Uint8Array(1);
    // para exibir ou manipular em seu aplicativo.
  
    return `
            Total Bits: ${totalBits};\n
            Bits String: ${bitsString};\n
            Battery Percentage: ${batteryLevel}%;\n
            Other Data_1: ${otherData_1};\n
            otherData_2 dataView.getUint8(2):, ${otherData_2};\n
            otherData_3 dataView.getUint8(3):, ${otherData_3}\n
            `;
  }

  // Read Battery Porcentage 0x180
  readBatteryLevel(deviceId: string) {
    const battery = {
      service: "180F",
      level: "2A19"
    };
    try{
    this.ble.read(deviceId, battery.service, battery.level).then(
      data => {
        // console.log("Battery Level is " + data[0] + "%");
        const batteryLevel = new Uint8Array(data)
        this.logs.push("Battery Level is " + batteryLevel[0] + "%" + " , deviceId: " + deviceId);
        return String(data[0] + "%");
      }
    );
    } catch (error) {
      this.logs.push('Error readBatteryLevel(deviceId): ', String(error));
    }

  }

  readAccelerometerData(deviceId: string) {
    const accelerometer = {
      service: "F000AA10-0451-4000-B000-000000000000",
      data: "F000AA11-0451-4000-B000-000000000000", // read/notify 3 bytes X : Y : Z
      configuration: "F000AA12-0451-4000-B000-000000000000", // read/write 1 byte
      period: "F000AA13-0451-4000-B000-000000000000" // read/write 1 byte Period = [Input*10]ms
    };
    try {
      this.ble.startNotification(deviceId, accelerometer.service, accelerometer.data)

      //later on...

      this.ble.read(deviceId, accelerometer.service, accelerometer.configuration).then(
        data => {
          const values = new Uint8Array(data);
          let message;
          message = "X: " + values[0]/64 + "\n\n" +
          "Y: " + values[1]/64 + "\n\n" +
          "Z: " + values[2]/64 * -1;
          this.logs.push("Accelerometer Data: " + message);

        }
    )} catch (error) {
      this.logs.push('Error readAccelerometerData(deviceId): ', String(error));
    }
  }

  async startAccelerometerNotifications(deviceId: string) {
    const accelerometer = {
      service: "F000AA10-0451-4000-B000-000000000000",
      data: "F000AA11-0451-4000-B000-000000000000", // read/notify 3 bytes X : Y : Z
      configuration: "F000AA12-0451-4000-B000-000000000000", // read/write 1 byte
      period: "F000AA13-0451-4000-B000-000000000000" // read/write 1 byte Period = [Input*10]ms
    };
    try {
      await this.ble.startNotification(deviceId,accelerometer.service,accelerometer.data);
      // console.log('Notificações do acelerômetro iniciadas');
      this.logs.push('Notificações do acelerômetro iniciadas');
      let configData = new Uint8Array(1);
      configData[0] = 0xFF;
      this.ble.write(deviceId, accelerometer.service, accelerometer.configuration, configData.buffer).then((res) => {
        this.logs.push('Accelerometer is on');
        this.logs.push('res: ' + String(res));
      })
    } catch (error) {
      this.logs.push('Erro ao iniciar notificações do acelerômetro:', String(error));
    }
  }

  connectDeviceBle(deviceId: string) {
    this.ble.connect(deviceId).subscribe((response) =>{
      this.logs.push('Connected to ' + String(deviceId)),
      this.logs.push('response: ' + String(response))
    });
  }

  parseAdvertisingData(data: ArrayBuffer): { [key: number]: DataView } {
    const bytes = new Uint8Array(data);
    let i = 0;
    const advertisingData: { [key: number]: DataView } = {};
  
    while (i < bytes.length) {
      const length = bytes[i++];
      if (length === 0) break; // Length 0 is not allowed
  
      const type = bytes[i++];
      const value = data.slice(i, i + length - 1);
      i += length - 1;
  
      advertisingData[type] = new DataView(value);
    }
  
    return advertisingData;
  }

  
  
  // parseAdvertisingData(dataString: string): number[] {
  //   const dataNumbers = dataString.split(',').map(Number);
  //   this.advertisingDataParsed = dataNumbers;
  //   return this.advertisingDataParsed;
  // }

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
