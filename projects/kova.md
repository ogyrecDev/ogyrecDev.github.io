---
layout: kova
title: Kova Engine - Modular Rust Game Engine Technical Preview
description: Kova is a modular, general-purpose Rust game engine foundation with public 2D and 3D authoring APIs, explicit backend boundaries, runnable validation examples, and a long-term editor-aware architecture.
permalink: /projects/kova/
image:
  path: /assets/img/kova/kova-social-preview.svg
  alt: Kova engine technical preview artwork with a cube and orbit path
---

<div class="kova-page">
  <nav class="kova-section-nav" aria-label="Kova page sections">
    <a href="#overview">Overview</a>
    <a href="#demos">Demos</a>
    <a href="#architecture">Architecture</a>
    <a href="#capabilities">Capabilities</a>
    <a href="#validation">Validation</a>
    <a href="#roadmap">Roadmap</a>
    <a href="#contact">Contact</a>
  </nav>

  <header class="kova-hero" id="overview">
    <div class="kova-hero-copy">
      <div class="kova-eyebrow-row" aria-label="Project status">
        <span class="kova-chip">Rust</span>
        <span class="kova-chip">Private development repository</span>
        <span class="kova-chip kova-chip-accent">Preparing for public-source pre-alpha</span>
      </div>
      <p class="kova-kicker">Technical preview</p>
      <h1 id="kova-title">Kova</h1>
      <h2>A modular, general-purpose game engine foundation written in Rust.</h2>
      <p class="kova-lead">Kova explores a library-first engine architecture with public 2D and 3D authoring APIs, explicit plugin and backend boundaries, and validation through real runnable examples.</p>
      <p>The engine is under active private development. Its current milestone proves the core public application, scene, rendering, input, and transform paths without requiring game code to manage WGPU, winit, or the renderer lifecycle directly.</p>
      <div class="kova-actions">
        <a class="kova-button kova-button-primary" href="#camera-orbit">Explore the demos</a>
        <a class="kova-button kova-button-secondary" href="#architecture">View the architecture</a>
        <a class="kova-text-link" href="#contact">Discuss engine or tooling work</a>
      </div>
    </div>

    <figure class="kova-media kova-hero-media">
      <img src="/assets/img/kova/kova-camera-orbit-placeholder.svg" alt="Illustrated placeholder for the Kova Camera Orbit demo, showing a blue cube on a circular base with an orbit path" width="1600" height="900" fetchpriority="high">
      <figcaption>
        <span>Camera orbit driven through Kova's public app, input, camera, and transform APIs.</span>
        <span class="kova-placeholder-note">Illustrated placeholder. Replace with the current engine capture.</span>
      </figcaption>
    </figure>
  </header>

  <section class="kova-proof-strip" aria-label="Current proof points">
    <article>
      <strong>Runnable 2D and 3D paths</strong>
      <p>Public engine APIs are exercised through real desktop examples rather than architecture documents alone.</p>
    </article>
    <article>
      <strong>Backend-hidden user API</strong>
      <p>Ordinary example code does not manage WGPU resources, winit events, or manual render lifecycle stages.</p>
    </article>
    <article>
      <strong>Validation-driven development</strong>
      <p>Visual examples are paired with deterministic or backend-free smoke paths where practical.</p>
    </article>
    <article>
      <strong>Public release preparation</strong>
      <p>The private repository is being prepared for an explicitly unstable public-source pre-alpha release.</p>
    </article>
  </section>

  <section class="kova-section kova-overview-grid">
    <div>
      <p class="kova-section-label">Overview</p>
      <h2>What Kova is</h2>
      <p>Kova is a general-purpose engine foundation rather than a game-specific framework or renderer experiment.</p>
      <p>Its public surface is being designed so that an external project can construct an application, compose plugins, author scenes, create assets, respond to input, and run through a normal desktop path without reaching into backend implementation details.</p>
      <p>The current codebase includes engine foundation, ECS and application layers, public scene and transform authoring, 2D and 3D rendering paths, input and camera APIs, assets, materials, meshes, diagnostics, desktop runtime composition, and optional voxel extension work.</p>
      <p>Kova remains pre-alpha. The current examples prove selected vertical paths. They do not yet claim that the engine can ship a complete production game.</p>
    </div>
    <aside class="kova-status-card" aria-label="Current Kova status">
      <p class="kova-card-label">Current status</p>
      <ul class="kova-check-list">
        <li>M2 public API validation milestone completed</li>
        <li>Runnable Camera Orbit, Basic 3D, and Basic 2D examples</li>
        <li>Public-source pre-alpha release gate in progress</li>
        <li>Editor pre-alpha remains future work</li>
        <li>APIs may change before public release</li>
      </ul>
    </aside>
  </section>

  <section class="kova-section" id="demos">
    <p class="kova-section-label">Runnable examples</p>
    <h2>Public-style code, visible output</h2>
    <p class="kova-section-intro">The examples live outside engine crates and use the same public facades intended for external projects. Each one targets a small, inspectable vertical path instead of hiding missing functionality behind demo-only helpers.</p>
  </section>

  <section class="kova-section kova-demo kova-demo-primary" id="camera-orbit">
    <div class="kova-demo-heading">
      <div>
        <p class="kova-section-label">Main demo</p>
        <h2>Camera Orbit</h2>
      </div>
      <span class="kova-demo-tag">Interactive 3D</span>
    </div>

    <p class="kova-section-intro">A small interactive 3D example built entirely through public Kova app, desktop, input, scene, mesh, material, light, camera, and transform APIs. Mouse input updates the camera's local transform while Kova's normal transform propagation derives the global state before extraction and rendering.</p>

    <div class="kova-demo-grid">
      <div>
        <figure class="kova-media">
          <img src="/assets/img/kova/kova-camera-orbit-placeholder.svg" alt="Illustrated placeholder for the Kova Camera Orbit demo" width="1600" height="900" loading="lazy">
          <figcaption>
            <span>Slow horizontal orbit with a small pitch change and a loop back toward the starting view.</span>
            <span class="kova-placeholder-note">Replace with WebM, MP4, and poster assets.</span>
          </figcaption>
        </figure>

        <div class="kova-controls-card">
          <p class="kova-card-label">Controls</p>
          <ul>
            <li>Move the mouse to orbit around the scene</li>
            <li>Press <code>Escape</code> to release the cursor</li>
            <li>Click the left mouse button to capture it again</li>
            <li>Vertical rotation is clamped to prevent inversion</li>
          </ul>
        </div>

        <div class="kova-proof-card">
          <p class="kova-card-label">What it proves</p>
          <ul class="kova-compact-list">
            <li>Public <code>KovaApp</code> construction and desktop plugin composition</li>
            <li>Ordinary <code>Startup</code> and <code>Update</code> systems</li>
            <li>Keyboard, mouse button, and mouse motion resources</li>
            <li>Public camera, transform, material, mesh, and light authoring</li>
            <li>Cursor capture through a public window-facing contract</li>
            <li>No direct WGPU, winit, or manual renderer lifecycle usage</li>
          </ul>
        </div>
      </div>

      <div class="kova-code-tabs" data-tabs>
        <div class="kova-tab-list" role="tablist" aria-label="Camera Orbit code excerpts">
          <button type="button" role="tab" aria-selected="true" aria-controls="kova-code-app" id="kova-tab-app">App setup</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="kova-code-scene" id="kova-tab-scene" tabindex="-1">Scene setup</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="kova-code-orbit" id="kova-tab-orbit" tabindex="-1">Orbit behavior</button>
        </div>

        <section class="kova-tab-panel" role="tabpanel" id="kova-code-app" aria-labelledby="kova-tab-app">
          <p class="kova-code-label">Application and system composition</p>
          <div class="kova-code-block">
            <button class="kova-copy" type="button" data-copy-target="code-camera-app">Copy</button>
            <pre><code id="code-camera-app">use kova_desktop::prelude::*;

