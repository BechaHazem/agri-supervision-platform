import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExploitationsComponent } from './components/exploitations/exploitations.component';
import { ParcellesComponent } from './components/parcelles/parcelles.component';
import { CapteursComponent } from './components/capteurs/capteurs.component';
import { MeteoComponent } from './components/meteo/meteo.component';
import { AlertsComponent } from './components/alerts/alerts.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exploitations', component: ExploitationsComponent },
  { path: 'exploitations/:id/parcelles', component: ParcellesComponent },
  { path: 'capteurs', component: CapteursComponent },
  { path: 'meteo', component: MeteoComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
