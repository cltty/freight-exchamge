import { Component, OnInit } from '@angular/core';

const names = [
  {
    name: "Frequently asked questions",
    route: "#"
  },
  {
    name: "Sign in",
    route: "login"
  },
  {
    name: "Get Started",
    route: "get-started"
  }  
];

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public names: any[] = names;

  constructor() { }

  ngOnInit(): void {
  }

}
