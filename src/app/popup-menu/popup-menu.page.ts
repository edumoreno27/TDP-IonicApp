import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.page.html',
  styleUrls: ['./popup-menu.page.scss'],
})
export class PopupMenuPage implements OnInit {

  constructor( private router: Router,private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }
  async Info() {
    try {
      await this.popoverCtrl.dismiss({
        Tipo: 1
      });
      
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }
  async CerrarSesion() {
    try {
      await this.popoverCtrl.dismiss({
        Tipo: 2
      });
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }

}
