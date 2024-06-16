import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];
  constructor() { }

  private showAlert(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  showStandard(message : string) {
    this.showAlert(message,{delay: 5000 });
  }

  showSuccess(message : string) {
    this.showAlert(message, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(message : string) {
    this.showAlert(message, { classname: 'bg-danger text-light', delay: 10000 });
  }

}
