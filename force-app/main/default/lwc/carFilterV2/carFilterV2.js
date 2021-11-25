import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import carsFiltered from "@salesforce/messageChannel/CarsFiltered__c";

export default class CarFilterV2 extends LightningElement {
  timeout;
  @wire(MessageContext)
  messageContext;

  changeHandler(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const { value } = event.detail;
      publish(this.messageContext, carsFiltered, {
        filters: {
          name: value
        }
      });
    }, 200);
  }
}
