import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup,Validators,FormControl } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService, MultiLanguageService } from "../../../_services";

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})
export class ResetPwdComponent implements OnInit {
  public resetLink = '';
  public codeResponse = '';
  public matchPassword = true;
  public showError = false;
  public isResetSumitted = false;
  public changePassword: FormGroup;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public multiLanguageService: MultiLanguageService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetLink = Object.getOwnPropertyNames(params)[0];
    });
  }

  ngOnInit(): void {
    this.onInitFormResetPassword();
  }

  onInitFormResetPassword() {
    this.changePassword = new FormGroup({
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
      ]),
      retypePass: new FormControl("", [
        Validators.required
      ])
    });
  }

  get validPassword() {
    return this.changePassword.get("password");
  }

  get validConfirmPassword() {
    return this.changePassword.get("retypePass");
  }

  get f() {
    return this.changePassword.controls;
  }

  switchLang() {
    this.multiLanguageService.switchLang();
  }

  onChangeValue() {
    this.matchPassword = true;
  }

 /** CALL API */
  onSubmit() {
    this.matchPassword = true;
    this.isResetSumitted = true;
    if (this.changePassword.invalid) {
      return;
    }
    if (this.f.password.value !== this.f.retypePass.value) {
      this.matchPassword = false;
      return;
    }
    this.showError = false;
    this.authenticationService
      .changePassword(this.resetLink, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.code !== 'C000') {
            this.showError = true;
            this.codeResponse = data.code;
            return;
          }
          this.isResetSumitted = false;
          this.route.navigate(['/login']);
        },
        (error) => {}
      )
  }
}
