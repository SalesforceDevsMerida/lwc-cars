import { LightningElement, wire } from "lwc";
import getCars from "@salesforce/apex/CarController.getCars";
import carSelected from "@salesforce/messageChannel/CarSelected__c";
import carsFiltered from "@salesforce/messageChannel/CarsFiltered__c";
import {
  publish,
  MessageContext,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE
} from "lightning/messageService";

export default class CarList extends LightningElement {
  filter = "";

  @wire(MessageContext)
  messageContext;

  @wire(getCars, { filter: "$filter" })
  cars;

  carClickHandler(event) {
    let target = event.target;
    while (!target.dataset.id) {
      target = target.parentElement;
    }
    const { id } = target.dataset;
    publish(this.messageContext, carSelected, {
      carId: id
    });
  }
  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        carsFiltered,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage({ filters }) {
    console.log({ filters });
    this.filter = 'WHERE Name LIKE \'%' + filters.name +'%\'';
    console.log(this.filter);
  }
  connectedCallback() {
    this.subscribeToMessageChannel();
  }
  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
