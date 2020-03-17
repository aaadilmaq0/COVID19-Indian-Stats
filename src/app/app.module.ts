import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from "./app.component";
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatButtonModule, FormsModule, MatIconModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
