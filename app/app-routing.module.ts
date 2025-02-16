import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
//import {EmptyComponent} from "./objects/empty/empty.component";
import {LoginComponent} from "./objects/login/login.component";
import { AdminComponent } from './objects/admin/admin.component';
import { TableComponent } from './objects/table/table.component';
import { MainComponent } from './objects/main/main.component';
import { ModificationComponent } from './objects/modifications/modifications.component';
import { AuthAlgorithm } from './algorithms/auth.algorithm';
import { LoginAlgorithm } from './algorithms/login.algorithm';
import { AuthGuard } from './algorithms/redirect.algorithm';
import { AddSpaceMarineComponent } from './objects/add/add.component';
import { EditSpaceMarineComponent } from './objects/edit/edit.component';
import { EditGuard } from './algorithms/edit.redirect.algorithm';
import { ImportComponent } from './objects/import/import.component';
import { CharactersComponent } from './objects/characters/characters.component';
import { ComputeComponent } from './objects/compute/compute.component';
import { UpdatesComponent } from './objects/updates/updates.component';
import { BuildsComponent } from './objects/builds/builds.component';
//import {MainComponent} from "./objects/main/main.component";

const path: Routes = [{path: '', redirectTo: "/authentify", pathMatch: "full"},
  {path: 'authentify', component: LoginComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'modifications', component: ModificationComponent, canActivate: [AuthGuard]},
  {path: 'import', component: ImportComponent, canActivate: [AuthGuard]},
  {path: 'create', component: AddSpaceMarineComponent, canActivate: [AuthGuard]},
  {path: 'edit-space-marine/:id', component: EditSpaceMarineComponent, canActivate: [EditGuard]},
  //{path: '**', component: LoginComponent},
  {path: 'characters', component: CharactersComponent},
  {path: 'compute', component: ComputeComponent},
  {path: 'updates', component: UpdatesComponent},
  {path: 'builds/:id', component: BuildsComponent},
  {path: '**', component: CharactersComponent}];

@NgModule({
  imports: [RouterModule.forRoot(path)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
