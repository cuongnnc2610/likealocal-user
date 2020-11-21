import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
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
