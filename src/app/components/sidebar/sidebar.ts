import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
    readonly isOpen = signal(false); // Signal to track the open/closed state of the sidebar

    readonly toggleSidebar = () => {
        this.isOpen.update((isOpen) => !isOpen);
    };

    readonly closeSidebar = () => {
        this.isOpen.set(false);
    }
}
