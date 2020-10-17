import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';;
import{Page1Component} from './page1/page1.component';
import{Page2Component} from './page2/page2.component';
import{Page3Component} from './page3/page3.component';
import{Page4Component} from './page4/page4.component';
import{Page5Component} from './page5/page5.component';
import{Page6Component} from './page6/page6.component';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path:'Page1', component:Page1Component},
    {path:'Page2', component:Page2Component},
    {path:'Page3', component:Page3Component},
    {path:'page4', component:Page4Component},
    {path:'page5', component:Page5Component},
    {path:'page6', component:Page6Component}
   
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
