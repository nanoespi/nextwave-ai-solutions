export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  if (!(window as any).plausible) return;
  (window as any).plausible(name, { props });
}
