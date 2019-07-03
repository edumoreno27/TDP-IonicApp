import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { WidgetProvider } from '../servicios/widgets/widget';
import { UserProvider } from '../servicios/users/user';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.page.html',
  styleUrls: ['./modal-order.page.scss'],
})
export class ModalOrderPage implements OnInit {
  order: any;
  orders: Array<any> = [];      
  description: any;
  constructor(public _mcl: ModalController, public route: ActivatedRoute, public _wp: WidgetProvider, public _us: UserProvider) {
    this.order = this.route.snapshot.paramMap.get('order');
    this._wp.loadStorage().then(data => {
      this.orders = this._wp.orders;
      this.initializeArray(this.order);      
    });


  }

  ngOnInit() {
  }

  initializeArray(order) {
    for (let i = 0; i < this.orders.length; i++) {
      if (order == this.orders[i].order) {
        this.orders[i].selected = true;
        this.orders[i].position = i;
        this.description = this.orders[i].description;
      } else {
        this.orders[i].selected = false;
        this.orders[i].position = i;
      }
    }
  }

  ChangeOrder(obj) {     
    
    let indexaux = this.orders.indexOf(obj);
    let index = 0;
    for (let i = 0; i < this.orders.length; i++) {
      if (this.order == this.orders[i].order) {
        index = i;        
      }
    }    
    
    let orderaux = this.orders[indexaux].order;
    let descriptionaux = this.orders[indexaux].description;
    let selectedaux = this.orders[indexaux].selected;
    
    this.orders[indexaux].order = this.orders[index].order;
    this.orders[indexaux].description = this.orders[index].description;
    this.orders[indexaux].selected = this.orders[index].selected;

    this.orders[index].order = orderaux;
    this.orders[index].description = descriptionaux;
    this.orders[index].selected = selectedaux;    

  }

  updateOrderWidget() {

    this._us.loadStorage().then(data => {
      this._wp.updateOrderWidget(this._us.user.id, this.orders).then(orders => {
        this._wp.saveStorage(orders).then(data => {
          this.orders = this._wp.orders;
          for (let i = 0; i < this.orders.length; i++) {
            if(this.orders[i].description == this.description){
              this.order=this.orders[i].order;
            }
          }
          this.initializeArray(this.order);
        });

      });
    });
  }
}
