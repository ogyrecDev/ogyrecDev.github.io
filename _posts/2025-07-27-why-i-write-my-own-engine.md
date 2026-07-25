---
title: "Why I Write My Own Engine"
description: "Why I build a general-purpose game engine from scratch in Rust, what I want to understand, and the architectural rules I care about most."
image: /assets/img/posts/2025-07-27-why-i-write-my-own-engine/preview.png
date: 2025-07-26 23:50:00 +0200
last_modified_at: 2026-07-25 02:30:00 +0200
categories: [engineering, game-engine]
tags: [rust, custom-engine, architecture, ecs, rendering, plugins, game-development]
toc: true
---

I originally wrote this post while my engine was still going through much earlier architectural experiments. The project has changed substantially since then, so this is the version that reflects what I'm actually building now.

This is not an argument that everyone should write a game engine. Most people who want to ship a game should use an existing one.

I do it because building the underlying systems is part of the thing I enjoy.

## The real reason: understanding

I want to understand how the layers fit together instead of only learning how to call them.

That means going deep into questions like:

- how an ECS owns and schedules state
- how render data moves from gameplay state to GPU resources
- how assets keep stable identity across import, loading, and hot reload
- how input, scenes, physics, and plugins fit into a runtime without becoming tightly coupled
- where backend-specific details should stop leaking upward
- how shutdown, reload, and failure paths should behave
- how to make performance measurable instead of intuitive

The deeper I go, the more interesting the work becomes.

## From a game-specific codebase to a general-purpose engine

The project did not start with a perfect architecture.

Earlier versions mixed game code, engine code, modding concerns, and third-party framework assumptions much more heavily. That was useful because it exposed the boundaries I actually needed instead of the boundaries I might have invented on paper.

The current engine is intentionally **general-purpose**. Freven is a game built on top of it, not the definition of what the engine is allowed to be.

That distinction matters.

If a capability is reusable across games, it belongs in the engine or an engine plugin. If it is a Freven-specific rule, content decision, or product behavior, it belongs in Freven.

## The engine should have real downstream users

An engine can look clean in isolation and still be painful to use.

That is why Freven matters to the architecture. It is a real downstream consumer that exercises the engine through gameplay paths rather than synthetic API examples alone.

When I add or change an engine capability, I want to know whether it survives real use:

- voxel chunk loading and world updates
- rendering and collision changes
- interaction and editing
- frame-time budgets
- diagnostics
- plugin boundaries
- asset and content flows

The game is not a special privileged caller. It should use the same public abstractions that other engine users are expected to use.

## Backend details should stop at the boundary

One of the strongest rules in the current architecture is that high-level engine and gameplay APIs should not expose backend-specific implementation handles.

For example, using a graphics backend internally does not mean gameplay systems should know about that backend's device objects, surfaces, or command types.

The same applies to windowing and platform details.

This gives me freedom to change internals without forcing every user-facing system to change with them. It also makes the public API easier to reason about because it describes engine concepts rather than whichever library currently implements them.

## First-party and third-party extensions should play by the same rules

I do not want a plugin API that is technically public while all useful first-party functionality secretly bypasses it.

A good extension model should be strong enough that my own plugins can use the same interfaces an external plugin would use.

That pressure tends to reveal bad APIs early. If I need privileged internal access every time I build something substantial, the public abstraction is probably incomplete.

## Ownership and lifecycle are architecture too

A lot of engine bugs do not come from the glamorous parts of graphics or physics. They come from ownership that was never made explicit.

Who creates this resource?
Who shuts it down?
Can it be created twice?
What survives a reload?
What happens after a partial failure?
Can a stale connection still mutate state?

I care a lot about these paths because systems that work only during the happy path are not finished systems.

This has influenced how I think about processes, sockets, tasks, plugins, assets, and runtime resources in general: creation and cleanup are two halves of the same design.

## Why Rust

Rust fits the kind of work I want to do.

It gives me low-level control while making ownership and aliasing part of the design instead of something I can postpone indefinitely. The type system is especially useful when the project grows across many crates and subsystem boundaries.

It is not magic. You can still build bad architecture in Rust. But it gives me good tools for making invalid states harder to express and for being explicit about who owns what.

## Why not just use Godot, Unity, Unreal, or Bevy?

I have a lot of respect for existing engines and frameworks. I spent years working with Godot and GDExtension, and I still work with existing engine codebases when the job calls for it.

But my goal here is different.

I am not building this engine because existing tools cannot make games. They obviously can.

I am building it because I want control over the architecture, I want to learn the foundations directly, and I enjoy the engineering itself enough that the engine is not merely an obstacle between me and a finished game.

## What I do not rewrite for ideological reasons

"From scratch" does not mean pretending the operating system, graphics APIs, libraries, or ecosystem do not exist.

I use dependencies when they provide a good implementation boundary. The important part is that the architecture should own its concepts instead of accidentally becoming the object model of a dependency.

That is the difference I care about.

## Testing the boundaries

As the engine has grown, tests have become increasingly architectural rather than just local unit checks.

I want reproducible external-consumer examples, lifecycle regression tests, clean shutdown/restart behavior, deterministic simulation where appropriate, and focused tests for bugs that actually happened.

A regression test is most valuable when it preserves a lesson the codebase already paid to learn.

## The goal

I want the engine to become a practical, understandable, extensible foundation for different 2D and 3D projects, with Freven as one demanding real-world consumer rather than the only possible game.

The repository is private while the current foundation is being prepared for public release. When it becomes public, I want the architecture and examples to be clear enough that another engineer can understand the boundaries without needing a private tour of the codebase.

That is also one of the reasons I write posts like this.

## Final note

Writing your own engine is usually the longer path to shipping a game.

For me, that is not a hidden cost. It is part of the work I wanted to do in the first place.

I like building systems, taking them apart mentally, finding where abstractions stop matching reality, and rebuilding them until the boundaries make sense.

The deeper I go, the more I enjoy it.

---

You can find my current public work on **[GitHub](https://github.com/ogyrec-o)** or see a compact overview on the **[Projects](/projects/)** page.
