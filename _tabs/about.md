---
icon: fas fa-info-circle
order: 5
---

Hi, I'm **Danylo Yenikeiev**. I'm a software engineer based in Warsaw, focused on systems, game engines, AI/ML, networking, developer tooling, and difficult debugging.

I genuinely enjoy building things and understanding how complex systems work. Rust is my main language today, with Python as a frequent second tool when it fits the problem better.

## What I'm building

My main project is a **modular, general-purpose game engine I'm building from scratch in Rust**.

The work spans runtime and ECS architecture, rendering, assets and content, input, scenes, physics, plugins, voxel systems, task systems, developer tooling, testing, CI, performance, and API design. A core design goal is keeping high-level engine APIs independent from backend-specific details so engine users and plugins do not need to depend directly on graphics or windowing internals.

**Freven** is a voxel game built on top of the engine and acts as a real downstream consumer. I use it to pressure-test gameplay paths, voxel world and chunk management, rendering and collision updates, interaction, diagnostics, frame-time behavior, and engine API boundaries.

Most of this engine work is private while it is being prepared for a public release.

## AI and simulation

I also work heavily on AI and simulation systems, including:

- deterministic neural-network execution
- recurrent and time-delayed network behavior
- NEAT and neuroevolution
- evolutionary algorithms
- reinforcement learning
- artificial life and ecological simulations
- reproducible experiments and deterministic simulation tooling
- LLM systems with memory, task workflows, and external connectors

Some of this work integrates with my engine, while other parts are intentionally engine-independent.

## Background

I spent years working with **Godot**, including Rust through **GDExtension**, before moving deeper into lower-level Rust systems and my own engine architecture. I still work comfortably in Godot codebases and integrations, and I can get into Unity, Unreal Engine, backend systems, networking stacks, or unfamiliar codebases when the work calls for it.

I especially like problems where the difficult part is figuring out what is actually wrong: reproducing an issue, tracing the root cause across subsystem boundaries, implementing the smallest reliable fix, and adding validation so it stays fixed.

## Selected public work

- **[Quinn: Windows/Wine ECN compatibility](https://github.com/quinn-rs/quinn/pull/2532)** - merged upstream contribution that keeps QUIC endpoint creation working when Wine/Proton does not provide optional Winsock ECN functionality.
- **[Rune Companion](https://github.com/ogyrec-o/rune-companion)** - LLM companion framework with streaming model responses, SQLite-backed memory and tasks, injected service interfaces, and console/Matrix connectors.
- **[Gridworld Learning Lab](https://github.com/ogyrec-o/gridworld-learning-lab)** - reproducible Rust reinforcement-learning experiment with tabular Q-learning, seeded environments, persisted policies, evaluation metrics, and deterministic visual rollouts.

## How I work

I care about clear ownership and dependency boundaries, reproducibility, performance that is measured rather than guessed, and focused regression tests around failures that actually occurred.

I enjoy both building systems from scratch and entering an existing codebase with very little context and working backward from a real failure.

## Contact

I'm open to contract work and longer-term engineering collaboration, especially around systems, engines, integrations, networking, AI/simulation, performance, and debugging.

- **GitHub:** [@ogyrec-o](https://github.com/ogyrec-o)
- **LinkedIn:** [Danylo Yenikeiev](https://www.linkedin.com/in/danylo-yenikeiev/)
- **Email:** [ogyrec.404@proton.me](mailto:ogyrec.404@proton.me)
