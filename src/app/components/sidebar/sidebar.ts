import { NgComponentOutlet } from '@angular/common';
import { Component, inject, signal, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LucideCalculator,
  LucideFilePlus, 
  LucideLayoutDashboard, 
  LucideSquareKanban 
} from '@lucide/angular';
import { AuthService } from '../../services/auth.service';

export type MenuItem = {
  label: string;
  route: string;
  icon: Type<any>;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: LucideLayoutDashboard },
  { label: 'Kanban', route: '/kanban', icon: LucideSquareKanban },
  { label: 'Novo Pedido', route: '/novo-pedido', icon: LucideFilePlus },
  { label: 'Orçamento', route: '/orcamento', icon: LucideCalculator },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgComponentOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly menuItems = MENU_ITEMS;
  readonly isOpen = signal(false);
  readonly isCollapsed = signal(false);
  readonly authService = inject(AuthService);

  readonly handleLogout = async (): Promise<void> => {
    await this.authService.signOut();
  };

  readonly toggleSidebar = () => {
    this.isOpen.update((isOpen) => !isOpen);
  };

  readonly closeSidebar = () => {
    this.isOpen.set(false);
  };

  readonly toggleCollapse = () => {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  };
}
