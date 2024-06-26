import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../services/accountservices/account.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, RouterModule, RouterOutlet],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  form: any = {
    employeeId: null,
    name: null
  };
  isRegSuccessful = false;
  isRegFailed = false;
  recoveryPhrase = '';
  errorMessage = '';

  constructor(private router: Router, private eat: AccountService) { }

  onRegister(): void {
    const { employeeId, name } = this.form;

    this.eat.register(employeeId, name).subscribe({

      next: data => {

        window.alert('Response:\n' + data.Response + ' - ' + data.status + '\nTrxID:\n' + data.TransactionID + '\nPhrases:\n' + this.eat.getRecoveryPhrase(),);

        this.isRegSuccessful = true;
        this.isRegFailed = false;

        //Return the recovery phrase
        console.log('Reg Details\n' + this.eat.getRecoveryPhrase());
        this.recoveryPhrase = 'Reg Details\n' + this.eat.getRecoveryPhrase();


        //redirect to login page
        this.router.navigate(['/api/login']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isRegFailed = true;
        //throw new Error('Employee registration failed\n' + err.error.message);
      }
    });
  }

}
