import {Component, Input} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent {
  @Input() numberFormGroup!: FormGroup;

  @Input() numberFormControlName!: string;

  canSubtract = true;

  get control() {
    return this.numberFormGroup.controls[this.numberFormControlName];
  }

  add() {
    const value = this.control.value;
    this.canSubtract = value + 1 >= 2;
    this.control.setValue(value + 1)
  }

  remove() {
    const value = this.control.value;
    this.canSubtract = value - 1 >= 2;
    this.control.setValue(value - 1)
  }
}
