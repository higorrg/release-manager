import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Release, ReleaseService } from '../../services/release.service';

@Component({
  selector: 'app-release-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-dashboard.component.html',
  styleUrls: ['./release-dashboard.component.scss']
})
export class ReleaseDashboardComponent implements OnInit {
  private readonly releaseService = inject(ReleaseService);

  releases = signal<Release[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReleases();
  }

  loadReleases(): void {
    this.loading.set(true);
    this.error.set(null);
    this.releaseService.getReleases().subscribe({
      next: (data) => {
        this.releases.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load releases.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }
}
