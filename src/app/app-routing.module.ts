import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor.service';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FleetpageComponent } from './fleetpage/fleetpage.component';
import { InfrastructurespageComponent } from './infrastructurespage/infrastructurespage.component';
import {FleetdetailsComponent} from "./fleetdetails/fleetdetails.component";
import {DetailsComponent} from "./details/details.component";



const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent
  },
  {
    path: 'dashboard',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myinfrastructures',
    component: InfrastructurespageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'myfleet',
    component: FleetpageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/:view',
    component: HomepageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule { }
