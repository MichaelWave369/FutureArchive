import React from 'react';
import {asset} from './site-paths.mjs';

export function Header() {
  return <>
<a className="skip-link" href="#collection">Skip to the collection</a>
  <header className="site-header">
    <div className="header-inner">
      <a className="wordmark" href="#top" aria-label="Future Archive home"><span className="brand-mark" aria-hidden="true">Φ</span><span>FUTURE ARCHIVE<small>MICHAELWAVE369</small></span></a>
      <nav aria-label="Main navigation"><a href="#collection">The collection</a><a href="#story">The story</a><a className="header-github" href="https://github.com/MichaelWave369" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></nav>
    </div>
  </header>
  </>;
}

export function Hero({onOpen,onSurprise}) {
  return <>
<section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="little-star" aria-hidden="true">✦</span> THE RETROFUTURE COLLECTION</p>
        <h1 id="hero-title">Code, cast<br /><span className="chrome-text">in chrome.</span></h1>
        <p className="hero-description">A growing universe of real projects, imagined through the warmth and wonder of ’80s science fiction.</p>
        <p className="hero-invitation">Come for the art. Follow a doorway into the code.</p>
        <div className="hero-actions"><a className="button button-gold" href="#collection">Explore the collection <span aria-hidden="true">↘</span></a><button className="text-button" id="surprise" type="button" onClick={onSurprise}>Surprise me <span aria-hidden="true">✧</span></button></div>
        <div className="hero-edition"><span><b>18</b> ORIGINAL PRINTS</span><i aria-hidden="true"></i><span><b>03</b> VOLUMES</span><i aria-hidden="true"></i><span>EST. <b>2026</b></span></div>
      </div>
      <div className="hero-art" aria-label="Selected artwork from the collection">
        <div className="orbital-line" aria-hidden="true"></div>
        <a className="hero-poster poster-left" href={asset("01-infinite-porch.webp")} data-open-print="01" onClick={(event) => onOpen("01", event)} aria-label="View print 01, Infinite Porch" aria-haspopup="dialog"><img src={asset("01-infinite-porch-640.webp")} width="640" height="960" alt="Infinite Porch art print" fetchPriority="high" /></a>
        <a className="hero-poster poster-right" href={asset("05-domistika.webp")} data-open-print="05" onClick={(event) => onOpen("05", event)} aria-label="View print 05, Domistika" aria-haspopup="dialog"><img src={asset("05-domistika-640.webp")} width="640" height="960" alt="Domistika art print" /></a>
        <a className="hero-poster poster-front" href={asset("16-field-atlas.webp")} data-open-print="16" onClick={(event) => onOpen("16", event)} aria-label="View print 16, The Field Atlas" aria-haspopup="dialog"><img src={asset("16-field-atlas-640.webp")} width="640" height="960" alt="The Field Atlas art print" /></a>
        <div className="hero-stamp"><span aria-hidden="true">✦</span> A LITTLE NOSTALGIA.<br />A LOT OF POSSIBILITY.</div>
      </div>
    </section>
    <div className="collection-divider wrap"><span>INDEPENDENT PROJECTS · SHARED IMAGINATION</span><span className="divider-line" aria-hidden="true"></span><span>PRINTS 001—018</span></div>
  </>;
}

export function Story() {
  return <>
<section id="story" className="story-section" aria-labelledby="story-title"><div className="story-inner wrap"><div className="story-image"><img src={asset("17-more-bounce-method-640.webp")} width="640" height="960" alt="The More Bounce Method: a community building together on six solid foundations" loading="lazy" decoding="async" /><span>PRINT 017 · THE MORE BOUNCE METHOD</span></div><div className="story-copy"><p className="eyebrow">THE STORY BEHIND THE SERIES</p><h2 id="story-title">Build outward.<br /><em>Circle back.</em></h2><p>These are the projects of Michael “Mikey” Hughes: tools, research, art rooms, game worlds, and ideas for helping people. Each one begins with a question—and a willingness to make something.</p><p>This series gives those ideas a different form. Chrome letters, amber lamps, impossible libraries, cosmic front porches. A little of the future we imagined back then, brought into the things we’re building now.</p><div className="credit-line"><span className="credit-star" aria-hidden="true">✧</span><p><b>Human direction. Shared imagination.</b><br />Creative direction by Mikey Hughes. Artwork created with AI image-generation tools. Project descriptions are grounded in their repositories; the prints imagine their spirit.</p></div><a className="text-link" href="https://github.com/MichaelWave369" target="_blank" rel="noopener noreferrer">Explore the whole GitHub universe <span aria-hidden="true">↗</span></a></div></div></section>
  </>;
}

export function Footer() {
  return <>
<footer className="site-footer wrap"><a className="wordmark footer-wordmark" href="#top"><span className="brand-mark" aria-hidden="true">Φ</span><span>FUTURE ARCHIVE<small>MICHAELWAVE369 · 2026</small></span></a><p>Ledger above ego.<br /><span>For the people we haven’t met yet.</span></p><a className="footer-top" href="#collection">Return to the collection <span aria-hidden="true">↗</span></a></footer>
  </>;
}

