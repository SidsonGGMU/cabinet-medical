import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../dataInterfaces/patient';
import { InfirmierInterface } from '../dataInterfaces/infirmier';
import { CabinetMedicalService } from '../cabinet-medical.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  patientsNonAffecte: PatientInterface[] = [];
  infirmiers: InfirmierInterface[] = [];
  willAffectId: string = "none";

  constructor(private cabinetService: CabinetMedicalService) {

  }

  fetchData() {
    this.cabinetService.getData('/data/cabinetInfirmier.xml').then(data => {
      this.patientsNonAffecte = data.patientsNonAffectés;
      this.infirmiers = data.infirmiers;
      console.log(this.patientsNonAffecte)
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  affChanged(event) {
    console.log(this.willAffectId)
    if (this.willAffectId !== "none") {
      this.cabinetService.affecter(this.willAffectId.split("-")[0], this.willAffectId.split("-")[1])
        .then(data => {
          this.fetchData();
        })
        .catch(error => {
          console.log(error);
        })

      this.willAffectId = "none";
    }
  }
}