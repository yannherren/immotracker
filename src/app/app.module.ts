import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SupabaseClient} from "@supabase/supabase-js";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{provide: SupabaseClient, useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
