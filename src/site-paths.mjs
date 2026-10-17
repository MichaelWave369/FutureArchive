export const PAGE_BASE = '/FutureArchive/';
export const GITHUB_OWNER = 'MichaelWave369';
export const asset = (file) => PAGE_BASE + 'artworks/' + file;
export function artworkPath(project, width) {
  return asset(project.number + '-' + project.slug + (width ? '-' + width : '') + '.webp');
}
export function repositoryUrl(project) {
  return 'https://github.com/' + GITHUB_OWNER + '/' + project.repo;
}
export function readLocation(href, categories) {
  const url = new URL(href);
  const category = url.searchParams.get('category');
  const volume = url.searchParams.get('volume');
  return {
    query: (url.searchParams.get('q') || '').slice(0, 200),
    category: categories.includes(category) ? category : 'all',
    volume: ['1', '2', '3'].includes(volume) ? volume : 'all',
  };
}
export function viewUrl(href, filters, activeNumber) {
  const url = new URL(href);
  ['q', 'category', 'volume'].forEach(key => url.searchParams.delete(key));
  if (filters.query.trim()) url.searchParams.set('q', filters.query.trim());
  if (filters.category !== 'all') url.searchParams.set('category', filters.category);
  if (filters.volume !== 'all') url.searchParams.set('volume', filters.volume);
  if (activeNumber) url.hash = 'print-' + activeNumber;
  else if (/^#print-\d{2}$/.test(url.hash)) url.hash = '';
  return url;
}

/**
 * The Atlas is an independent curated living book. Deep-link only to chapters
 * in its published starter set; other prints open the Atlas entrance instead
 * of promising a chapter that may not have been approved by its visitor.
 */
export const FIELD_ATLAS_URL = 'https://michaelwave369.github.io/FieldAtlas/';
const curatedAtlasRepos = new Set([
  'SuperPhiVessel', 'PhiOS', 'parallax-pixelforge', 'SiliconLouvre',
  'FieldDeck', 'Domistika', 'Auralith369', 'PhiMirrorHex', 'GiltHouse',
]);
export function atlasChapterUrl(project) {
  const url = new URL(FIELD_ATLAS_URL);
  if (project && curatedAtlasRepos.has(project.repo)) url.searchParams.set('chapter', project.repo);
  return url.href;
}
