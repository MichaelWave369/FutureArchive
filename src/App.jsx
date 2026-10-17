import React, {useEffect, useMemo, useRef, useState} from 'react';
import projects from './catalog.json';
import {selectProjects, adjacentIndex} from './gallery-model.mjs';
import {artworkPath, repositoryUrl, atlasChapterUrl, readLocation, viewUrl} from './site-paths.mjs';
import {Header, Hero, Story, Footer} from './StaticSections.jsx';

const categories = ['all', ...new Set(projects.map(project => project.category))];
const volumes = {1:'Worlds within worlds', 2:'Made to make', 3:'Closer to home'};
const allNumbers = projects.map(project => project.number);
const defaultFilters = {query:'', category:'all', volume:'all'};

export function ArtworkCard({project, onOpen}) {
  const destination = project.pages || repositoryUrl(project) + '#readme';
  const label = project.pages ? 'GitHub Pages' : 'Run locally';
  return <article className="art-card" data-print={project.number} aria-labelledby={'project-'+project.number}>
    <div className="art-card-top"><span>{project.category}</span><span className="art-card-number">{project.number} / {projects.length}</span></div>
    <a className="artwork-link" href={artworkPath(project)} data-open-print={project.number} aria-label={'View print '+project.number+', '+project.title} aria-haspopup="dialog" onClick={event => onOpen(project.number,event)}>
      <img src={artworkPath(project,640)} srcSet={artworkPath(project,320)+' 320w, '+artworkPath(project,640)+' 640w'} sizes="(max-width:360px) calc(100vw - 38px), (max-width:600px) calc((100vw - 53px) / 2), (max-width:800px) calc((100vw - 80px) / 2), (max-width:1368px) calc((100vw - 144px) / 3), 408px" width="640" height="960" alt={project.alt} loading="lazy" decoding="async" />
      <span className="open-label" aria-hidden="true">View print ↗</span>
    </a>
    <div className="art-card-copy"><h3 id={'project-'+project.number}>{project.title}</h3><p className="art-card-description">{project.description}</p>{project.credit && <p className="art-card-credit">{project.credit}</p>}</div>
    <div className="art-card-links"><a href={repositoryUrl(project)} target="_blank" rel="noopener noreferrer" aria-label={project.title+' GitHub repository'}>GitHub <span aria-hidden="true">↗</span></a><a className={project.pages?'pages-link':'local-link'} href={destination} target="_blank" rel="noopener noreferrer" aria-label={project.title+': '+label}>{label} <span aria-hidden="true">↗</span></a></div>
  </article>;
}

