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
