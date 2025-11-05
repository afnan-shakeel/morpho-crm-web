import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from './side-bar/side-bar';
import { TopBar } from './top-bar/top-bar';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, SideBar, TopBar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {

}
