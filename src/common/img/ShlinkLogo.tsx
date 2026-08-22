import { brandColor } from '@shlinkio/shlink-frontend-kit';

export interface ShlinkLogoProps {
  color?: string;
  className?: string;
}

export const ShlinkLogo = ({ color = brandColor(), className }: ShlinkLogoProps) => (
  <svg className={className} viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="30" cy="29" r="20" />
      <path d="M43.5 43.5 56 56" />
    </g>
  </svg>
);
