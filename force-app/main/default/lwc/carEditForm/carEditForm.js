import { api, LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import CAR_NAME_FIELD from "@salesforce/schema/Car__c.Name";
import CAR_MAKE_FIELD from "@salesforce/schema/Car__c.Make__c";
import CAR_MSRP_FIELD from "@salesforce/schema/Car__c.MSRP__c";
import CAR_CATEGORY_FIELD from "@salesforce/schema/Car__c.Category__c";
import CAR_FUEL_TYPE_FIELD from "@salesforce/schema/Car__c.Fuel_Type__c";
import CAR_NUMBER_OF_SEATS_FIELD from "@salesforce/schema/Car__c.Number_of_Seats__c";
import CAR_CONTROL_FIELD from "@salesforce/schema/Car__c.Control__c";
import { getFieldDisplayValue, getFieldValue } from "lightning/uiRecordApi";
import { getRecordNotifyChange } from "lightning/uiRecordApi";
import saveCarDetails from "@salesforce/apex/CarController.saveCarDetails";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const fields = [
  CAR_NAME_FIELD,
  CAR_MAKE_FIELD,
  CAR_MSRP_FIELD,
  CAR_CATEGORY_FIELD,
  CAR_FUEL_TYPE_FIELD,
  CAR_NUMBER_OF_SEATS_FIELD,
  CAR_CONTROL_FIELD
];

export default class CarEditForm extends LightningElement {
  @api editRecordId;

  successHandler() {
    const evt = new ShowToastEvent({
      title: "Exito!",
      message: "Datos almacenados satisfactoriamente",
      variant: "success"
    });
    this.dispatchEvent(evt);
    const success = new CustomEvent('success');
    this.dispatchEvent(success);
  }
  errorHandler(event) {
    console.log("on error");
    console.log(event);
  }
  @api
  isValid(){
    const inputElements = this.template.querySelectorAll('lightning-input-field');
    inputElements.forEach(input => {
      console.log(input.value);
    });
  }
}
