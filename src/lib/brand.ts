import {
  siAsana, siAtlassian, siBox, siFigma, siGithub, siGmail, siGooglecalendar, siGoogledrive, siHubspot,
  siLinear, siMiro, siNotion, siSentry, siStripe, siSupabase, siVercel,
} from "simple-icons";

export interface Brand {
  /** 24x24 SVG path from the simple-icons set (CC0). */
  path: string;
  color: string;
}

const ICONS: Record<string, { path: string; hex: string }> = {
  notion: siNotion, linear: siLinear, github: siGithub, sentry: siSentry, vercel: siVercel, supabase: siSupabase,
  figma: siFigma, miro: siMiro, asana: siAsana, atlassian: siAtlassian, stripe: siStripe, gmail: siGmail,
  gcal: siGooglecalendar, gdrive: siGoogledrive, hubspot: siHubspot, box: siBox,
};

const luminance = (hex: string): number => {
  const n = parseInt(hex, 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

/** Returns the logo for a connector id, or null when the icon set doesn't have one (a monogram is used instead).
 *  Near-black logos use the page's text color so they stay visible in dark mode. */
export function brandOf(id: string): Brand | null {
  const icon = ICONS[id];
  if (!icon) return null;
  return { path: icon.path, color: luminance(icon.hex) < 0.25 ? "var(--ink)" : `#${icon.hex}` };
}

export const hasLogo = (id: string): boolean => id in ICONS;

// Services without a logo in the icon set get a short monogram tile. Two characters keep them tell-apart-able.
const MONOGRAMS: Record<string, string> = { slack: "Sl", canva: "Ca", context7: "C7", deepwiki: "DW", playwright: "Pw", m365: "MS" };
export const monogram = (id: string, name: string): string => MONOGRAMS[id] ?? name.charAt(0);
