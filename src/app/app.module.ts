import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SupabaseClient} from "@supabase/supabase-js";
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {LineChartModule, NumberCardModule} from "@swimlane/ngx-charts";
import {MatCardModule} from "@angular/material/card";
import { OptionsComponent } from './options/options.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule, MatSelectionList, SELECTION_LIST, SelectionList} from "@angular/material/list";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    OptionsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        LineChartModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatChipsModule,
        MatListModule,
        ReactiveFormsModule,
        MatButtonModule,
        NumberCardModule,
    ],
  providers: [{provide: SupabaseClient, useValue: {}}, {provide: SELECTION_LIST, useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
