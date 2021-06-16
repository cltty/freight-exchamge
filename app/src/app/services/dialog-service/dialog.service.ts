import { ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, Type, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public dialogComponent: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public showDialog<T>(container: ViewContainerRef, component: Type<T>, inputs: { name: string; value: any }[]) {
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(component);
    this.dialogComponent = container.createComponent(componentFactory);
    this.setInputs(inputs);
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

  public closeEventEmitter(): EventEmitter<any> {
    return this.dialogComponent.instance.closeEventEmitter;
  }

  public trueEventEmitter(): EventEmitter<any> {
    return this.dialogComponent.instance.afirmativeEventEmitter;
  }
}
