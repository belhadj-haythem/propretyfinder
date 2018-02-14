import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FinderComponent } from './components/finder/finder.component';
import { HttpModule } from '@angular/http';
import { FinderService } from './Services/finder.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatCardModule,
  MatSelectModule,
  MatSnackBarModule,
  MatListModule,
  MatToolbarModule
} from '@angular/material';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    FinderComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule,
    MatButtonToggleModule,
    MatCardModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule
  ],
  providers: [FinderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
