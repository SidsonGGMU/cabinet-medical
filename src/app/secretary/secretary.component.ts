import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CabinetInterface } from '../dataInterfaces/cabinet';
import { CabinetMedicalService } from '../cabinet-medical.service';
import { sexeEnum } from '../dataInterfaces/sexe';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {

  private _cms: CabinetInterface;
  public get cms(): CabinetInterface { return this._cms; }

  public cabinet: CabinetInterface = {
    infirmiers: [],
    patientsNonAffectés: [],
    adresse: null
  };

  patientName: string;

  patientForName: string;

  patientNumber: string;

  patientSex: sexeEnum;

  patientBirthday: string;

  patientFloor: string;

  patientStreetNumber: string;

  patientStreet: string;

  patientPostalCode: number;

  patientCity: string;


  @ViewChild("form") form: ElementRef;

  constructor(public cabinetService: CabinetMedicalService, private refElem: ElementRef) {
    this.initCabinet(this.cabinetService);
   }

  ngOnInit() {
  }

  async initCabinet(cabinetMedicalService) {
    this._cms = await cabinetMedicalService.getData('/data/cabinetInfirmier.xml');
    console.log(this.cms);
  }

  submit(): void {

    console.log(this.patientSex);

    let allValid = true;

    let field = this.refElem.nativeElement.querySelectorAll('input, select');

    for (let i = 0; i < field.length; i++) {
      if (!field[i].reportValidity()) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      this.cabinetService.addPatient(
        {
          nom: this.patientName,
          prénom: this.patientForName,
          numéroSécuritéSociale: this.patientNumber,
          sexe: this.patientSex,
          naissance: this.patientBirthday.split("/").reverse().join("-"),
          adresse:{
              étage : this.patientFloor,
              numéro: this.patientStreetNumber,
              rue: this.patientStreetNumber,
              codePostal: this.patientPostalCode,
              ville: this.patientCity
          }
        } 
      );
    }
  }
}