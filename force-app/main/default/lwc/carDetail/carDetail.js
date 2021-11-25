import { api, LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import CAR_NAME_FIELD from "@salesforce/schema/Car__c.Name";
import CAR_PICTURE_FIELD from "@salesforce/schema/Car__c.Picture_URL__c";
import CAR_MAKE_FIELD from "@salesforce/schema/Car__c.Make__c";
import CAR_MSRP_FIELD from "@salesforce/schema/Car__c.MSRP__c";
import CAR_CATEGORY_FIELD from "@salesforce/schema/Car__c.Category__c";
import CAR_FUEL_TYPE_FIELD from "@salesforce/schema/Car__c.Fuel_Type__c";
import CAR_NUMBER_OF_SEATS_FIELD from "@salesforce/schema/Car__c.Number_of_Seats__c";
import CAR_CONTROL_FIELD from "@salesforce/schema/Car__c.Control__c";
import { getFieldDisplayValue, getFieldValue } from "lightning/uiRecordApi";
import carSelected from "@salesforce/messageChannel/CarSelected__c";

import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";

const fields = [
  CAR_NAME_FIELD,
  CAR_PICTURE_FIELD,
  CAR_MAKE_FIELD,
  CAR_MSRP_FIELD,
  CAR_CATEGORY_FIELD,
  CAR_FUEL_TYPE_FIELD,
  CAR_NUMBER_OF_SEATS_FIELD,
  CAR_CONTROL_FIELD
];

export default class CarDetail extends LightningElement {
  @api recordId;
  @api showDisplayDetailsButton;
  subscription;

  @wire(MessageContext)
  messageContext;

  showEditForm = false;

  @wire(getRecord, { recordId: "$recordId", fields: fields })
  car;

  get name() {
    return getFieldValue(this.car.data, CAR_NAME_FIELD);
  }

  get pictureUrl() {
    return getFieldValue(this.car.data, CAR_PICTURE_FIELD);
  }

  get category() {
    return getFieldValue(this.car.data, CAR_CATEGORY_FIELD);
  }

  get make() {
    return getFieldValue(this.car.data, CAR_MAKE_FIELD);
  }

  get msrp() {
    return getFieldDisplayValue(this.car.data, CAR_MSRP_FIELD);
  }

  get fuelType() {
    return getFieldValue(this.car.data, CAR_FUEL_TYPE_FIELD);
  }

  get numberOfSeats() {
    return getFieldValue(this.car.data, CAR_NUMBER_OF_SEATS_FIELD);
  }

  get control() {
    return getFieldValue(this.car.data, CAR_CONTROL_FIELD);
  }

  buttonClickHandler() {
    this.showEditForm = !this.showEditForm;
  }
  successHandler() {
    this.showEditForm = false;
  }
  printButtonClickHandler() {
    const editForm = this.template.querySelector("c-car-edit-form");
    editForm.print();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        carSelected,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage({ carId }) {
    this.recordId = carId;
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }
  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
