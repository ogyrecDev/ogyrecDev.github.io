---
layout: page
title: Kova Engine
description: A technical preview of Kova, a modular general-purpose Rust game engine foundation with public 2D and 3D authoring APIs, explicit backend boundaries, and runnable validation examples.
permalink: /projects/kova/
toc: true
image:
  path: /assets/img/kova/kova-social-preview.svg
  alt: Kova Engine technical preview
---

> **Rust** | **Private development repository** | **Preparing for public-source pre-alpha**
{: .prompt-info }

## A modular, general-purpose game engine foundation written in Rust

Kova explores a library-first engine architecture with public 2D and 3D authoring APIs, explicit plugin and backend boundaries, and validation through real runnable examples.

The engine is under active private development. Its current milestone proves the core public application, scene, rendering, input, and transform paths without requiring game code to manage WGPU, winit, or the renderer lifecycle directly.

[Explore the demos](#camera-orbit) | [View the architecture](#architecture) | [Discuss engine or tooling work](#contact)

![Illustrated placeholder for the Kova Camera Orbit example](/assets/img/kova/kova-camera-orbit-placeholder.svg)
_Illustrated placeholder. Replace this image with the real Camera Orbit video poster and use the WebM/MP4 recording in the same position._

## At a glance

| | |
|---|---|
| **Runnable 2D and 3D paths** | Public engine APIs are exercised through real desktop examples rather than architecture documents alone. |
| **Backend-hidden user API** | Ordinary example code does not manage WGPU resources, winit events, or manual render lifecycle stages. |
| **Validation-driven development** | Visual examples are paired with deterministic or backend-free smoke paths where practical. |
| **Public release preparation** | The private repository is being prepared for an explicitly unstable public-source pre-alpha release. |

## What Kova is

Kova is a general-purpose engine foundation rather than a game-specific framework or renderer experiment.

Its public surface is being designed so that an external project can construct an application, compose plugins, author scenes, create assets, respond to input, and run through a normal desktop path without reaching into backend implementation details.

The current codebase includes engine foundation, ECS and application layers, public scene and transform authoring, 2D and 3D rendering paths, input and camera APIs, assets, materials, meshes, diagnostics, desktop runtime composition, and optional voxel extension work.

Kova remains pre-alpha. The current examples prove selected vertical paths; they do not yet claim that the engine can ship a complete production game.

### Current status

- M2 public API validation milestone completed
- Runnable Camera Orbit, Basic 3D, and Basic 2D examples
- Public-source pre-alpha release gate in progress
- Editor pre-alpha remains future work
- APIs may change before public release

## Demos

### Camera Orbit

A small interactive 3D example built entirely through public Kova app, desktop, input, scene, mesh, material, light, camera, and transform APIs.

Mouse input updates the camera's local transform while Kova's normal transform propagation derives the global state before extraction and rendering.

![Illustrated placeholder for the Camera Orbit demo](/assets/img/kova/kova-camera-orbit-placeholder.svg)
_Camera orbit driven through Kova's public app, input, camera, and transform APIs. Replace this placeholder with the final recording._

#### Controls

- Move the mouse to orbit around the scene
- Press `Escape` to release the cursor
- Click the left mouse button to capture it again
- Vertical rotation is clamped to prevent inversion

#### What it proves

- public `KovaApp` construction
- public desktop plugin composition
- ordinary `Startup` and `Update` systems
- keyboard, mouse button, and mouse motion resources
- camera authoring through public components
- local and global transform propagation
- lit materials and point lighting
- cursor capture through a public window-facing contract
- no direct WGPU, winit, or manual renderer lifecycle usage

#### Application and system composition

```rust
use kova_desktop::prelude::*;

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

app.run()?;
```

_Representative excerpt from the current private example. Error handling and cursor-state setup are shortened here for readability._

#### Public scene, mesh, material, and light authoring

```rust
let mut scene = SceneList::new();

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
        StandardMaterial::lit(
            Color::srgb_rgb(124.0 / 255.0, 144.0 / 255.0, 1.0),
        )
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

scene.apply(world)?;
```

The public example creates its scene without obtaining GPU buffers, render passes, swapchain objects, or backend resource handles.

#### Camera transform from public input state

```rust
fn camera_transform(
    yaw: AngleRadians,
    pitch: AngleRadians,
    target: Vec3,
    distance: f32,
) -> Transform3d {
    let orientation = Transform3d::from_euler(
        EulerRot::YXZ,
        yaw,
        pitch,
        AngleRadians::ZERO,
    );

    let position = target - orientation.forward() * distance;

    Transform3d::from_translation(position)
        .looking_at(target, Vec3::Y)
}
```

The full example validates finite input, wraps yaw, clamps pitch, handles cursor capture, and updates exactly one marked camera.

> **Current ergonomics note:** The current typed system adapter does not yet combine every resource and mutable query shape required by this example. Camera Orbit therefore uses Kova's public raw `World` system form for the update system. It still does not access backend or renderer internals.
{: .prompt-warning }

### Basic 3D

The Basic 3D example is a minimal static desktop scene authored through the same public APIs intended for external engine users.

It creates generated meshes, lit standard materials, ambient lighting, a photometric point light, a perspective camera, and local transforms before running through Kova's public desktop path.

![Illustrated placeholder for the Kova Basic 3D example](/assets/img/kova/kova-basic-3d-placeholder.svg)
_A blue cube on a white circular base rendered by the Kova Basic 3D example. Replace with `kova-basic-3d.webp`._

```rust
let mut app = KovaApp::new();

app.add_plugins(
    KovaDesktopPlugins::new()
        .with_window_title(WindowTitle::new("Kova Basic 3D"))
        .with_window_size(WindowSize::new(960, 540)),
)?;

app.add_systems(Startup, setup_basic_3d_scene);
app.run()?;
```

```rust
let camera_transform =
    Transform3d::from_xyz(-2.5, 4.5, 9.0)
        .looking_at(Vec3::ZERO, Vec3::Y);

scene.camera_3d_local(camera, camera_transform);
```

#### What this proves

- one normal public desktop runner path
- generated meshes with position and normal data
- public lit material descriptors
- public camera authoring
- local transform placement
- normal local-to-global propagation
- a lit forward rendering path
- no manual prepare, queue, render, or present calls

> **Current limitation:** This example does not claim a production renderer. Point-light shadows are disabled in this path, and automatic exposure and tonemapping are not yet part of the example's fixed SDR calibration.
{: .prompt-info }

### Basic 2D

The Basic 2D example validates a separate 2D authoring path rather than presenting 2D objects as dummy 3D geometry.

A translated and rotated root owns two child draws. Explicit `DrawOrder2d` values prove that visible ordering is independent of entity creation order.

![Illustrated placeholder for the Kova Basic 2D example](/assets/img/kova/kova-basic-2d-placeholder.svg)
_A coral rectangle and blue hexagon rendered through Kova's public 2D APIs. Replace with `kova-basic-2d.webp`._

```rust
world.spawn(KovaDesktopScene2d::default_camera())?;

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

world.insert_component(front, Parent::new(root))?;
```

#### What this proves

- an orthographic public 2D camera
- generated rectangle and regular-polygon meshes
- typed sRGB colors
- unlit material descriptors
- explicit 2D draw ordering
- parent-child transform propagation
- same-frame world transform resolution
- a dedicated 2D path without transform-Z ordering hacks

> **Current limitation:** The example does not yet claim sprites, textures, tilemaps, text, runtime UI, animation, physics, batching, alpha blending, or a complete 2D game workflow.
{: .prompt-info }

## Architecture

Kova is divided by ownership and dependency boundaries rather than by arbitrary feature folders.

User-facing domain APIs remain separate from WGPU, winit, and platform-specific resource ownership. Runtime and backend crates may use those dependencies, but gameplay-facing code should not need to understand them.

![Kova architecture layers from external project to backend integrations](/assets/img/kova/kova-architecture.svg)

### Backend-hidden gameplay APIs

Gameplay-facing and domain APIs should not expose WGPU objects, winit events, backend resource handles, or manual rendering lifecycle operations.

### Public extension symmetry

First-party plugins should use the same public extension mechanisms intended for future third-party plugins. Kova should not rely on privileged internal plugin paths.

### Product-neutral engine core

Kova remains independent from the Freven game, platform, content, and publishing policy. Freven acts as a downstream pressure test rather than defining the engine's public identity.

### Library-first, editor-aware

The runtime should remain usable without an editor. Editor architecture is being planned early, but it is not allowed to become a hidden requirement for building or running a project.

## What engine-user code should look like

Kova's high-level examples are intentionally written to resemble external user code.

A project should be able to:

1. construct a `KovaApp`
2. compose public plugins
3. register startup and update systems
4. author assets and scene entities
5. respond to public input resources
6. run through a public desktop path

It should not need to:

- allocate GPU buffers manually
- own a surface or swapchain
- call render extraction stages
- invoke prepare, queue, or present functions
- process raw winit events
- import product-specific Freven types

```rust
let mut app = KovaApp::new();

app.add_plugins(KovaDesktopPlugins::new())?;
app.add_systems(Startup, setup_scene);
app.add_systems(Update, update_gameplay);

app.run()?;
```

_The exact public API remains pre-alpha and may change, but the architectural boundary is deliberate._

## Current capability status

| Area | Current evidence | Status |
|---|---|---|
| Application and plugin composition | `KovaApp`, schedules, and desktop plugin groups used by runnable examples | **Working foundation** |
| ECS and resource model | Public world, components, resources, systems, and hierarchy paths | **Working foundation** |
| Desktop runner | Real WGPU/winit desktop path behind public composition APIs | **Working foundation** |
| 3D scene authoring | Basic 3D and Camera Orbit examples | **Validated example** |
| 2D scene authoring | Basic 2D example with hierarchy and draw ordering | **Validated example** |
| Input and camera control | Mouse, keyboard, cursor capture, and orbit camera | **Validated example** |
| Meshes, materials, and lighting | Generated geometry, lit/unlit materials, ambient and point light | **Working vertical path** |
| Transform hierarchy | Public local/global 2D and 3D propagation | **Validated example** |
| Asset identity and catalog work | Logical identities, production catalog, and deterministic variant resolution | **Active development** |
| External project use | Clean external-consumer validation path | **Active validation** |
| Editor | Architecture and authoring tools planned | **Not yet a release claim** |
| Public source release | Licensing, security, CI, docs, and release audit gate | **In preparation** |

## Built through validation, not diagrams alone

Kova's architecture is pressure-tested with small external-style applications and focused validation packages.

The visual examples are kept outside engine crates and consume public interfaces. When an example discovers missing reusable functionality, that gap is fixed or tracked in the owning engine layer rather than hidden inside example-specific code.

Where practical, the same authored paths are paired with backend-free or bounded smoke validation so CI can check application, scene, and frame behavior without requiring an interactive desktop.

```console
cargo +stable run --locked -p kova_example_camera_orbit
cargo +stable run --locked -p kova_example_basic_3d
cargo +stable run --locked -p kova_example_basic_2d
```

> The repository is still private. These commands document the current internal examples and will become usable from a clean public checkout after the public-source release gate is completed.
{: .prompt-info }

### Validation principles

- examples use intended public facades
- engine crates do not depend on example packages
- backend-free validation is preferred when a visible window is unnecessary
- backend-specific types are checked at layer boundaries
- API friction discovered by examples is documented rather than concealed
- clean external-consumer behavior is treated as a release gate

## Current work

With the M2 public API validation milestone complete, current work is split between public-source release preparation, ordinary engine ergonomics, and the production content path.

Recent work focuses on explicit logical asset identity, immutable production catalogs, deterministic asset variant resolution, and reproducible external-consumer validation.

### Production content architecture

Establishing stable logical asset identity, catalog ownership, and deterministic resolution before expanding the authoring and import workflow.

### External consumer path

Ensuring that a project outside the engine workspace can use documented public interfaces without relying on private repository structure or internal hooks.

### Public-source pre-alpha gate

Preparing licensing and provenance, security reporting, public CI, documentation, contribution workflows, distribution rules, launch examples, and a final release audit.

## Pre-alpha means explicit limitations

### Current limitations

- The repository remains private.
- Public APIs are unstable and may change.
- Kova does not yet claim that an external developer can ship a complete game.
- The editor is not production-ready and should not be presented as an existing finished product.
- Current examples prove selected vertical paths rather than complete 2D or 3D production workflows.
- Some system-parameter ergonomics still require lower-level public `World` access.
- The current Basic 3D path does not prove production shadows, HDR, automatic exposure, or tonemapping.
- Packaging and distribution remain part of later readiness work.

### Active directions

- production content loading and external project workflows
- ordinary engine-user API ergonomics
- editor pre-alpha architecture and tools
- broader renderer and material readiness
- audio, animation, runtime UI, and gameplay-support systems
- networking and server-authoritative architecture
- scripting, modding, and data-driven authoring
- optional voxel extensions as an extensibility pressure test
- structured interfaces for future tooling and automation

> Structured, inspectable engine operations may later support external tools and coding agents, but agent-facing integration is currently a research direction rather than a released feature.
{: .prompt-info }

## Engine foundation and downstream pressure test

Kova and Freven are deliberately separated.

Kova owns the reusable engine, public APIs, runtime composition, renderer boundaries, examples, and validation infrastructure.

Freven is a downstream game and product that can pressure-test Kova through the same public interfaces intended for other projects. Game-specific content, account systems, launcher behavior, publishing, moderation, and product policy remain outside the Kova engine repository.

This separation helps prevent one game's requirements from becoming accidental engine architecture.

## Related engineering work

### RodinBridge / Godot compatibility and lifecycle work

A private compatibility and reliability update for a public Godot integration, including plugin lifecycle, subprocess cleanup, WebSocket buffering and malformed-input handling, reconnect and shutdown behavior, local authorization boundaries, and reproducible A/B validation.

### Backend and integration work

Commercial and independent work involving APIs, webhooks, tracking systems, backend services, Docker/Linux, and multi-system debugging.

## Built by Danylo Yenikeiev

I am a software engineer based in Poland, working across Rust, Python, TypeScript, backend systems, networking, Linux, Docker, and developer tooling.

Kova is my long-term engine architecture project. Building it requires work across public API design, ECS and application lifecycle, rendering boundaries, scene and transform systems, assets, input, validation infrastructure, and downstream project compatibility.

I am open to contract and long-term work involving:

- game-engine and runtime development
- editor and developer tooling
- engine, DCC, and SDK integrations
- plugins and extension infrastructure
- networking and local services
- lifecycle and reliability work
- automation and agent-accessible tooling
- difficult cross-system debugging

## Contact

I am interested in technically demanding contract and long-term work around engines, editor tooling, plugins, SDKs, runtime infrastructure, and developer automation.

The Kova repository remains private during active development, but I can provide a focused private code walkthrough or discuss the architecture for a relevant technical opportunity.

- **Email:** [ogyrec.404@proton.me](mailto:ogyrec.404@proton.me)
- **GitHub:** [@ogyrec-o](https://github.com/ogyrec-o)
- **LinkedIn:** [Danylo Yenikeiev](https://www.linkedin.com/in/danylo-yenikeiev/)
- **About:** [About me](/about/)

Based in Poland. Europe/Warsaw. Available for remote contract work.

---

Kova is an active technical codename and a private pre-alpha project. Features, APIs, naming, and release plans may change.