function PrintViewer({project, pool, onNavigate, onClose, opener}) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  const isOpen = Boolean(project);
  useEffect(() => {
    const element = dialog.current;
    if (isOpen) {
      if (!element.open) element.showModal();
      document.body.classList.add('viewer-open');
      closeButton.current?.focus({preventScroll:true});
    } else {
      if (element.open) element.close();
      document.body.classList.remove('viewer-open');
      if (opener.current?.isConnected) opener.current.focus({preventScroll:true});
    }
  }, [isOpen, opener]);
  useEffect(() => {setCopyStatus('');}, [project?.number]);
  useEffect(() => () => document.body.classList.remove('viewer-open'), []);
  async function copyLink() {
    try {await navigator.clipboard.writeText(window.location.href);setCopyStatus('Print link copied.');}
    catch {setCopyStatus('Copy this print link from your address bar.');}
  }
  function backdropClick(event) {
    if (event.target !== dialog.current) return;
    const rect = dialog.current.getBoundingClientRect();
    if (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) onClose();
  }
  function keyDown(event) {
    if (event.key==='ArrowLeft' || event.key==='ArrowRight') {event.preventDefault();onNavigate(event.key==='ArrowLeft'?-1:1);}
  }
  const position = project ? pool.indexOf(project.number)+1 : 0;
  return <dialog id="print-viewer" ref={dialog} aria-labelledby="viewer-title" aria-describedby="viewer-description" onClick={backdropClick} onKeyDown={keyDown} onClose={onClose}>
    <div className="viewer-shell">
      <button className="icon-button viewer-close" ref={closeButton} id="viewer-close" type="button" aria-label="Close artwork viewer" onClick={onClose}>×</button>
      <div className="viewer-image-panel"><img id="viewer-image" src={project?artworkPath(project):undefined} width="1024" height="1536" alt={project?.alt || ''} />
        <div className="viewer-navigation"><button className="icon-button" id="viewer-previous" type="button" aria-label="Previous print" disabled={pool.length<2} onClick={() => onNavigate(-1)}>←</button><span id="viewer-position">{position} / {pool.length}{pool.length<projects.length?' IN THIS VIEW':' IN THE COLLECTION'}</span><button className="icon-button" id="viewer-next" type="button" aria-label="Next print" disabled={pool.length<2} onClick={() => onNavigate(1)}>→</button></div>
      </div>
      <div className="viewer-copy"><p className="eyebrow" id="viewer-meta">{project && 'PRINT '+project.number+' · VOLUME 0'+project.volume}</p><h2 id="viewer-title">{project?.title}</h2><p className="viewer-category" id="viewer-category">{project && project.category+' / '+volumes[project.volume]}</p><p id="viewer-description">{project?.detail}</p>
        <div className="print-story"><h3>In the print</h3><p id="viewer-art">{project?.art}</p></div>
        {project?.credit && <p className="project-credit" id="viewer-credit">{project.credit}</p>}
        <div className="viewer-links"><a className="button button-gold" id="viewer-pages" href={project?(project.pages || repositoryUrl(project)+'#readme'):undefined} target="_blank" rel="noopener noreferrer">{project?.pages?'Open GitHub Pages ↗':'Local setup guide ↗'}</a><a className="button button-outline" id="viewer-github" href={project?repositoryUrl(project):undefined} target="_blank" rel="noopener noreferrer">View repository <span aria-hidden="true">↗</span></a></div>
        <div className="viewer-utilities"><a href={project?atlasChapterUrl(project):undefined} target="_blank" rel="noopener noreferrer" aria-label="Explore this project through the Field Atlas living library">Field Atlas <span aria-hidden="true">↗</span></a><a id="viewer-download" href={project?artworkPath(project):undefined} download={project?project.number+'-'+project.slug+'.webp':undefined}>Save image <span aria-hidden="true">↓</span></a><button id="viewer-copy-link" type="button" onClick={copyLink}>Copy print link <span aria-hidden="true">↗</span></button></div><p className="viewer-hint">Use ← → to browse · Esc to return</p><p className="copy-status" id="copy-status" role="status" aria-live="polite">{copyStatus}</p>
      </div>
    </div>
  </dialog>;
}