let mut app = KovaApp::new();
app.add_plugins(
    KovaDesktopPlugins::new()
        .with_window_title(WindowTitle::new("Kova Camera Orbit"))
        .with_window_size(WindowSize::new(960, 540)),
)?;

app.world_mut()
    .insert_resource(CameraOrbitSettings::default());
app.world_mut()
    .insert_resource(CameraOrbitState::from_settings(
        CameraOrbitSettings::default(),
    ));

app.add_systems(Startup, setup_camera_orbit_scene);
app.add_systems(Update, update_camera_orbit);
app.run()?;</code></pre>
          </div>
          <p class="kova-code-note">Representative excerpt from the current private example. Error handling and cursor-state setup are shortened here for readability.</p>
        </section>

        <section class="kova-tab-panel" role="tabpanel" id="kova-code-scene" aria-labelledby="kova-tab-scene" hidden>
          <p class="kova-code-label">Public scene, mesh, material, and light authoring</p>
          <div class="kova-code-block">
            <button class="kova-copy" type="button" data-copy-target="code-camera-scene">Copy</button>
            <pre><code id="code-camera-scene">let mut scene = SceneList::new();

let cube_mesh = scene.asset(asset_value(
    MeshAsset::position_normal_from_cuboid(
        MeshId::new("example.mesh.cube"),
        MeshLabel::new("Cube"),
        Cuboid::new(1.0, 1.0, 1.0),
    )?,
));

