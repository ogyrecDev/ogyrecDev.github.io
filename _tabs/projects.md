---
icon: fas fa-code-branch
order: 4
---

<style>
  .kova-project-feature {
    position: relative;
    overflow: hidden;
    margin: 1.4rem 0 2.2rem;
    padding: 1.5rem;
    background:
      radial-gradient(circle at 88% 18%, rgba(124, 144, 255, 0.24), transparent 16rem),
      linear-gradient(135deg, rgba(20, 31, 53, 0.98), rgba(8, 17, 30, 0.98));
    border: 1px solid rgba(139, 161, 220, 0.28);
    border-radius: 18px;
    box-shadow: 0 18px 55px rgba(0, 7, 17, 0.28);
  }

  .kova-project-feature::after {
    content: "K";
    position: absolute;
    right: -0.35rem;
    bottom: -3.7rem;
    color: rgba(152, 168, 255, 0.08);
    font-size: 13rem;
    font-weight: 900;
    line-height: 1;
    pointer-events: none;
  }

  .kova-project-feature > * {
    position: relative;
    z-index: 1;
  }

  .kova-project-feature .kova-project-label {
    margin: 0 0 0.55rem;
    color: #72d7dc;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .kova-project-feature h2 {
    margin: 0 0 0.65rem;
    font-size: clamp(1.65rem, 4vw, 2.45rem);
  }

  .kova-project-feature p {
    max-width: 760px;
    color: #b9c6da;
  }

  .kova-project-feature a {
    display: inline-flex;
    margin-top: 0.35rem;
    padding: 0.72rem 1rem;
    color: #07101b;
    background: linear-gradient(135deg, #a7b4ff, #6edfe1);
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 800;
    text-decoration: none;
  }
</style>

A compact overview of what I'm building and the public work that best represents my current engineering focus.

<div class="kova-project-feature">
  <p class="kova-project-label">New technical preview</p>
  <h2>Kova Engine</h2>
  <p>A detailed look at the current public-style 2D and 3D examples, engine-user API shape, architecture boundaries, validation approach, capability status, current limitations, and public-source pre-alpha work.</p>
  <a href="/projects/kova/">Open the Kova technical preview</a>
</div>

## Modular Rust game engine

My main project is **Kova**, a modular, general-purpose game engine built from scratch in Rust.

It includes custom runtime and ECS architecture, rendering, assets and content, input, scenes, physics, plugins, task systems, voxel capabilities, tooling, testing, and backend-neutral public APIs.

The architecture is deliberately layered: high-level engine and gameplay code should not depend directly on backend-specific graphics or windowing handles, and extension points are designed to work for first-party and third-party plugins through the same public interfaces.

The repository is currently private while the engine is being prepared for a public-source pre-alpha release. The current technical preview documents the implemented public application, scene, 2D, 3D, input, camera, transform, and validation paths without presenting the engine as production-ready.

## Freven

**Freven** is a voxel game built on top of Kova and used as a real downstream validation project.

Current work exercises voxel world and chunk management, rendering and collision updates, interaction, world streaming, diagnostics, frame-time performance, and the boundary between reusable engine capabilities and game-specific behavior.

If you want to follow the project, discuss development, or just hang around, you can join the **[Freven Discord](https://discord.gg/jNzCBNSMyW)**.

## AI and simulation systems

I maintain a set of AI and simulation systems covering deterministic neural networks, recurrent and delayed connections, NEAT and neuroevolution, evolutionary algorithms, reinforcement learning, artificial life, ecological simulation, and reproducible experiment tooling.

The goal is not just to produce interesting behavior, but to make experiments inspectable and reproducible: deterministic random domains, explicit state transitions, measurable outcomes, and simulation logic that can remain independent from rendering when needed.

Most of this work is private for now.

## Selected public work

### [Quinn: Windows/Wine ECN compatibility](https://github.com/quinn-rs/quinn/pull/2532)

Merged upstream contribution to Quinn's UDP layer. It makes ECN best-effort on Windows so QUIC endpoint creation can continue when Wine/Proton lacks optional Winsock ECN functionality, while preserving strict handling for unrelated socket errors.

### [Rune Companion](https://github.com/ogyrec-o/rune-companion)

Python LLM companion framework with streaming responses, per-dialog history, long-term SQLite memory, task workflows, injected LLM/storage/TTS interfaces, and console/Matrix connectors.

### [Gridworld Learning Lab](https://github.com/ogyrec-o/gridworld-learning-lab)

Rust reinforcement-learning experiment with tabular Q-learning, seeded environments, saved policies and configuration, evaluation metrics, and deterministic visual rollouts.

## Engineering notes and influences

I also write about ideas that shaped how I think about engine architecture. One example is **[Voxel Engine Notes from Discussions with Vintage Story's Tyron Madlener](/posts/vintage-story-engine-notes/)**, which summarizes what I learned in 2025 about chunk streaming, mesh lifetime, compact block storage, chunk boundaries, and face-culling trade-offs in a mature moddable voxel game.

The article focuses on the engineering lessons rather than the correspondence itself, and clearly separates those 2025 implementation notes from Vintage Story's current public documentation.

## Older work

My GitHub also contains older experiments, game prototypes, Godot/GDExtension work, networking tests, and previous iterations of Freven. Those repositories are useful as history, but they do not necessarily represent the architecture or technical direction of my current engine and AI work.

For the most current public overview, see **[my GitHub profile](https://github.com/ogyrec-o)**.