export default function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [ready, setReady] = useState(false);
  const [activeNumber, setActiveNumber] = useState(null);
  const [viewerPool, setViewerPool] = useState(allNumbers);
  const searchInput = useRef(null);
  const opener = useRef(null);
  const visible = useMemo(() => selectProjects(projects,filters), [filters]);
  const project = projects.find(item => item.number===activeNumber) || null;
  const filtersActive = Boolean(filters.query.trim() || filters.category!=='all' || filters.volume!=='all');
  useEffect(() => {
    const nextFilters = readLocation(window.location.href,categories);
    setFilters(nextFilters);
    const number = window.location.hash.match(/^#print-(\d{2})$/)?.[1];
    if (allNumbers.includes(number)) {
      const selected = selectProjects(projects,nextFilters).map(item=>item.number);
      setViewerPool(selected.includes(number)?selected:allNumbers);
      setActiveNumber(number);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const url = viewUrl(window.location.href,filters,activeNumber);
    window.history.replaceState(null,'',url.pathname+url.search+url.hash);
  }, [ready, filters, activeNumber]);
  function openPrint(number,event,overridePool) {
    if (event?.metaKey || event?.ctrlKey || event?.shiftKey || event?.altKey || (event?.button!==undefined && event.button!==0)) return;
    event?.preventDefault();
    const target = projects.find(item=>item.number===number);
    if (!target) return;
    if (typeof HTMLDialogElement==='undefined' || typeof HTMLDialogElement.prototype.showModal!=='function') {window.location.href=artworkPath(target);return;}
    opener.current = event?.currentTarget || document.activeElement;
    const pool = overridePool || (visible.some(item=>item.number===number)?visible:projects);
    setViewerPool(pool.map(item=>item.number));
    setActiveNumber(number);
  }
  function navigate(direction) {
    setActiveNumber(current=>viewerPool[adjacentIndex(viewerPool.indexOf(current),direction,viewerPool.length)] || null);
  }
  function resetFilters() {setFilters(defaultFilters);searchInput.current?.focus({preventScroll:true});}
  function surprise(event) {const pool=visible.length?visible:projects;openPrint(pool[Math.floor(Math.random()*pool.length)].number,event,pool);}
  return <>
    <Header />
    <main id="top"><Hero onOpen={openPrint} onSurprise={surprise} />
      <section id="collection" className="collection wrap" aria-labelledby="collection-title">
        <div className="section-heading"><div><p className="eyebrow">FIND YOUR NEXT DOORWAY</p><h2 id="collection-title">The collection<span className="heading-dot">.</span></h2></div><p className="section-intro">Every print holds a project.<br />Open one and see where it leads.</p></div>
        <form className="gallery-tools" id="filter-form" role="search" onSubmit={event=>event.preventDefault()}>
          <label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search projects</span><input id="search" name="q" type="search" maxLength="200" placeholder="Search a project, idea, or world…" autoComplete="off" ref={searchInput} value={filters.query} onChange={event=>setFilters({...filters,query:event.target.value})} /></label>
          <label className="volume-control"><span className="sr-only">Filter by volume</span><select id="volume" name="volume" value={filters.volume} onChange={event=>setFilters({...filters,volume:event.target.value})}><option value="all">All three volumes</option>{Object.entries(volumes).map(([number,name])=><option key={number} value={number}>Volume 0{number} · {name}</option>)}</select></label>
        </form>
        <div className="category-filters" id="category-filters" role="group" aria-label="Filter by project category">{categories.map(category=><button className="category-filter" type="button" key={category} data-category={category} aria-pressed={filters.category===category} onClick={()=>setFilters({...filters,category})}>{category==='all'?'All prints':category} <span>{String(category==='all'?projects.length:projects.filter(item=>item.category===category).length).padStart(2,'0')}</span></button>)}</div>
        <div className="gallery-status"><p id="result-count" aria-live="polite" aria-atomic="true">{filtersActive?visible.length+' of '+projects.length+' prints shown':projects.length+' prints in the collection'}</p><button id="reset-filters" className="text-button small" type="button" hidden={!filtersActive} onClick={resetFilters}>Reset filters <span aria-hidden="true">↺</span></button><span className="view-hint">SELECT A PRINT TO EXPLORE <span aria-hidden="true">↗</span></span></div>
        <div id="gallery" className="gallery-grid" hidden={visible.length===0}>{visible.map(item=><ArtworkCard key={item.number} project={item} onOpen={openPrint} />)}</div>
        <div id="empty-state" className="empty-state" hidden={visible.length!==0}><span aria-hidden="true">✧</span><h3>No worlds found just yet.</h3><p>Try a different name, idea, or category.</p><button className="button button-outline" id="empty-reset" type="button" onClick={resetFilters}>Show all {projects.length} prints</button></div>
        <noscript><p className="noscript-note">All artwork and project links work without JavaScript. Enable JavaScript to search, filter, and use the artwork viewer.</p></noscript>
        <div className="end-of-collection"><span aria-hidden="true">✦</span><p>Eighteen little worlds. Still building outward.</p><a href="#top">Back to the stars <span aria-hidden="true">↑</span></a></div>
      </section>
      <Story />
    </main>
    <Footer />
    <PrintViewer project={project} pool={viewerPool} onNavigate={navigate} onClose={()=>setActiveNumber(null)} opener={opener} />
  </>;
}
