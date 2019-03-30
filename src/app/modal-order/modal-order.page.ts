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
  orders: string[];
  color1: string;
  arreglo: Array<any> = [];
  colores: string[];
  enviar:Array<any>=[];
  constructor(public _mcl: ModalController, public route: ActivatedRoute,public proveedor:GadgetsProvider,public _us:UsuariosProvider) {
    this.order = this.route.snapshot.paramMap.get('orden');
    this.orders = (this.route.snapshot.paramMap.get('orders')).split(',');
    console.log(this.order);
    console.log(this.orders);
    //     this.route.params.subscribe(params => {
    //       this.order = params['orden']; 
    //       this.orders = params['orders']; 

    //  });
    this.inicializarArreglo(this.order);
  }

  ngOnInit() {
  }

  // async dismiss() {
  //   this._mcl.dismiss();
  // }

  inicializarArreglo(order) {
    for (let i = 0; i < this.orders.length; i++) {
      if (order == this.orders[i]) {
        let objeto = { order: this.orders[i], seleccionado: true, posicion: i };
        this.arreglo.push(objeto);
      } else {
        let objeto = { order: this.orders[i], seleccionado: false, posicion: i };
        this.arreglo.push(objeto);
      }
    }
  }

  CambiarOrden(obj) {
    this.enviar=[];
    let objeto=undefined;
    for (let i = 0; i < this.arreglo.length; i++) {
      if (this.order == this.arreglo[i].order) {
        objeto = { order: this.arreglo[i].order, seleccionado: true, posicion: i };
      }
    }
    this.order=obj.order;
    this.arreglo[objeto.posicion].order=obj.order;
    this.arreglo[obj.posicion].order=objeto.order;
    
    
    
    console.log(this.arreglo);
    for (let i = 0; i < this.arreglo.length; i++) {
      this.enviar.push(this.arreglo[i].order);

    } 

    this._us.cargar_storage().then(data => {
      this.proveedor.actualizarOrder(this._us.usuario.id,this.enviar).then(orders => {
          this.enviar=orders;
      }); 
    });
    console.log(this.enviar)
  }

   
}
