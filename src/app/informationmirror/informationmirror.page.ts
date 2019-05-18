import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informationmirror',
  templateUrl: './informationmirror.page.html',
  styleUrls: ['./informationmirror.page.scss'],
})
export class InformationmirrorPage implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }
  Close(){
    this.router.navigate(['/home']);
    
  }
}
