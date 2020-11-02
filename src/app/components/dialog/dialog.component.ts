import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('myModal') public dialog: ModalDirective;
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() type: string = 'dark';
  @Output() confirmEvent = new EventEmitter();
  @Input() id: string;

  constructor(
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void { }

  show(content?: string, type?: string) {
    if (content) { this.content = content; }
    if (type) {
      if (type === 'error')
        this.type = 'danger';
      else if (type === 'warning')
        this.type = 'warning';
      else if (type === 'success')
        this.type = type;
    }
    this.dialog.show();
  }

  hideModal() {
    document.body.classList.remove('modal-open');
    const modalContainer = document.querySelector('modal-container');
    if (modalContainer !== null)
      modalContainer.parentNode.removeChild(modalContainer);
  }

  hide() {
    this.content = '';
    this.type = 'dark';
    this.dialog.hide();
  }

  setId(id?: string) {
    this.id = id;
  }

  close() {
    this.confirmEvent.emit({ id: this.id, action: 'CLOSE' });
  }
}
