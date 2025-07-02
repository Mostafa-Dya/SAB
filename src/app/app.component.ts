import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApproveComponent } from './components/approve/approve.component';
import { MainComponent } from './components/main/main.component';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SAB';
}
