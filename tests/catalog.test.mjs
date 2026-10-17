import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectProjects,adjacentIndex} from '../src/gallery-model.mjs';
import {artworkPath,readLocation,viewUrl,PAGE_BASE} from '../src/site-paths.mjs';

const projects=JSON.parse(await readFile(new URL('../src/catalog.json',import.meta.url),'utf8'));
test('all eighteen artworks preserve their original order and identities',()=>{
  assert.deepEqual(selectProjects(projects).map(project=>project.number),Array.from({length:18},(_,index)=>String(index+1).padStart(2,'0')));
  assert.equal(new Set(projects.map(project=>project.slug)).size,18);
});
test('volume and category filters compose',()=>{
  assert.deepEqual(selectProjects(projects,{volume:'2'}).map(project=>project.number),['07','08','09','10','11','12']);
  assert.deepEqual(selectProjects(projects,{volume:'3',category:'Worlds & connection'}).map(project=>project.title),['PorchTalk']);
});
test('search supports multiple words, contributor credits, and the phi character',()=>{
  assert.deepEqual(selectProjects(projects,{query:'VR FITNESS'}).map(project=>project.number),['12']);
  assert.deepEqual(selectProjects(projects,{query:'Dustin'}).map(project=>project.number),['18']);
  assert.deepEqual(selectProjects(projects,{query:'phi vessel'}).map(project=>project.number),['03']);
});
test('empty searches and no-match searches remain predictable',()=>{
  assert.equal(selectProjects(projects,{query:'   '}).length,18);
  assert.equal(selectProjects(projects,{query:'zzzznomatch'}).length,0);
});
test('viewer navigation wraps and supports a one-print view',()=>{
  assert.equal(adjacentIndex(0,-1,18),17);
  assert.equal(adjacentIndex(17,1,18),0);
  assert.equal(adjacentIndex(0,1,1),0);
  assert.equal(adjacentIndex(0,1,0),0);
});
test('every full image and thumbnail stays beneath the case-sensitive Pages path',()=>{
  assert.equal(PAGE_BASE,'/FutureArchive/');
  for(const project of projects){
    for(const width of [undefined,320,640]){
      const path=artworkPath(project,width);
      assert.ok(path.startsWith('/FutureArchive/artworks/'));
      assert.ok(path.endsWith('.webp'));
    }
  }
});
test('shared print links retain the repository base and selected filters',()=>{
  const url=viewUrl('https://michaelwave369.github.io/FutureArchive/#collection',{query:'Dustin',category:'Discovery & care',volume:'3'},'18');
  assert.equal(url.pathname,'/FutureArchive/');
  assert.equal(url.hash,'#print-18');
  assert.equal(url.searchParams.get('q'),'Dustin');
  assert.equal(url.searchParams.get('category'),'Discovery & care');
  const closed=viewUrl(url.href,{query:'',category:'all',volume:'all'},null);
  assert.equal(closed.pathname,'/FutureArchive/');assert.equal(closed.search,'');assert.equal(closed.hash,'');
});
test('unrecognized URL filters are ignored and search text is bounded',()=>{
  const filters=readLocation('https://example.com/FutureArchive/?category=invalid&volume=99&q='+('a'.repeat(300)),['all','Research']);
  assert.equal(filters.category,'all');assert.equal(filters.volume,'all');assert.equal(filters.query.length,200);
});
test('local applications have setup links and Dustin retains the GLO concept credit',()=>{
  assert.deepEqual(projects.filter(project=>!project.pages).map(project=>project.repo).sort(),['BrainC','PhiCade']);
  assert.equal(projects.filter(project=>project.pages).length,16);
  assert.equal(projects.find(project=>project.repo==='GLO').credit,'Original GLO concept: Dustin');
});
