import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { local } from 'd3';
import { AuthentificationResponse } from 'src/app/models/firebase-response';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {

  constructor(
    private router : Router,
    private route : ActivatedRoute, 
    private authService : AuthService,
    private userService : UserService,
    private settingsService : SettingsService,
    private translate : TranslateService
    ) { }


  isSignUpPage : boolean = false;  
  connexionText : string = "Connection"; // Connection ou Inscription

  newUser : User = new User();

  errorMessage : string = "";


  pseudo : string = "";
  email : string = "";
  password : string = "";
  
  passwordConfirmation : string = "";

  ngOnInit() {

    this.route.params.subscribe((params) => {

      this.settingsService.initPage(this.translate);

      if (params['type'] == 'sign-up'){
        this.isSignUpPage = true;
        this.connexionText = this.translate.instant('SIGN UP');
      }
      else{
        this.isSignUpPage = false;
        this.connexionText = this.translate.instant('LOGIN');
      }

      console.log('ConnexionPage : isSignUpPage = ', this.isSignUpPage);

    });

  }


  // NAVIGATION

  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }

  goToSignUpPage(){
    this.router.navigate(['tabs/profile/sign-up']);
  }

  goToHomePage(){
    this.router.navigate(['/tabs/home']);
  }


  // FORM

  validForm(){
    if (this.isSignUpPage){
      return this.validSignUpForm() && this.validPassword();
    }
    else{
      return this.validLogInForm();
    }
  }

  // TODO : Vérifier si l'email est valide
  validLogInForm(){
    return this.email != "" && this.password != "";
  }

  // TODO : Vérifier si l'email est valide
  validSignUpForm(){
    return this.pseudo != "" && this.email != "" && this.password != "";
  }

  validPassword(){

    console.log(this.password?.length);

    return this.password!.length >= 6 && this.password == this.passwordConfirmation;
  }

  // AUTHENTIFICATION

  connexion(){
    if (this.isSignUpPage){
      this.signUp();
    }
    else{
      this.logIn();
    }
  }

  async signUp(){

    const response = await this.authService.signUp(this.email, this.password!, this.pseudo);
    
    this.userConnexionResult(response);
  }


  async logIn(){
    console.log(this.newUser);

    const response = await this.authService.login(this.email, this.password!);

    this.userConnexionResult(response);
  }


  async logInWithGoogle(){
    const response = await this.authService.loginWithGoogle();
    
    this.userConnexionResult(response);

  }


  async logInWithGitHub(){
    const response = await this.authService.loginWithGitHub();
    
    this.userConnexionResult(response);
    
  }


  userConnexionResult(response : AuthentificationResponse){
    if (response.user) {
      console.log('User logged in:', response.user);
      this.errorMessage = response.errorMessage;

      // Utilisateur connecté, retour à la page profil
      this.router.navigate(['tabs/profile']);
    } 
    else { // Erreur lors de la connexion

      console.log('Login failed');
      this.errorMessage = response.errorMessage;
    }
  }


  switchConnexionInscription(){
    this.isSignUpPage = !this.isSignUpPage;

    this.password = "";

    if (this.isSignUpPage){

      this.connexionText = this.translate.instant('SIGN UP');
    }
    else{
      this.connexionText = this.translate.instant('LOGIN');
    }
  }


  

}
