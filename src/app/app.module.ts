import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { MapComponent } from './map/map.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MyInfrastructuresComponent } from './myinfrastructures/myinfrastructures.component';
import { InfrastructureformComponent } from './infrastructureform/infrastructureform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TerminalComponent } from './terminal/terminal.component';
import { InfrastructureviewComponent } from './infrastructureview/infrastructureview.component';
import { MyfleetComponent } from './myfleet/myfleet.component';
import { VesselformComponent } from './vesselform/vesselform.component';
import { VesselviewComponent } from './vesselview/vesselview.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FleetpageComponent } from './fleetpage/fleetpage.component';
import { InfrastructurespageComponent } from './infrastructurespage/infrastructurespage.component';
import { DetailsComponent } from './details/details.component';
import { FleetdetailsComponent } from './fleetdetails/fleetdetails.component';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { GraphComponent } from './graph/graph.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertDetailComponent } from './alert-detail/alert-detail.component';
import { GraphImuComponent } from './graph-imu/graph-imu.component';
import { MapLayersComponent } from './map-layers/map-layers.component'
import { environment } from '../environments/environment';



const config: SocketIoConfig = { url: environment.baseUrl, options: {} };


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LandingpageComponent,
    ToolbarComponent,
    MyInfrastructuresComponent,
    InfrastructureformComponent,
    TerminalComponent,
    InfrastructureviewComponent,
    MyfleetComponent,
    VesselformComponent,
    VesselviewComponent,
    HomepageComponent,
    FleetpageComponent,
    InfrastructurespageComponent,
    DetailsComponent,
    FleetdetailsComponent,
    ModalBasicComponent,
    GraphComponent,
    AlertsComponent,
    AlertDetailComponent,
    GraphImuComponent,
    MapLayersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    LayoutModule,
    NgbModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
