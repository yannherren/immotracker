import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  @Input()
  options!: FormGroup;

  @Input()
  roomOptions: number[] = []

  @Output()
  setFilter = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
  }



  selectedRoomCount: number[] = [2.5, 2]

}
