import { Component, OnInit } from '@angular/core';
import { PatientInterface } from '../dataInterfaces/patient';
import { InfirmierInterface } from '../dataInterfaces/infirmier';
import { CabinetMedicalService } from '../cabinet-medical.service';

@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']
})
export class InfirmierComponent implements OnInit {

  patientsNonAffecte: PatientInterface[] = [];
  infirmiers: InfirmierInterface[] = [];
  willAffectId: string = "none";


  //@Output()
  //selectionChange: EventEmitter<MatSelectChange> = new EventEmitter();

  constructor(private cabinetService: CabinetMedicalService) {
  }

  fetchData() {
    this.cabinetService.getData('/data/cabinetInfirmier.xml').then(data => {
      //this.patientsNonAffecte = data.patientsNonAffectés;
      this.infirmiers = data.infirmiers;
      console.log(this.infirmiers)
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  affChanged(event) {
    console.log(this.willAffectId)
    if (this.willAffectId !== "none") {
      this.cabinetService.affecter("none", this.willAffectId)
        .then(data => {
          this.fetchData();
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

}