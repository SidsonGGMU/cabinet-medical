//https://glitch.com/edit/#!/l3m-projet

import { Adresse } from './dataInterfaces/adresse';
import { InfirmierInterface } from './dataInterfaces/infirmier';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CabinetInterface } from './dataInterfaces/cabinet';
import { PatientInterface } from './dataInterfaces/patient';
import { sexeEnum } from './dataInterfaces/sexe';

@Injectable({
  providedIn: 'root'
})
export class CabinetMedicalService {

  private _cabinet: CabinetInterface;

  private _http: HttpClient;
  public get http(): HttpClient { return this._http; }

  constructor(http: HttpClient) {
    this._http = http;
  }

  // get Data from the server
  async getData(url: string): Promise<CabinetInterface> {
    try {
      const res: HttpResponse<string> = await this._http.get(url, { observe: 'response', responseType: 'text' }).toPromise();
      const parser = new DOMParser();
      const doc = parser.parseFromString(res.body, 'text/xml');
      // default cabinet
      const cabinet: CabinetInterface = {
        infirmiers: [],
        patientsNonAffectés: [],
        adresse: this.getAdressFrom(doc.querySelector('cabinet')),
      };
      // Get list of infermiers
      const infirmiersFromXML = Array.from(doc.querySelectorAll('infirmiers > infirmier'));
      cabinet.infirmiers = infirmiersFromXML.map(
        infXML => ({
          id: infXML.getAttribute('id'),
          prénom: infXML.querySelector('prénom').textContent,
          nom: infXML.querySelector('nom').textContent,
          photo: infXML.querySelector('photo').textContent,
          patients: [],
          adresse: this.getAdressFrom(infXML),

        })
      );
      // Get list of patients
      const patientsFromXML = Array.from(doc.querySelectorAll('patients > patient'));
      const patients: PatientInterface[] = patientsFromXML.map(
        patXML => ({
          prénom: patXML.querySelector('prénom').textContent,
          nom: patXML.querySelector('nom').textContent,
          sexe: patXML.querySelector('sexe').textContent === '0' ? sexeEnum.M : sexeEnum.F,
          naissance: patXML.querySelector('naissance').textContent,
          numéroSécuritéSociale: patXML.querySelector('numéro').textContent,
          adresse: this.getAdressFrom(patXML),
        })
      );
      // crier un tableau de couple <infirmier,patient>
      const affectations = patientsFromXML.map(
        (patXML, i) => {
          const visiteXML = patXML.querySelector('visite[intervenant]');
          let infirmier: InfirmierInterface = null;
          if (visiteXML != null) {
            infirmier = cabinet.infirmiers.find(inf =>
              inf.id === visiteXML.getAttribute('intervenant'));
          }
          return { patient: patients[i], infirmier: infirmier };

        });
      // Affectation des patients
      affectations.forEach(({ patient: P, infirmier: I }) => {
        (I != null) ? I.patients.push(P) : cabinet.patientsNonAffectés.push(P);
      });
      return cabinet;
    } catch (err) {
      console.error('ERROR in getData', err);
    }

  }
  // Get adresse from html Element
  getAdressFrom(root: Element): Adresse {
    let node: Element;
    return {
      ville: (node = root.querySelector('adresse > ville')) ? node.textContent : '',
      codePostal: (node = root.querySelector('adresse > codePostal')) ? parseInt(node.textContent, 10) : 0,
      rue: (node = root.querySelector('adresse > ville')) ? node.textContent : '',
      numéro: (node = root.querySelector('adresse > numéro')) ? node.textContent : '',
      étage: (node = root.querySelector('adresse > étage')) ? node.textContent : '',
    };

  }

  public async addPatient(patient: PatientInterface): Promise<PatientInterface> {
    const res = await this._http.post('/addPatient', {
      patientName: patient.nom,
      patientForname: patient.prénom,
      patientNumber: patient.numéroSécuritéSociale,
      patientSex: patient.sexe,
      patientBirthday: 'AAAA-MM-JJ',
      patientFloor: patient.adresse.étage,
      patientStreetNumber: patient.adresse.numéro,
      patientStreet: patient.adresse.rue,
      patientPostalCode: patient.adresse.codePostal,
      patientCity: patient.adresse.ville
    }, { observe: 'response' }).toPromise<HttpResponse<any>>();

    console.log('Add patient renvoie', res);
    return null;
  }

  public async affecter(infirmier_id : string, patient_securite_sociale : string): Promise<PatientInterface> {
    const res = await this._http.post('/affectation', {
      infirmier: infirmier_id,
      patient: patient_securite_sociale
    }, { observe: 'response' }).toPromise<HttpResponse<any>>();

    console.log('Affecter patient renvoie', res);
    return null;
  }
}

