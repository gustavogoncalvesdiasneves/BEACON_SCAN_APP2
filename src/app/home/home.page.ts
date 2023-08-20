import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  { //implements OnInit

  constructor(private navCtrl : NavController) {}

  countdown: number = 3;

  ngOnInit() {
    const countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(countdownInterval);
        this.navCtrl.navigateForward('tabs');
      }
    }, 1000);
  }
  


  navigate_to_tabs(){
    this.navCtrl.navigateForward('tabs')
  }
}
