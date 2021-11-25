import { LightningElement, wire } from "lwc";
import getCars from "@salesforce/apex/CarController.getCars";
import carSelected from "@salesforce/messageChannel/CarSelected__c";
import { publish, MessageContext } from "lightning/messageService";

export default class CarList extends LightningElement {
  @wire(MessageContext)
  messageContext;

  @wire(getCars)
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
}
