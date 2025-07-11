import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <!-- Sidebar Toggle -->
      <input type="checkbox" id="sidebar-toggle" class="sidebar-toggle" />
      <label for="sidebar-toggle" class="sidebar-hamburger">
        <span></span><span></span><span></span>
      </label>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span class="logo-text">Registro Académico</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-section-label">Principal</span>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeSidebar()" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span>Inicio</span>
            </a>
            <a routerLink="/estudiantes" routerLinkActive="active" (click)="closeSidebar()" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Estudiantes</span>
            </a>
            <a routerLink="/carreras" routerLinkActive="active" (click)="closeSidebar()" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <span>Carreras</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="user-details">
              <span class="user-name">Administrator</span>
              <span class="user-role">Sistema</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Backdrop -->
      <div class="sidebar-backdrop" (click)="closeSidebar()"></div>

      <!-- Main Content -->
      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', sans-serif;
    }

    .layout {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    .sidebar-toggle {
      display: none;
    }

    .sidebar-hamburger {
      position: fixed;
      top: 1rem;
      left: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      cursor: pointer;
      z-index: 1101;
      background: #ffffff;
      border-radius: 8px;
      padding: 0.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      transition: all 0.3s ease;
    }

    .sidebar-hamburger:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .sidebar-hamburger span {
      display: block;
      height: 3px;
      width: 100%;
      background: #334155;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .sidebar-toggle:checked ~ .sidebar-hamburger span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .sidebar-toggle:checked ~ .sidebar-hamburger span:nth-child(2) {
      opacity: 0;
    }

    .sidebar-toggle:checked ~ .sidebar-hamburger span:nth-child(3) {
      transform: rotate(-45deg) translate(8px, -8px);
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1100;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 2rem;
      height: 2rem;
      color: #3b82f6;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0;
    }

    .nav-section {
      margin-bottom: 2rem;
    }

    .nav-section-label {
      display: block;
      padding: 0 1rem 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      margin: 0 0.5rem;
      border-radius: 8px;
    }

    .nav-link:hover {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .nav-link.active {
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }

    .nav-link.active::before {
      content: '';
      position: absolute;
      left: -0.5rem;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 1.5rem;
      background: #3b82f6;
      border-radius: 2px;
    }

    .nav-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .user-info:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .user-avatar {
      width: 2.25rem;
      height: 2.25rem;
      background: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .user-avatar svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #ffffff;
    }

    .user-role {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .sidebar-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1099;
      backdrop-filter: blur(2px);
    }

    .sidebar-toggle:checked ~ .sidebar {
      transform: translateX(0);
    }

    .sidebar-toggle:checked ~ .sidebar-backdrop {
      display: block;
    }

    .main-content {
      flex: 1;
      margin-left: 0;
      padding: 2rem;
      overflow-y: auto;
      height: 100vh;
      background: #f8fafc;
    }

    @media (min-width: 1024px) {
      .sidebar-hamburger {
        display: none;
      }

      .sidebar {
        transform: translateX(0);
        position: fixed;
        height: 100vh;
        width: 280px;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
      }

      .sidebar-backdrop {
        display: none !important;
      }

      .main-content {
        margin-left: 280px;
        width: calc(100% - 280px);
      }
    }

    /* Scrollbar personalizado para el contenido principal */
    .main-content::-webkit-scrollbar {
      width: 8px;
    }

    .main-content::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .main-content::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
    }

    .main-content::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `]
})
export class NavbarComponent {
  closeSidebar() {
    const toggle = document.getElementById('sidebar-toggle') as HTMLInputElement;
    if (toggle) toggle.checked = false;
  }
}