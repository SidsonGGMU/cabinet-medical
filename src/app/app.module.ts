import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SecretaryComponent } from './secretary/secretary.component';
import { PatientComponent } from './patient/patient.component';
import { InfirmierComponent } from './infirmier/infirmier.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatOptionModule, MatSelectModule,MatDividerModule,MatCardModule
} from "@angular/material";


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { CabinetMedicalService } from './cabinet-medical.service';


@NgModule({
  declarations: [
    AppComponent,
    SecretaryComponent,
    PatientComponent,
    InfirmierComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CabinetMedicalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
