---
title: "Why I Write My Own Engine"
description: "A deep dive into the motivations, structure, and philosophy behind building a custom engine from scratch. Why not Unity, Godot, or Bevy?"
image: /assets/img/posts/2025-07-27-why-i-write-my-own-engine/preview.png
date: 2025-07-26 23:50:00 +0200
categories: [devlog, freven]
tags: [custom-engine, rust, godot, bevy, modding, indie-dev, architecture]
toc: true
---

This is not a tutorial. It's not a guide. It's a reflection.

Why would someone choose to write their own engine in 2025 - when Unity, Godot, Unreal, and Bevy already exist? Here's my answer, based on experience and intent.

---

## The Real Reason: Understanding

I want to know **how everything works**. 
Not just call `move_and_collide()` or use high-level physics magic - I want to understand what happens under the hood:

- How collisions are resolved.
- How rendering works.
- How ECS should actually behave.
- How memory is used in real-time.
- Why certain things break.

The deeper I go, the more I enjoy it. It's not about reinventing the wheel - it's about **knowing how to shape it**.

---

## The Journey So Far

My project started like many others - one big monolithic codebase where **game and engine were the same**. It worked... until it didn't.

When I tried to add **modding support**, I realized the architecture was wrong. I couldn't build flexible systems without splitting it all up.

So I started over. From zero. Not because I failed, but because I **learned what I really needed**.

---

## Starting Over - But Smarter

I created a new clean structure:

- `engine_core`: the engine internals (some parts currently use Bevy).
- `engine_api`: a clean interface for modding (no Bevy dependency).
- `game`: basic game (like main menu), loads code-based mods.
- `game_creative`: the main creative game mode, written *on top* of my own API - just like a mod.

Now, the API evolves **as I need it**:

- Need logging? Add logging to the engine and expose it in the API.
- Need blocks? Same.
- Need mod registry? Done.

The result: the engine grows *with the game*, and the API always reflects real usage.

---

## The Game is a Mod

In my system, the game itself is written as a mod using my API. 
This approach makes the API better, because I'm its main user.

Yes, the engine still knows about the player, network, etc. - this isn't a general-purpose engine. But these built-in features are exposed via API, so they can be extended by mods too.

And yes - I plan to eventually **replace all Bevy parts** (ECS, rendering, etc.) with my own. Step by step. No rush.

---

## Not Everything Is Mine (Yet)

I don't rewrite everything from scratch immediately - because I want to **release playable builds** sooner, not in 10 years.

That's why:

- I use parts of Bevy (ECS, renderer) **as temporary layers**.
- My API doesn't depend on Bevy - it depends on the engine.
- So when I replace Bevy internals, the API stays stable.

Moral of the story: **I use what's practical**, but I design for control and long-term evolution.

---

## Why Not Just Use Godot?

I've used **Godot for 3000+ hours**.

I still think it's the best choice for solo devs and indie teams. It's better than Unity (IMO) in every way that matters: open source, lightweight, no corporate bloat.

I even used GDExt (Rust + Godot) to avoid GDScript's slowness.

But eventually... I wanted to go lower. Understand more.
I stopped using editors entirely. No visual scripting. No scenes.

Just Rust. Just code. Just logic.

---

## But Why Care About Others Understanding Your Code?

Because I want to build a team - even a small one.

I want other devs to look at my project and say:
**"I get it. I can help. Let's build this."**

So I write cleanly, I comment key parts, I document the API, and I think in terms of:

- Future-proofing.
- Mod support.
- Making it extensible.

And if no one joins? That's fine too. As long as *I* can return in a few months and still understand what I wrote.

---

## API Philosophy

- The engine is closed-source.
- The API is open-source.
- The mods use only the API - not internal engine details.

That means: **modders get powerful tools**, but I still control core logic and stability.
And since I write the creative mode using the same API, I know it works.

This isn't theoretical. It's real. I'm using it daily.

---

## My Goal

I want to release builds. Real ones.
With survival systems, world simulation, thousands of blocks, creatures, and player-driven evolution.

But I also want this to be a platform. A world where:

- Mods thrive.
- Everything is deeply customizable.
- There's freedom - but within solid structure.

---

## Final Note: I'm Not Preaching

I'm not telling you to abandon Unity or Godot.
I'm not saying you *must* build your own engine.

If your goal is to finish a game - **use the tools that help you do that**.

But if your goal is to understand the foundations -
To go deeper -
To remove the magic -

Then hey, welcome to the deep end. Bring snacks.

---

## Need Help? Want to Collaborate?

If you're into low-level systems, modding, voxel engines, or weird simulation stuff -
Feel free to reach out. I'm always open to good conversation and code.

---

## Contacts

- **GitHub:** [@ogyrec-o](https://github.com/ogyrec-o)
- **Signal:** `0546e47e337a19217a59d92043be4433d93a23946a8d171dccfdab393781e9f77a`
- **Discord:** `ogyrec_`
- **Freven Discord:** [https://discord.gg/zKY3Tkk837](https://discord.gg/zKY3Tkk837)
- **Email:** ogyrec.404@proton.me