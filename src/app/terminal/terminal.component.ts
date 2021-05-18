import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  current_view: string = "alerts";

  constructor() { }

  ngOnInit(): void {
  }

  showalerts(){
    this.current_view = "alerts"
  }

  showweather(){
    this.current_view = "weather"
  }

  showinfo(){
    this.current_view = "info"
  }

  
}
