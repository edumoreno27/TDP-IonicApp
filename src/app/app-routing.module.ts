import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },   { path: 'modal-order', loadChildren: './modal-order/modal-order.module#ModalOrderPageModule' },
  { path: 'popup-menu', loadChildren: './popup-menu/popup-menu.module#PopupMenuPageModule' },   { path: 'informationmirror', loadChildren: './informationmirror/informationmirror.module#InformationmirrorPageModule' }
 

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