let cube_material = scene.asset(asset_value(
    MaterialDescriptor::standard(
        MaterialId::new("example.material.cube"),
        MaterialLabel::new("Blue cube"),
        StandardMaterial::lit(Color::srgb_rgb(
            124.0 / 255.0,
            144.0 / 255.0,
            1.0,
        ))
        .with_roughness(0.55),
    ),
));

scene.spawn((
    PointLight3d::new(LightColor::WHITE, 1_000_000.0, 20.0)
        .with_radius(0.25),
    Transform3d::from_xyz(4.0, 8.0, 4.0),
    GlobalTransform3d::IDENTITY,
));

scene.mesh_draw_3d_local_at(
    cube_mesh,
    cube_material,
    Transform3d::from_xyz(0.0, 0.51, 0.0),
);
scene.apply(world)?;</code></pre>
          </div>
          <p class="kova-code-note">The public example creates its scene without obtaining GPU buffers, render passes, swapchain objects, or backend resource handles.</p>
        </section>

        <section class="kova-tab-panel" role="tabpanel" id="kova-code-orbit" aria-labelledby="kova-tab-orbit" hidden>
          <p class="kova-code-label">Camera transform from public input state</p>
          <div class="kova-code-block">
            <button class="kova-copy" type="button" data-copy-target="code-camera-orbit">Copy</button>
            <pre><code id="code-camera-orbit">fn camera_transform(
    yaw: AngleRadians,
    pitch: AngleRadians,
    target: Vec3,
    distance: f32,
) -&gt; Transform3d {
    let orientation = Transform3d::from_euler(
        EulerRot::YXZ,
        yaw,
        pitch,
        AngleRadians::ZERO,
    );

    let position = target - orientation.forward() * distance;

    Transform3d::from_translation(position)
        .looking_at(target, Vec3::Y)
}</code></pre>
          </div>
          <p class="kova-code-note">The full example validates finite input, wraps yaw, clamps pitch, handles cursor capture, and updates exactly one marked camera.</p>
        </section>
      </div>
    </div>

    <aside class="kova-callout">
      <p class="kova-card-label">Current ergonomics note</p>
      <p>The current typed system adapter does not yet combine every resource and mutable query shape required by this example. Camera Orbit therefore uses Kova's public raw <code>World</code> system form for the update system. It still does not access backend or renderer internals.</p>
    </aside>
  </section>

  <section class="kova-section kova-demo" id="basic-3d">
    <div class="kova-demo-heading">
      <div>
        <p class="kova-section-label">Static vertical path</p>
        <h2>Basic 3D</h2>
      </div>
      <span class="kova-demo-tag">Lit 3D scene</span>
    </div>

    <div class="kova-split">
      <figure class="kova-media">
        <img src="/assets/img/kova/kova-basic-3d-placeholder.svg" alt="Illustrated placeholder of a blue cube on a white circular base for the Kova Basic 3D example" width="1600" height="900" loading="lazy">
        <figcaption>
          <span>A blue cube on a white circular base rendered by the Kova Basic 3D example.</span>
          <span class="kova-placeholder-note">Replace with kova-basic-3d.webp.</span>
        </figcaption>
      </figure>

      <div>
        <p>The Basic 3D example is a minimal static desktop scene authored through the same public APIs intended for external engine users.</p>
        <p>It creates generated meshes, lit standard materials, ambient lighting, a photometric point light, a perspective camera, and local transforms before running through Kova's public desktop path.</p>

        <div class="kova-code-block kova-code-block-compact">
          <button class="kova-copy" type="button" data-copy-target="code-basic-3d-app">Copy</button>
          <pre><code id="code-basic-3d-app">let mut app = KovaApp::new();
