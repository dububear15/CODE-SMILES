import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-about.html',
  styleUrls: ['./public-about.css']
})
export class PublicAboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutVideo') aboutVideo!: ElementRef<HTMLVideoElement>;

  isMuted = true;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const video = this.aboutVideo?.nativeElement;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            video.play().catch((err) => {
              console.warn('Video play blocked:', err);
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: [0, 0.25, 0.45, 0.7]
      }
    );

    this.observer.observe(video);
  }

  toggleMute(): void {
    const video = this.aboutVideo?.nativeElement;
    if (!video) return;

    video.muted = !video.muted;
    this.isMuted = video.muted;

    if (!video.paused) {
      video.play().catch((err) => {
        console.warn('Video replay blocked:', err);
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}