import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, MultiLanguageService } from '../../../_services';
import { first } from "rxjs/operators";

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.css']
})

export class EmailInputComponent implements OnInit {
  @ViewChild('inputEmail') inputEmail: ElementRef;

  public showError = false;
  public codeResponse = '';
  public verifiedEmail = false;
  public title = 'TITLE_SEND_MAIL';
  public isSendEmailSubmitted: boolean;
  public userEmail: FormGroup;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public multiLanguageService: MultiLanguageService
  ) { }

  ngOnInit() {
    this.onInitFormSendEmail();
  }

  onInitFormSendEmail() {
    this.isSendEmailSubmitted = false;
    this.userEmail = new FormGroup({
      primaryEmail: new FormControl("",
        [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"), Validators.maxLength(64)]
      ),
    });
  }

  get primEmail() {
    return this.userEmail.get('primaryEmail');
  }

  get f() {
    return this.userEmail.controls;
  }

  onChangeValue() {
    this.showError = false;
  }

  switchLang() {
    this.multiLanguageService.switchLang();
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  /** CALL API */
  sendEmail() {
    this.verifiedEmail = false;
    this.isSendEmailSubmitted = true;
    if (this.userEmail.invalid) {
      return;
    }
    this.showError = false;
    this.authenticationService.forgotPassword(this.f.primaryEmail.value)
      .pipe(first())
      .subscribe(
        (result) => {
          this.isSendEmailSubmitted = false;
          if (result.code != 20001) {
            this.showError = true;
            this.codeResponse = result.code;
            return;
          }
          this.showError = false;
          this.title = 'TITLE_CONFIRM_EMAIL';
          this.verifiedEmail = true;
        },
        (error) => {
          this.showError = true;
          this.isSendEmailSubmitted = false;
          this.verifiedEmail = false;
        }
      )
  }
}

