// +page.server.ts
export function load() {
  const adId = 'AD-' + Math.floor(Math.random() * 1000000);
  return { adId };
}
