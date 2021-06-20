import { ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Type, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public dialogComponent: ComponentRef<any>;
  public addressDialogComponent: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public showDialog<T>(container: ViewContainerRef, component: Type<T>, inputs: { name: string; value: any }[]) {
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(component);
    this.dialogComponent = container.createComponent(componentFactory);
    this.setInputs(inputs);
  }

  public showAddressDialog<T>(container: ViewContainerRef, component: Type<T>, inputs: { name: string; value: any }[]) {
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(component);
    this.addressDialogComponent = container.createComponent(componentFactory);
  }

  private setInputs(inputs) {
    inputs.forEach(input => {
      this.dialogComponent.instance[input.name]  = input.value;
    });
  }

  public hideDialog(subscriptions: Subscription[]) {
    this.dialogComponent.destroy();
    this.dialogComponent.onDestroy(() => {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    });
  }

  public hideAddressDialog(subscriptions: Subscription[]) {
    this.addressDialogComponent.destroy();
    this.addressDialogComponent.onDestroy(() => {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    });
  }

  public closeEventEmitter(): EventEmitter<any> {
    return this.dialogComponent.instance.closeEventEmitter;
  }

  public closeAddressDialogEventEmitter(): EventEmitter<any> {
    return this.addressDialogComponent.instance.closeAddressEventEmitter;
  }

  public successEventEmitter(): EventEmitter<any> {
    return this.dialogComponent.instance.successEventEmitter;
  } 

  public trueEventEmitter(): EventEmitter<any> {
    return this.dialogComponent.instance.afirmativeEventEmitter;
  }

  public addressSelectedEventEmitter(): EventEmitter<any> {
    return this.addressDialogComponent.instance.addressSelectedEventEmitter;
  }
}
