import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, BarChart2, ChevronDown, TrendingUp, Calendar, User, FileText, Truck, Key, Users, UserPlus, ShieldCheck, LogOut } from 'lucide-angular';

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


