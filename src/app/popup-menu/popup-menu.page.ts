import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.page.html',
  styleUrls: ['./popup-menu.page.scss'],
})
export class PopupMenuPage implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }
  async Info() {
    try {
      await this.popoverCtrl.dismiss({
        Type: 1
      });
      
    } catch (e) {
      
    }
  }
  async SignOut() {
    try {
      await this.popoverCtrl.dismiss({
        Type: 2
      });
    } catch (e) {
      
    }
  }

}
