import { Component, TemplateRef } from '@angular/core';
import { LoginComponent } from '../../pages/login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LoginComponent,
    MatDialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], // Corrected the typo
})
export class HeaderComponent {
  constructor(private dialog: MatDialog) {}

  openModal() {
    this.dialog.open(LoginComponent, {
      width: '500px'  // Optional: set the width of the modal
    });
   
  }
}
