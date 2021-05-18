import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() showMap: boolean;

  @Output() updateShowMap = new EventEmitter<boolean>();

  router: string;
  constructor(public _router: Router, public auth: AuthService) {
    this.router = _router.url;
  }

  ngOnInit(): void {

  }

  toggleShowMap(){
    this.showMap = !this.showMap;
    this.updateShowMap.emit(this.showMap);
  }

}
