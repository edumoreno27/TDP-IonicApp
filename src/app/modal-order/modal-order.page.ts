import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GadgetsProvider } from '../servicios/gadgets/gadget';
import { UsuariosProvider } from '../servicios/usuarios/usuarios';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.page.html',
  styleUrls: ['./modal-order.page.scss'],
})
export class ModalOrderPage implements OnInit {
  order: any;
  orders: Array<any> = [];
  color1: string;
  arreglo: Array<any> = [];
  colores: string[];
  enviar: Array<any> = [];
  description: any;
  constructor(public _mcl: ModalController, public route: ActivatedRoute, public proveedor: GadgetsProvider, public _us: UsuariosProvider) {
    this.order = this.route.snapshot.paramMap.get('orden');
    this.proveedor.cargar_storage().then(data => {
      this.orders = this.proveedor.orders;
      this.inicializarArreglo(this.order);
      console.log(this.order);
      console.log(this.orders);
    });


    //     this.route.params.subscribe(params => {
    //       this.order = params['orden']; 
    //       this.orders = params['orders']; 

    //  });

  }

  ngOnInit() {
  }

  // async dismiss() {
  //   this._mcl.dismiss();
  // }

  inicializarArreglo(order) {
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

  CambiarOrden(obj) {
    console.log(obj);
    this.enviar = [];
    let objeto = undefined;
    let indexaux = this.orders.indexOf(obj);
    let indice = 0;
    for (let i = 0; i < this.orders.length; i++) {
      if (this.order == this.orders[i].order) {
        indice = i;
        console.log(i);
        ///objeto = { description: this.orders[i].description, order: this.orders[i].order, selected: true, position: i };
      }
    }
    // this.order = obj.order;
    
    let orderaux = this.orders[indexaux].order;
    let descriptionaux = this.orders[indexaux].description;
    let selectedaux = this.orders[indexaux].selected;
    console.log(orderaux);
    this.orders[indexaux].order = this.orders[indice].order;
    this.orders[indexaux].description = this.orders[indice].description;
    this.orders[indexaux].selected = this.orders[indice].selected;

    this.orders[indice].order = orderaux;
    this.orders[indice].description = descriptionaux;
    this.orders[indice].selected = selectedaux;




    console.log(this.orders);

  }

  actualizargadgets() {

    this._us.cargar_storage().then(data => {
      this.proveedor.actualizarOrder(this._us.usuario.id, this.orders).then(orders => {
        this.proveedor.guardar_storage(orders).then(data => {
          this.orders = this.proveedor.orders;
          for (let i = 0; i < this.orders.length; i++) {
            if(this.orders[i].description == this.description){
              this.order=this.orders[i].order;
            }

          }
          this.inicializarArreglo(this.order);
        });

      });
    });
  }
}
