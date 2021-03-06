import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatchesOrderPipe} from '../servicios/filter/filter';
import { IonicModule } from '@ionic/angular';

import { ModalOrderPage } from './modal-order.page';

const routes: Routes = [
  {
    path: '',
    component: ModalOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalOrderPage,MatchesOrderPipe]
})
export class ModalOrderPageModule {}
