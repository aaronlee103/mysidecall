// Scribble icons for the quick-start cards — same family as the mascot:
// dark-brown rounded strokes, one terracotta accent, a tiny face.  [NEW — hackathon]
const INK = "#28211d";
const ACC = "#df6b46";
const base = { fill: "none", stroke: INK, strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" };
const face = (x, y, w = 7) => (
  <>
    <path {...base} strokeWidth="2.2" d={`M${x} ${y}v1.2M${x + w} ${y}v1.2`} />
    <path {...base} strokeWidth="2" d={`M${x + 1} ${y + 3.6}c${w / 2 - 1.2} 1.4 ${w / 2 + 1.2} 1.4 ${w - 2} 0`} />
  </>
);

export function PlateIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path {...base} d="M13.5 25.6c-.3-6 4.9-11 10.6-10.9 5.9.1 10.7 5 10.3 11-.4 5.9-5.3 9.8-11 9.6-5.6-.2-9.7-4-9.9-9.7z" />
      {face(20.4, 24.2, 7.4)}
      <path {...base} stroke={ACC} d="M7 16v17M4.6 16v4.8c0 1.7 1 2.7 2.4 2.7s2.4-1 2.4-2.7V16" />
      <path {...base} d="M41 16c2.2 2.8 2.2 6.6 0 9v8" />
    </svg>
  );
}

export function RouterIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path {...base} d="M8 29.4c-.2-2.1 1.2-3.5 3.3-3.6l25.6-.2c2.1 0 3.4 1.3 3.4 3.3v5.3c0 2-1.3 3.3-3.3 3.3H11.4c-2.1 0-3.3-1.3-3.4-3.2z" />
      {face(16.5, 30.8, 6)}
      <circle cx="32.5" cy="32.7" r="1.4" fill={ACC} />
      <circle cx="36.8" cy="32.7" r="1.4" fill={ACC} />
      <path {...base} d="M36 25.5v-7" />
      <circle cx="36" cy="16" r="2.1" fill={ACC} stroke="none" />
      <path {...base} stroke={ACC} strokeWidth="2.4" d="M16 17.6c4.4-4 11.6-4 16 0M19.8 13.4c2.3-2 6.1-2 8.4 0" />
    </svg>
  );
}

export function HouseIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path {...base} d="M8.5 23.5 23.4 9.9c.4-.3.9-.3 1.2 0L39.5 23.3" />
      <path {...base} d="M13 20.5v16.4c0 1.5 1 2.5 2.5 2.5h17c1.5 0 2.5-1 2.5-2.5V20.7" />
      <path {...base} stroke={ACC} d="M20.6 39.4v-8.2c0-1.4.9-2.3 2.3-2.3h2.2c1.4 0 2.3.9 2.3 2.3v8.2" />
      {face(19.6, 23.8, 8.8)}
      <path {...base} stroke={ACC} strokeWidth="2.4" d="M38.8 27.8c-1 1.4-1 2.8 0 3.5 1-.7 1-2.1 0-3.5z" />
    </svg>
  );
}

export function PlaneIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path {...base} d="M9.5 22.8 38.2 11.2c.8-.3 1.5.4 1.2 1.2L28.9 36.8c-.3.7-1.3.8-1.7.1l-5.4-8.7-11.6-3.6c-.9-.3-.9-1.4-.7-1.8z" />
      <path {...base} strokeWidth="2.2" d="M21.8 28.2 38.6 12.1" />
      <path {...base} strokeWidth="2.2" d="M21.8 28.2l-1.1 7 4.2-4.9" />
      {face(27.8, 19.4, 5.4)}
      <path {...base} stroke={ACC} strokeWidth="2.4" d="M5.5 31.5h6.5M7.5 36.5h4.5" />
    </svg>
  );
}

export const QUICK_ICONS = { restaurant: PlateIcon, isp: RouterIcon, landlord: HouseIcon, travel: PlaneIcon };
