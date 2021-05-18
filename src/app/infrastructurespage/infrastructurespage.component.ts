import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-infrastructurespage',
  templateUrl: './infrastructurespage.component.html',
  styleUrls: ['./infrastructurespage.component.css']
})
export class InfrastructurespageComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

}
