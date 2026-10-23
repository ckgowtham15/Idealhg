import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `<header><a routerLink="/"><b>IDEAL HG</b> – Order Processing SOP – HÖRMANN</a></header><main><router-outlet /></main>`,
})
export class App {}
