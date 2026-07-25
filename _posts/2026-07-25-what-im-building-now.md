---
title: "What I'm Building Now"
description: "A current overview of my Rust game-engine work, Freven, AI and simulation systems, and selected public engineering projects."
date: 2026-07-25 02:30:00 +0200
categories: [devlog, engineering]
tags: [rust, game-engine, ai, simulation, networking, freven]
toc: true
---

My public site has been quiet for a while, but the engineering work has not.

The architecture I described in older posts changed substantially over the last year, so this is the compact current picture.

## A general-purpose Rust game engine

My main project is a **modular, general-purpose game engine I'm building from scratch in Rust**.

It is not a thin game framework and it is no longer tied to the older architecture described by some of my 2025 posts.

Current work spans:

- runtime and ECS architecture
- rendering and render-scene boundaries
- assets and content pipelines
- input and camera systems
- scenes and transforms
- physics and character-facing systems
- plugins and extension APIs
- tasks and filesystem abstractions
- voxel storage, lighting, meshing, rendering, and collision
- diagnostics, testing, CI, and cross-platform validation

A recurring design rule is that high-level engine APIs should describe engine concepts rather than expose backend-specific objects. Graphics and windowing implementations belong behind explicit boundaries.

I also want first-party plugins to use the same public extension model that third-party plugins would use. If useful internal code constantly needs a secret privileged path, the public API probably is not good enough yet.

The repository is private while I prepare the current foundation for public release.

## Freven as a real downstream game

**Freven** is now a game built on top of the engine rather than the place where generic engine architecture lives.

That makes it useful as a pressure test.

Recent work has exercised real gameplay paths around voxel chunk synchronization, rendering and collision updates, editing, diagnostics, and frame-time budgets. When something reusable is missing, I can improve the engine boundary and then consume it from the game instead of quietly wiring game-specific shortcuts into the runtime.

That feedback loop is one of the most valuable parts of building the engine and game together.

## AI, evolution, and artificial life

A second major area of work is AI and simulation.

I have been building systems around:

- deterministic neural-network execution
- recurrent and time-delayed connections
- NEAT and neuroevolution
- evolutionary algorithms
- reinforcement learning
- artificial life
- ecological and evolutionary simulation
- deterministic experiment tooling

The part I care about most is not just getting an agent to do something interesting once. I want experiments to be inspectable and repeatable: explicit random domains, measurable outcomes, stable experiment profiles, and simulation logic that can remain independent from rendering.

Some of these systems integrate with the engine; others stay engine-independent on purpose.

## Public work

Most of the current engine and simulation work is private, but there are several public projects that show different parts of what I do.

### Quinn: Windows/Wine networking

I contributed a fix to **[Quinn](https://github.com/quinn-rs/quinn/pull/2532)** that was merged upstream.

The issue was in the Windows UDP path: some Winsock providers under Wine/Proton do not implement optional ECN socket functionality. Treating that capability as mandatory could prevent a QUIC endpoint from being created at all.

The fix makes ECN best-effort for those unsupported cases while preserving normal failure handling for unrelated socket errors.

### Rune Companion

**[Rune Companion](https://github.com/ogyrec-o/rune-companion)** is a small Python LLM companion framework with streaming model responses, long-term SQLite memory, task workflows, and console/Matrix connectors.

The architecture separates the core from I/O and external services through injected interfaces for LLM, memory, task, messaging, and TTS functionality.

### Gridworld Learning Lab

**[Gridworld Learning Lab](https://github.com/ogyrec-o/gridworld-learning-lab)** is a small Rust reinforcement-learning project built around tabular Q-learning.

The interesting part is the experiment discipline: fixed seeds, persisted configuration and policies, evaluation metrics, and deterministic visual rollouts instead of only a training loop that appears to work.

## What I like working on

The common theme across these projects is that I enjoy engineering where the interesting part is below the surface.

I like designing boundaries, tracing ownership, debugging failures that cross subsystem lines, measuring performance, reproducing weird behavior, and getting into unfamiliar codebases until the actual problem becomes clear.

Rust is my main language, but the language is secondary to the system I am trying to understand.

I am also open to contract work and longer-term engineering collaboration, particularly around systems, game engines, integrations, networking, AI/simulation, performance, and difficult debugging.

---

For a shorter project list, see **[Projects](/projects/)**. Public code and contributions are on **[GitHub](https://github.com/ogyrec-o)**.
