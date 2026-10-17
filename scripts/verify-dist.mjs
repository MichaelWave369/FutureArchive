import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {PAGE_BASE,artworkPath} from '../src/site-paths.mjs';

const root=resolve(import.meta.dirname,'..');
const projects=JSON.parse(await readFile(join(root,'src/catalog.json'),'utf8'));
const html=await readFile(join(root,'dist/index.html'),'utf8');
const numbers=Array.from(html.matchAll(/data-print="(\d{2})"/g),match=>match[1]);
assert.deepEqual(numbers,projects.map(project=>project.number),'The HTML must already contain the whole gallery before React hydrates.');
assert.equal(html.includes('<!--app-html-->'),false);
assert.equal(html.includes('future-archive.microneesia79.chatgpt.site'),false,'Pages metadata must point to the GitHub edition.');
assert.ok(html.includes('https://michaelwave369.github.io/FutureArchive/'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const project of projects){
  for(const width of [undefined,320,640]){
    const filename=artworkPath(project,width).slice(PAGE_BASE.length);
    const original=await readFile(join(root,'public',filename));
    const published=await readFile(join(root,'dist',filename));
    assert.equal(hash(original),hash(published),'Artwork changed during build: '+filename);
  }
}
const images=(await readdir(join(root,'dist/artworks'))).filter(name=>name.endsWith('.webp'));
assert.equal(images.length,54);
const internalAssets=Array.from(html.matchAll(/(?:src|href)="(\/FutureArchive\/(?:assets|artworks)\/[^"?]+)"/g),match=>match[1]);
assert.ok(internalAssets.length>=24);
for(const asset of internalAssets)assert.ok((await stat(join(root,'dist',asset.slice(PAGE_BASE.length)))).isFile(),asset);
assert.equal(/(?:src|href)="\/(?:assets|artworks)\//.test(html),false,'Root-relative assets would break on GitHub Pages.');
assert.ok(html.includes('Original GLO concept: Dustin'));
console.log(JSON.stringify({result:'PASS',pre_rendered_prints:numbers.length,unchanged_artwork_assets:images.length,pages_base:PAGE_BASE,checked_asset_references:internalAssets.length}));