app.add_plugins(
    KovaDesktopPlugins::new()
        .with_window_title(WindowTitle::new("Kova Basic 3D"))
        .with_window_size(WindowSize::new(960, 540)),
)?;
app.add_systems(Startup, setup_basic_3d_scene);
app.run()?;</code></pre>
        </div>

        <div class="kova-code-block kova-code-block-compact">
          <button class="kova-copy" type="button" data-copy-target="code-basic-3d-camera">Copy</button>
          <pre><code id="code-basic-3d-camera">let camera_transform =
    Transform3d::from_xyz(-2.5, 4.5, 9.0)
        .looking_at(Vec3::ZERO, Vec3::Y);

scene.camera_3d_local(camera, camera_transform);</code></pre>
        </div>
      </div>
    </div>

    <div class="kova-list-grid">
      <div class="kova-proof-card">
        <p class="kova-card-label">What it proves</p>
        <ul class="kova-compact-list">
          <li>One normal public desktop runner path</li>
          <li>Generated meshes with position and normal data</li>
          <li>Public lit material descriptors and camera authoring</li>
          <li>Local-to-global transform propagation</li>
          <li>A lit forward rendering path</li>
          <li>No manual prepare, queue, render, or present calls</li>
        </ul>
      </div>
      <aside class="kova-limit-card">
        <p class="kova-card-label">Current limitation</p>
        <p>The example does not claim a production renderer. Point-light shadows are disabled in this path, and automatic exposure and tonemapping are not yet part of this example's fixed SDR calibration.</p>
      </aside>
    </div>
  </section>

  <section class="kova-section kova-demo" id="basic-2d">
    <div class="kova-demo-heading">
      <div>
        <p class="kova-section-label">Separate authoring path</p>
        <h2>Basic 2D</h2>
      </div>
      <span class="kova-demo-tag">Ordered 2D scene</span>
    </div>

    <div class="kova-split kova-split-reverse">
      <div>
        <p>The Basic 2D example validates a separate 2D authoring path rather than presenting 2D objects as dummy 3D geometry.</p>
        <p>A translated and rotated root owns two child draws. Explicit <code>DrawOrder2d</code> values prove that visible ordering is independent of entity creation order.</p>

        <div class="kova-code-block">
          <button class="kova-copy" type="button" data-copy-target="code-basic-2d">Copy</button>
          <pre><code id="code-basic-2d">world.spawn(KovaDesktopScene2d::default_camera())?;

let root = world.spawn((
    Transform2d::from_translation_xy(-0.65, -0.20)
        .with_rotation(AngleRadians::new(0.12)),
    GlobalTransform2d::IDENTITY,
))?;

let front = world.spawn((
    Mesh2d::new(front_mesh),
    MeshMaterial2d::new(front_material),
    DrawOrder2d::new(10),
    Transform2d::from_translation_xy(0.75, 0.15)
        .with_rotation(AngleRadians::new(-0.22)),
    GlobalTransform2d::IDENTITY,
))?;

