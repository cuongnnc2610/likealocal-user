import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() type: string = 'dark';
  @Output() confirmEvent = new EventEmitter();
  @Input() id: string;

  constructor(
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void { }
}
