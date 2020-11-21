import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from 'rxjs/operators';
import {TermsOfUseService} from '../../_services';
import {DialogComponent} from '../../components';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tour-booking',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild('modalConfirmUpdate') modalConfirmUpdate: ModalDirective;

  public data: string;
  public dataChange: string;
  public ckeConfig: any;
  public msgUpdateTermsOfUseFail: string = 'The terms of service has been updated failure';
  public msgDataRequired: string = 'Please enter the terms of service';
  public msgGetTermsOfUseFail: string = 'The terms of service has been get failure';
  public msgUpdateTermsOfUseSuccess: string = 'The terms of service has been updated';

  constructor(
    public termsOfUseService: TermsOfUseService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.translateLang();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      language: 'en',
    };
    this.spinner.show();
    this.termsOfUseService.getTermsOfUse()
      .pipe(first())
      .subscribe(
        (result: any) => {
          this.spinner.hide();
          this.data = '';
          this.dataChange = '';
          if (result.data) {
            this.data = result.data.content_en;
            this.dataChange = result.data.content_en;
          }
        },
        (error) => {
          this.spinner.hide();
          this.dialog.show(this.msgGetTermsOfUseFail, 'error');
        }
      );
  }

  //TRANSLATE
  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }

  update() {
    this.modalConfirmUpdate.hide();
    this.spinner.show();
    this.termsOfUseService.updateTermsOfUse({'content_en': this.data}).subscribe(
      result => {
        this.spinner.hide();
        this.dialog.show(this.msgUpdateTermsOfUseSuccess, 'success');
      }, (error) => {
        this.spinner.hide();
        this.dialog.show(this.msgUpdateTermsOfUseFail, 'error');
      });
  }

  public onEditorChange( event: any) {
    this.dataChange = event.editor.getData();
  }

  openModalConfirmUpdate() {
    this.data = this.dataChange;
    if (!this.data || this.data === '') {
      this.dialog.show(this.msgDataRequired, 'error');
    } else {
      this.modalConfirmUpdate.show();
    }
  }
}