world.insert_component(front, Parent::new(root))?;</code></pre>
        </div>
      </div>

      <figure class="kova-media">
        <img src="/assets/img/kova/kova-basic-2d-placeholder.svg" alt="Illustrated placeholder of a coral rectangle and blue hexagon for the Kova Basic 2D example" width="1600" height="900" loading="lazy">
        <figcaption>
          <span>A coral rectangle and blue hexagon rendered through Kova's public 2D APIs.</span>
          <span class="kova-placeholder-note">Replace with kova-basic-2d.webp.</span>
        </figcaption>
      </figure>
    </div>

    <div class="kova-list-grid">
      <div class="kova-proof-card">
        <p class="kova-card-label">What it proves</p>
        <ul class="kova-compact-list">
          <li>An orthographic public 2D camera</li>
          <li>Generated rectangle and regular-polygon meshes</li>
          <li>Typed sRGB colors and unlit material descriptors</li>
          <li>Explicit 2D draw ordering</li>
          <li>Parent-child transform propagation</li>
          <li>A dedicated 2D path without transform-Z ordering hacks</li>
        </ul>
      </div>
      <aside class="kova-limit-card">
        <p class="kova-card-label">Current limitation</p>
        <p>The example does not yet claim sprites, textures, tilemaps, text, runtime UI, animation, physics, batching, alpha blending, or a complete 2D game workflow.</p>
      </aside>
    </div>
  </section>

  <section class="kova-section" id="architecture">
    <p class="kova-section-label">System boundaries</p>
    <h2>Architecture</h2>
    <p class="kova-section-intro">Kova is divided by ownership and dependency boundaries rather than by arbitrary feature folders. User-facing domain APIs remain separate from WGPU, winit, and platform-specific resource ownership. Runtime and backend crates may use those dependencies, but gameplay-facing code should not need to understand them.</p>

    <figure class="kova-architecture">
      <img src="/assets/img/kova/kova-architecture.svg" alt="Layered Kova architecture from external projects through public facade, foundation, backend-neutral domains, plugin boundaries, runtime, and backends" width="1400" height="1300" loading="lazy">
      <figcaption>Optional first-party voxel extensions use the same public extension direction and remain outside core identity.</figcaption>
    </figure>

    <div class="kova-principles">
      <article>
        <span>01</span>
        <h3>Backend-hidden gameplay APIs</h3>
        <p>Gameplay-facing and domain APIs should not expose WGPU objects, winit events, backend resource handles, or manual rendering lifecycle operations.</p>
      </article>
      <article>
        <span>02</span>
        <h3>Public extension symmetry</h3>
        <p>First-party plugins should use the same public extension mechanisms intended for future third-party plugins. Kova should not rely on privileged internal plugin paths.</p>
      </article>
      <article>
        <span>03</span>
        <h3>Product-neutral engine core</h3>
        <p>Kova remains independent from the Freven game, platform, content, and publishing policy. Freven acts as a downstream pressure test rather than defining the engine's public identity.</p>
      </article>
      <article>
        <span>04</span>
        <h3>Library-first, editor-aware</h3>
        <p>The runtime should remain usable without an editor. Editor architecture is being planned early, but it is not allowed to become a hidden requirement for building or running a project.</p>
      </article>
    </div>
  </section>

  <section class="kova-section kova-api-section">
    <div>
      <p class="kova-section-label">Public surface</p>
      <h2>What engine-user code should look like</h2>
      <p>Kova's high-level examples are intentionally written to resemble external user code.</p>
      <ol class="kova-number-list">
        <li>Construct a <code>KovaApp</code></li>
        <li>Compose public plugins</li>
        <li>Register startup and update systems</li>
        <li>Author assets and scene entities</li>
        <li>Respond to public input resources</li>
        <li>Run through a public desktop path</li>
      </ol>
      <p class="kova-muted">It should not need to allocate GPU buffers manually, own a surface or swapchain, call extraction stages, invoke prepare or present functions, process raw winit events, or import product-specific Freven types.</p>
    </div>

    <div class="kova-code-composition">
      <div class="kova-code-block">
        <button class="kova-copy" type="button" data-copy-target="code-public-composition">Copy</button>
        <pre><code id="code-public-composition">let mut app = KovaApp::new();

