---
title: Work with me
icon: fas fa-briefcase
order: 0
permalink: /work-with-me/
description: Web development, automation, integrations and technical repair by Danylo Yenikeiev.
toc: false
---

<link rel="stylesheet" href="{{ '/assets/css/work-with-me.css' | relative_url }}">

<div class="work-page">
  <section class="work-hero" aria-labelledby="work-hero-title">
    <p class="work-eyebrow">Independent software engineer</p>
    <h2 id="work-hero-title">I build, automate and repair web software.</h2>
    <p class="work-lead">
      Landing pages, web applications, AI and API integrations, and difficult technical fixes.
    </p>
    <p class="work-availability">
      Available for short fixed-scope projects and longer-term collaboration.
    </p>

    <div class="work-actions">
      <a class="work-button work-button-primary" href="mailto:ogyrec.404@proton.me?subject=Project%20inquiry">Discuss a project</a>
      <a class="work-button work-button-secondary" href="#selected-work">View selected work</a>
    </div>

    <div class="work-meta" aria-label="Location and technology">
      <p>Based in Poland | Remote worldwide | Async-friendly</p>
      <p>Python | TypeScript | Rust | APIs | Docker | AI integrations</p>
    </div>
  </section>

  <section class="work-section" aria-labelledby="services-title">
    <div class="work-section-heading">
      <p class="work-eyebrow">Three ways to start</p>
      <h2 id="services-title">Choose the closest match.</h2>
      <p>
        Not sure which one fits? Send the problem or desired result. I will suggest the smallest useful first step.
      </p>
    </div>

    <div class="service-grid">
      <article class="service-card">
        <p class="service-label">Build</p>
        <h3>Websites and small web applications</h3>
        <p>
          I build responsive landing pages, business websites, dashboards and focused web applications.
        </p>
        <p class="service-list-title">Typical work:</p>
        <ul>
          <li>Product and service landing pages</li>
          <li>SaaS and business websites</li>
          <li>Dashboards and admin panels</li>
          <li>Forms, databases and user workflows</li>
          <li>Implementation from an existing design</li>
        </ul>
        <div class="service-price">
          <span>Typical starting scope</span>
          <strong>1,500-5,000 PLN</strong>
        </div>
      </article>

      <article class="service-card">
        <p class="service-label">Automate</p>
        <h3>AI, APIs and business automation</h3>
        <p>
          I connect existing tools and build small internal applications that remove repetitive manual work.
        </p>
        <p class="service-list-title">Typical work:</p>
        <ul>
          <li>Email and lead-processing workflows</li>
          <li>API and webhook integrations</li>
          <li>AI classification, extraction and summarization</li>
          <li>Document processing, search and RAG</li>
          <li>Internal tools and operational dashboards</li>
          <li>Python and TypeScript backends</li>
        </ul>
        <div class="service-price">
          <span>Typical starting scope</span>
          <strong>2,000-7,000 PLN</strong>
        </div>
      </article>

      <article class="service-card">
        <p class="service-label">Rescue</p>
        <h3>Technical fixes and stabilization</h3>
        <p>
          I diagnose difficult failures in existing applications, integrations and production environments.
        </p>
        <p class="service-list-title">Typical work:</p>
        <ul>
          <li>Unfinished or AI-built applications</li>
          <li>Broken APIs, authentication and deployments</li>
          <li>Shopify, GA4 and Google Ads tracking</li>
          <li>Docker, VPS and networking issues</li>
          <li>Lifecycle, WebSocket and backend failures</li>
          <li>Tests, logging and production hardening</li>
        </ul>
        <div class="service-price">
          <span>Paid diagnostics start at</span>
          <strong>450 PLN</strong>
        </div>
      </article>
    </div>

    <p class="pricing-note">
      These ranges are starting points and a practical filter, not a fixed public price list for every project.
    </p>
  </section>

  <section class="work-section" id="selected-work" aria-labelledby="selected-work-title">
    <div class="work-section-heading">
      <p class="work-eyebrow">Selected work</p>
      <h2 id="selected-work-title">Evidence from real systems.</h2>
      <p>
        The commercial work is broad. The engineering depth behind it comes from debugging production integrations, contributing upstream and building complex systems from scratch.
      </p>
    </div>

    <div class="case-grid">
      <article class="case-card">
        <p class="case-type">Private client work</p>
        <h3>Shopify analytics repair</h3>
        <p>
          Diagnosed duplicate ecommerce events across Shopify, the Google and YouTube app, GA4, Google Ads, GTM and consent tooling. Isolated the real measurement path, removed competing tag routes and documented the reconnect and validation plan.
        </p>
        <p class="case-skills">Shopify | GA4 | Google Ads | GTM | Network debugging</p>
      </article>

      <article class="case-card">
        <p class="case-type">Third-party codebase</p>
        <h3>Godot plugin stabilization</h3>
        <p>
          Updated and hardened an existing Godot plugin. Fixed editor lifecycle cleanup, subprocess and WebSocket failures, malformed message handling, oversized buffering, reconnect behavior and regression coverage.
        </p>
        <p class="case-skills">Godot | GDScript | WebSockets | Testing | Debugging</p>
      </article>

      <article class="case-card">
        <p class="case-type">Merged open source contribution</p>
        <h3>Quinn networking compatibility fix</h3>
        <p>
          Contributed a Rust networking fix that keeps QUIC endpoint creation working under Wine and Proton when optional Windows ECN functionality is unavailable.
        </p>
        <a class="case-link" href="https://github.com/quinn-rs/quinn/pull/2532">View merged pull request</a>
      </article>

      <article class="case-card">
        <p class="case-type">Independent engineering</p>
        <h3>Kova engine</h3>
        <p>
          Building a modular game engine in Rust with a custom runtime and ECS architecture, rendering, assets, scenes, input, physics, plugins, task systems, tooling, tests and backend-neutral public APIs.
        </p>
        <a class="case-link" href="{{ '/projects/' | relative_url }}">View project overview</a>
      </article>
    </div>
  </section>

  <section class="work-section" aria-labelledby="process-title">
    <div class="work-section-heading">
      <p class="work-eyebrow">How it works</p>
      <h2 id="process-title">A small first milestone, then evidence.</h2>
    </div>

    <ol class="process-grid">
      <li>
        <span class="process-number">1</span>
        <p>You send the current problem, repository or desired result.</p>
      </li>
      <li>
        <span class="process-number">2</span>
        <p>I define the smallest useful paid milestone.</p>
      </li>
      <li>
        <span class="process-number">3</span>
        <p>You receive a fixed scope, price and acceptance criteria.</p>
      </li>
      <li>
        <span class="process-number">4</span>
        <p>I implement, test and document the result.</p>
      </li>
    </ol>

    <p class="process-note">No free speculative work. No long contract required.</p>
  </section>

  <section class="work-cta" aria-labelledby="work-cta-title">
    <div>
      <p class="work-eyebrow">Start with the facts</p>
      <h2 id="work-cta-title">Have a project or a technical problem?</h2>
      <p>Send:</p>
      <ul>
        <li>What you need</li>
        <li>Current stack or platform</li>
        <li>Desired result</li>
        <li>Preferred deadline</li>
      </ul>
      <p>
        A complete specification is not required. A repository, screenshots, logs or rough notes are enough to start.
      </p>
      <p class="cta-outcome">I will reply with the proposed first milestone.</p>
    </div>

    <div class="cta-action">
      <a class="work-button work-button-primary" href="mailto:ogyrec.404@proton.me?subject=Project%20inquiry">Discuss a project</a>
      <a class="email-copy" href="mailto:ogyrec.404@proton.me?subject=Project%20inquiry">ogyrec.404@proton.me</a>
    </div>
  </section>
</div>
