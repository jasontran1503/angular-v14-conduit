import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideAuthInterceptor } from './app/shared/data-access/auth.interceptor';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(
        [
          {
            path: '',
            loadComponent: () =>
              import('./app/layout/layout.component').then((m) => m.LayoutComponent),
            loadChildren: () => import('./app/layout/layout.routes').then((m) => m.layoutRoutes)
          }
        ],
        {
          useHash: true,
          scrollOffset: [0, 0],
          scrollPositionRestoration: 'top'
        }
      ),
      HttpClientModule
    ),
    provideAuthInterceptor()
  ]
}).catch((err) => console.error(err));