app.add_plugins(KovaDesktopPlugins::new())?;
app.add_systems(Startup, setup_scene);
app.add_systems(Update, update_gameplay);

app.run()?;</code></pre>
      </div>
      <p class="kova-code-note">The exact public API remains pre-alpha and may change, but the architectural boundary is deliberate.</p>
    </div>
  </section>

  <section class="kova-section" id="capabilities">
    <p class="kova-section-label">Implemented evidence</p>
    <h2>Current capability status</h2>
    <div class="kova-table-wrap">
      <table class="kova-status-table">
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">Current evidence</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Application and plugin composition</td><td><code>KovaApp</code>, schedules, and desktop plugin groups used by runnable examples</td><td><span class="kova-status kova-status-foundation">Working foundation</span></td></tr>
          <tr><td>ECS and resource model</td><td>Public world, components, resources, systems, and hierarchy paths</td><td><span class="kova-status kova-status-foundation">Working foundation</span></td></tr>
          <tr><td>Desktop runner</td><td>Real WGPU and winit desktop path behind public composition APIs</td><td><span class="kova-status kova-status-foundation">Working foundation</span></td></tr>
          <tr><td>3D scene authoring</td><td>Basic 3D and Camera Orbit examples</td><td><span class="kova-status kova-status-validated">Validated example</span></td></tr>
          <tr><td>2D scene authoring</td><td>Basic 2D example with hierarchy and draw ordering</td><td><span class="kova-status kova-status-validated">Validated example</span></td></tr>
          <tr><td>Input and camera control</td><td>Mouse, keyboard, cursor capture, and orbit camera</td><td><span class="kova-status kova-status-validated">Validated example</span></td></tr>
          <tr><td>Meshes, materials, and lighting</td><td>Generated geometry, lit and unlit materials, ambient and point light</td><td><span class="kova-status kova-status-foundation">Working vertical path</span></td></tr>
          <tr><td>Transform hierarchy</td><td>Public local and global 2D and 3D propagation</td><td><span class="kova-status kova-status-validated">Validated example</span></td></tr>
          <tr><td>Asset identity and catalog work</td><td>Logical identities, production catalog, and deterministic variant resolution</td><td><span class="kova-status kova-status-active">Active development</span></td></tr>
          <tr><td>External project use</td><td>Clean external-consumer validation path</td><td><span class="kova-status kova-status-active">Active validation</span></td></tr>
          <tr><td>Editor</td><td>Architecture and authoring tools planned</td><td><span class="kova-status kova-status-planned">Not yet a release claim</span></td></tr>
          <tr><td>Public source release</td><td>Licensing, security, CI, docs, and release audit gate</td><td><span class="kova-status kova-status-active">In preparation</span></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="kova-section" id="validation">
    <p class="kova-section-label">Engineering method</p>
    <h2>Built through validation, not diagrams alone</h2>
    <p class="kova-section-intro">Kova's architecture is pressure-tested with small external-style applications and focused validation packages. The visual examples are kept outside engine crates and consume public interfaces. When an example discovers missing reusable functionality, that gap is fixed or tracked in the owning engine layer rather than hidden inside example-specific code.</p>
    <p>Where practical, the same authored paths are paired with backend-free or bounded smoke validation so that CI can check application, scene, and frame behavior without requiring an interactive desktop.</p>

    <div class="kova-terminal" aria-label="Commands for the current Kova examples">
      <div class="kova-terminal-bar"><span></span><span></span><span></span><strong>examples</strong></div>
      <pre><code>cargo +stable run --locked -p kova_example_camera_orbit
