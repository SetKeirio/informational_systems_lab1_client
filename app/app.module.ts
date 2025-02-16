import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {Routes, RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { TableComponent } from './objects/table/table.component';
import { HatComponent } from './objects/hat/hat.component';
import { LoginComponent } from './objects/login/login.component';
import { BootsComponent } from './objects/boots/boots.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './objects/admin/admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthAlgorithm } from './algorithms/auth.algorithm';
import { MainComponent } from './objects/main/main.component';
import { ModificationComponent } from './objects/modifications/modifications.component';
import { AddSpaceMarineComponent } from './objects/add/add.component';
import { JwtInterceptor } from './algorithms/jwt.algorithm';
import { ChapterComponent } from './objects/chapter/chapter.component';
import { ChapterTableComponent } from './objects/chapters/chapters.component';
import { EditSpaceMarineComponent } from './objects/edit/edit.component';
import { ImportComponent } from './objects/import/import.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CharactersComponent } from './objects/characters/characters.component';
import { TopComponent } from './objects/top/top.component';
import { BoottomComponent } from './objects/bottom/bottom.component';
import { ComputeComponent } from './objects/compute/compute.component';
import { UpdatesComponent } from './objects/updates/updates.component';
import { BuildsComponent } from './objects/builds/builds.component';

@NgModule({
  declarations: [
    HatComponent,
    AppComponent,
    LoginComponent,
    BootsComponent,
    TableComponent,
    MainComponent,
    ModificationComponent,
    AddSpaceMarineComponent,
    AdminComponent,
    ChapterComponent,
    ChapterTableComponent,
    EditSpaceMarineComponent,
    ImportComponent,
    CharactersComponent,
    TopComponent,
    BoottomComponent,
    ComputeComponent,
    UpdatesComponent,
    BuildsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [AuthAlgorithm, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
