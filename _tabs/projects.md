---
icon: fas fa-code-branch
order: 4
---

A compact overview of what I'm building and the public work that best represents my current engineering focus.

## Modular Rust game engine

My main project is a **modular, general-purpose game engine built from scratch in Rust**.

It includes custom runtime and ECS architecture, rendering, assets and content, input, scenes, physics, plugins, task systems, voxel capabilities, tooling, testing, and backend-neutral public APIs.

The architecture is deliberately layered: high-level engine and gameplay code should not depend directly on backend-specific graphics or windowing handles, and extension points are designed to work for first-party and third-party plugins through the same public interfaces.

The repository is currently private while the engine is being prepared for public release.

## Freven

**Freven** is a voxel game built on top of my engine and used as a real downstream validation project.

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
