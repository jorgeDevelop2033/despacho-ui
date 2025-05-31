import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, BarChart2, ChevronDown, TrendingUp, Calendar, User, FileText, Truck, Key, Users, UserPlus, ShieldCheck, LogOut } from 'lucide-angular';
import { AppComponent } from './src/app/app.component';
import { routes } from './src/app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home, BarChart2, ChevronDown, TrendingUp, Calendar, User, FileText, Truck, Key, Users, UserPlus, ShieldCheck, LogOut
      })
    )
  ]
});