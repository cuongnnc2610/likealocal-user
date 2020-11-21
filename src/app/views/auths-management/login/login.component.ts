import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup,Validators,FormControl } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService,MultiLanguageService } from "../../../_services";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public error = "";
  public codeResponse = '';
  public showError = false;
  public isLoginSubmitted = false;
  public userEmail: FormGroup;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public multiLanguageService: MultiLanguageService
  ) { }

  ngOnInit() {
    this.onInitFormLogin();
  }

  onInitFormLogin() {
    this.userEmail = new FormGroup({
      username: new FormControl("",
        [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"), Validators.maxLength(64)]
      ),
      password: new FormControl("",
        [Validators.required, Validators.minLength(6), Validators.maxLength(32)]
      ),
    });
    this.isLoginSubmitted = false;
  }

  get primEmail() {
    return this.userEmail.get("username");
  }
  get validPass() {
    return this.userEmail.get("password");
  }

  get f() {
    return this.userEmail.controls;
  }

  switchLang() {
    this.multiLanguageService.switchLang();
  }

  /** CALL API */
  onSubmit() {
    this.isLoginSubmitted = true
    if (this.userEmail.invalid) {
      return;
    }
    this.showError = false;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.code !== 20001) {
            this.showError = true;
            this.codeResponse = data.code;
            return;
          }
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.error = error;
        }
      );
  }
}
