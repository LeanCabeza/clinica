import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './page/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPanelComponent } from './page/admin-panel/admin-panel.component';
import { PacientePanelComponent } from './page/paciente-panel/paciente-panel.component';
import { TurnosService } from './service/turnos.service';
import { UsuariosService } from './service/usuarios.service';
import { EspecialistaPanelComponent } from './page/especialista-panel/especialista-panel.component';
import { HoraFormatoPipe } from './pipes/horaFormato.pipe';
import { UserIconPipe } from './pipes/userIcon.pipe'; 
import { EstadoTurnoPipe } from './pipes/estadoTurno.pipe';
import { ExpandOnHoverDirective } from './directives/expand-on-hover.directive';
import { HighlightRowDirective } from './directives/highlight-row.directive';
import { HighlightElementDirective } from './directives/highlight-element.directive';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    MyProfileComponent,
    AdminPanelComponent,
    PacientePanelComponent,
    EspecialistaPanelComponent,
    HoraFormatoPipe,
    UserIconPipe,
    EstadoTurnoPipe,
    ExpandOnHoverDirective,
    HighlightRowDirective,
    HighlightElementDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    MatSnackBarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:  [TurnosService,UsuariosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
