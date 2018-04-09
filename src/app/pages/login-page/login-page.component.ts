import { Component, OnInit } from '@angular/core';
import { Login } from '../../models/login';
import { CommonService } from '../../services/common-servces/common.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  login:Login = new Login();
  constructor(private service: CommonService) { }

  ngOnInit() {
  }

  logar() {
    this.service.login(this.login);
  }

}