cargo +stable run --locked -p kova_example_basic_3d
cargo +stable run --locked -p kova_example_basic_2d</code></pre>
    </div>
    <p class="kova-code-note">The repository is still private. These commands document the current internal examples and will become usable from a clean public checkout after the public-source release gate is completed.</p>

    <div class="kova-validation-grid">
      <article><strong>Public facades</strong><p>Examples use intended public entry points instead of backend shortcuts.</p></article>
      <article><strong>Dependency direction</strong><p>Engine crates do not depend on example packages.</p></article>
      <article><strong>Backend-free checks</strong><p>Visible windows are avoided when a smoke path can validate the same authored state.</p></article>
      <article><strong>Boundary checks</strong><p>Backend-specific types are checked at layer boundaries.</p></article>
      <article><strong>Documented friction</strong><p>API gaps discovered by examples are recorded rather than concealed.</p></article>
      <article><strong>External-consumer gate</strong><p>Clean use outside the engine workspace is treated as a release requirement.</p></article>
    </div>
  </section>

  <section class="kova-section">
    <p class="kova-section-label">Current engineering focus</p>
    <h2>Current work</h2>
    <p class="kova-section-intro">With the M2 public API validation milestone complete, current work is split between public-source release preparation, ordinary engine ergonomics, and the production content path. Recent work focuses on explicit logical asset identity, immutable production catalogs, deterministic asset variant resolution, and reproducible external-consumer validation.</p>

    <div class="kova-work-grid">
      <article>
        <span class="kova-work-index">01</span>
        <h3>Production content architecture</h3>
        <p>Establishing stable logical asset identity, catalog ownership, and deterministic resolution before expanding the authoring and import workflow.</p>
      </article>
      <article>
        <span class="kova-work-index">02</span>
        <h3>External consumer path</h3>
        <p>Ensuring that a project outside the engine workspace can use documented public interfaces without relying on private repository structure or internal hooks.</p>
      </article>
      <article>
        <span class="kova-work-index">03</span>
        <h3>Public-source pre-alpha gate</h3>
        <p>Preparing licensing and provenance, security reporting, public CI, documentation, contribution workflows, distribution rules, launch examples, and a final release audit.</p>
      </article>
    </div>
  </section>

  <section class="kova-section" id="roadmap">
    <p class="kova-section-label">Roadmap and limits</p>
    <h2>Pre-alpha means explicit limitations</h2>
    <div class="kova-roadmap-grid">
      <article class="kova-roadmap-column">
        <p class="kova-card-label">Current limitations</p>
        <ul class="kova-compact-list">
          <li>The repository remains private</li>
          <li>Public APIs are unstable and may change</li>
          <li>Kova does not yet claim that an external developer can ship a complete game</li>
          <li>The editor is not production-ready and is not presented as a finished product</li>
          <li>Current examples prove selected vertical paths, not complete production workflows</li>
          <li>Some system-parameter ergonomics still require lower-level public <code>World</code> access</li>
          <li>The current Basic 3D path does not prove production shadows, HDR, automatic exposure, or tonemapping</li>
          <li>Packaging and distribution remain part of later readiness work</li>
        </ul>
      </article>
      <article class="kova-roadmap-column">
        <p class="kova-card-label">Active directions</p>
        <ul class="kova-compact-list">
          <li>Production content loading and external project workflows</li>
          <li>Ordinary engine-user API ergonomics</li>
          <li>Editor pre-alpha architecture and tools</li>
          <li>Broader renderer and material readiness</li>
          <li>Audio, animation, runtime UI, and gameplay-support systems</li>
          <li>Networking and server-authoritative architecture</li>
          <li>Scripting, modding, and data-driven authoring</li>
          <li>Optional voxel extensions as an extensibility pressure test</li>
          <li>Structured interfaces for future tooling and automation</li>
        </ul>
      </article>
    </div>
    <p class="kova-research-note">Structured, inspectable engine operations may later support external tools and coding agents, but agent-facing integration is currently a research direction rather than a released feature.</p>
  </section>

  <section class="kova-section kova-separation">
    <div>
      <p class="kova-section-label">Product neutrality</p>
      <h2>Engine foundation and downstream pressure test</h2>
      <p>Kova and Freven are deliberately separated.</p>
      <p>Kova owns the reusable engine, public APIs, runtime composition, renderer boundaries, examples, and validation infrastructure.</p>
      <p>Freven is a downstream game and product that can pressure-test Kova through the same public interfaces intended for other projects. Game-specific content, account systems, launcher behavior, publishing, moderation, and product policy remain outside the Kova engine repository.</p>
      <p>This separation helps prevent one game's requirements from becoming accidental engine architecture.</p>
    </div>
    <div class="kova-separation-diagram" aria-label="Kova and Freven dependency direction">
      <div class="kova-node kova-node-primary"><strong>Kova</strong><span>Reusable engine foundation</span></div>
      <div class="kova-arrow" aria-hidden="true">downstream use</div>
      <div class="kova-node"><strong>Freven</strong><span>Game and product pressure test</span></div>
    </div>
  </section>

  <section class="kova-section">
    <p class="kova-section-label">Related engineering work</p>
    <h2>Work around engines and difficult boundaries</h2>
    <div class="kova-related-grid">
      <article>
        <span class="kova-related-type">Private compatibility work</span>
        <h3>RodinBridge and Godot lifecycle reliability</h3>
        <p>Compatibility and reliability work covering plugin lifecycle, subprocess cleanup, WebSocket buffering, malformed-input handling, reconnect and shutdown behavior, local authorization boundaries, and reproducible A/B validation.</p>
        <a href="#contact">Discuss integration work</a>
      </article>
      <article>
        <span class="kova-related-type">Public engineering note</span>
        <h3>Voxel engine architecture notes</h3>
        <p>Lessons around chunk streaming, mesh lifetime, compact block storage, chunk boundaries, and face-culling trade-offs in a mature moddable voxel game.</p>
        <a href="/posts/vintage-story-engine-notes/">Read the engineering note</a>
      </article>
      <article>
        <span class="kova-related-type">Broader work</span>
        <h3>Backend and integration systems</h3>
        <p>Commercial and independent work involving APIs, webhooks, tracking systems, backend services, Docker, Linux, and multi-system debugging.</p>
        <a href="/about/">About my work</a>
      </article>
    </div>
  </section>

  <section class="kova-section kova-about">
    <div>
      <p class="kova-section-label">Developer</p>
      <h2>Built by Danylo Yenikeiev</h2>
      <p>I am a software engineer based in Poland, working across Rust, Python, TypeScript, backend systems, networking, Linux, Docker, and developer tooling.</p>
      <p>Kova is my long-term engine architecture project. Building it requires work across public API design, ECS and application lifecycle, rendering boundaries, scene and transform systems, assets, input, validation infrastructure, and downstream project compatibility.</p>
    </div>
    <div class="kova-about-card">
      <p class="kova-card-label">Open to contract and long-term work</p>
      <ul class="kova-compact-list">
        <li>Game-engine and runtime development</li>
        <li>Editor and developer tooling</li>
        <li>Engine, DCC, and SDK integrations</li>
        <li>Plugins and extension infrastructure</li>
        <li>Networking and local services</li>
        <li>Lifecycle and reliability work</li>
        <li>Automation and tool-facing interfaces</li>
        <li>Difficult cross-system debugging</li>
      </ul>
      <div class="kova-inline-links">
        <a href="https://github.com/ogyrec-o">GitHub</a>
        <a href="/projects/">Projects</a>
        <a href="/about/">About</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </section>

  <section class="kova-contact" id="contact">
    <div>
      <p class="kova-section-label">Contact</p>
      <h2>Working on an engine, tool, or integration?</h2>
      <p>I am interested in technically demanding contract and long-term work around engines, editor tooling, plugins, SDKs, runtime infrastructure, and developer automation.</p>
      <p>The Kova repository remains private during active development, but I can provide a focused private code walkthrough or discuss the architecture for a relevant technical opportunity.</p>
      <p class="kova-contact-meta">Based in Poland | Europe/Warsaw | Available for remote contract work</p>
    </div>
    <div class="kova-contact-actions">
      <a class="kova-button kova-button-primary" href="mailto:ogyrec.404@proton.me?subject=Engine%20or%20tooling%20work">Start a technical conversation</a>
      <a class="kova-button kova-button-secondary" href="https://github.com/ogyrec-o">View my GitHub</a>
    </div>
  </section>

  <footer class="kova-disclaimer">
    Kova is an active technical codename and a private pre-alpha project. Features, APIs, naming, and release plans may change.
  </footer>
</div>
