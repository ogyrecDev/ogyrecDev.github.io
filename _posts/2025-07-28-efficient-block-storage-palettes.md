---
title: "Efficient Block Storage with Per-Chunk Palettes"
description: "How block palettes reduce chunk memory usage and scale well to thousands of block types. Includes clear logic, reasoning, and edge-case handling."
image: /assets/img/posts/2025-07-28-efficient-block-storage-palettes/preview.png
date: 2025-07-28 21:30:00 +0200
categories: [guides, voxel]
tags: [voxel, block-storage, palette, optimization, terravox, chunk]
toc: true
keywords: ["voxel palette", "block id", "chunk storage", "memory efficient voxel", "block system", "mod support", "paletted chunks", "voxel optimization", "terravox", "vintage story", "minecraft"]
---

When building a voxel game engine, one of the first questions you'll run into is:  
**How should I store block data in a chunk efficiently - without wasting memory, and without limiting flexibility?**

This post explains the **palette-based approach** I use in [TerraVox](https://discord.gg/zKY3Tkk837), why it's better than just storing raw `u16` block IDs, and what to do **if your chunk ends up with more than 255 block types**.

It's written especially for people who are just starting out - because when I was starting, I had no idea this was even something I needed to care about. Until a developer from Vintage Story explained it to me.

---

## 1. The Naive Way: Store Block IDs Directly

Let's say your world supports `u16` block IDs (i.e., up to 65536 different blocks).

The simplest approach is to just store one `u16` per voxel in a chunk:

```rust
let blocks: Vec<u16> = vec![0; 32 * 32 * 32]; // one per voxel
```

That's **65,536 bytes per chunk**, or **64 KB**.

For a single chunk, it's not much.  
But for 100,000 chunks? Now you're at ~6.5 GB of raw block data - and you haven't even stored lighting, metadata, or entities.

The thing is: **most chunks don't use more than 50–100 unique block types.** So why waste 2 bytes per voxel?

---

## 2. The Palette-Based Format (Used in TerraVox and Vintage Story)

Both [TerraVox](https://discord.gg/zKY3Tkk837) and [Vintage Story](https://www.vintagestory.at/) use a **per-chunk palette** system for compact block storage.

When I was first learning how voxel engines work internally, Tyron (the developer of Vintage Story) explained this idea to me - and it completely changed how I thought about memory layout and efficiency. Now I'm sharing it here, in case it helps others the same way.

> **Note from Tyron (Vintage Story developer in direct message):**  
> Block data we store in a paletted format, much like a .gif picture file has a palette of up to 255 colors + an index to that color for each pixel. Each 32x32x32 chunk gets its own palette. This allows for very compact storage (because most chunks never have many variants of blocks), but you do need to resize the palette and index array when new types get added.

In TerraVox, I use the same approach:

- The global `BlockId` is a `u16`, which supports up to 65,536 unique block types.
- Each chunk contains:
  - A local palette: `Vec<BlockId>` (up to 255 entries)
  - A data array: `Vec<u8>` (32x32x32 = 32768 entries), where each byte is an index into the palette

This format reduces memory usage to:

- `32768` bytes for the block index array
- + up to `255 x 2 = 510` bytes for the palette

**Total per chunk:** ~33 KB
**-> almost 2x smaller than the naive `u16`-per-block approach.**

---

## 3. Code Example

Simplified structure:

```rust
struct Chunk {
    palette: Vec<BlockId>,   // max 255 entries
    blocks: Vec<u8>,         // 32768 entries, one per voxel
}
```

Accessing a voxel:

```rust
let index = chunk.blocks[flat_index(x, y, z)];
let block_id = chunk.palette[index as usize];
```

Inserting a block:

```rust
fn insert_block(chunk: &mut Chunk, block: BlockId) -> u8 {
    if let Some(i) = chunk.palette.iter().position(|&b| b == block) {
        return i as u8;
    }
    if chunk.palette.len() >= 255 {
        panic!("Chunk palette full");
    }
    chunk.palette.push(block);
    (chunk.palette.len() - 1) as u8
}
```

---

## 4. Why It Works So Well

Most chunks only contain a small set of blocks:

- Grass, dirt, stone, water, air - that's already enough for basic terrain.
- Even complex chunks rarely go beyond 100–150 block types.
- You can support **up to 65536 global block types**, but each chunk only needs to care about what's actually used **in that location**.

So by using `u8` + palette, you:

- Store only 1 byte per block (instead of 2), cutting chunk memory usage nearly in half
- Still fully support `u16` global BlockIds via the per-chunk palette
- Avoid bloating chunk data with large global IDs

---

## 5. What If a Chunk Has More Than 255 Unique Blocks?

Let's be honest - this is rare. But it can happen in:

- Highly modded games
- Generated structures with lots of decoration
- Biome transitions or corrupted chunks

### Option A: Fallback to `u16` format (recommended)

Just give up the palette for that chunk and store raw `u16` per block.

**Pros:**
- Simple
- Reliable
- Only increases memory for that chunk

**Cons:**
- ~2x memory for that chunk

This is what Minecraft does internally: it upgrades a chunk's `bits_per_block` when needed.

### Option B: Multiple palettes (not recommended)

You could try tricks like:

- Splitting palette across two `Vec<BlockId>`s
- Using `u8` index where high bit = "palette group"

But this adds:
- More indirection
- Harder logic
- More chances to screw up cache locality

**For what?** Saving 1 KB in the worst case? Usually not worth it.

### Option C: Bit-packed dynamic format (advanced)

Minecraft Java Edition (since 1.13) uses a more advanced version of this idea, where the number of bits per block dynamically adjusts based on how many unique block types are present in the chunk section (16x16x16 blocks).

Instead of always storing 8 bits per voxel, the game calculates the minimal number of bits needed to index the palette:

- 2 unique blocks -> 1 bit
- 4 blocks -> 2 bits
- 16 blocks -> 4 bits
- 256 blocks -> 8 bits
- More -> fallback to 13-bit global block state IDs (palette is discarded)

The block indices are packed into a compact bitstream (not a `Vec<u8>` or `Vec<u16>`, but a stream of bits).
Minecraft implements this using classes like `PalettedContainer` and `BitStorage`.

**Pros:**
- Extremely compact for simple chunks (e.g. plains, caves)
- Scales naturally with chunk complexity
- Used in production (Minecraft Java Edition since 1.13)

**Cons:**
- Access is slower than flat arrays (`Vec<u8>`), especially on CPU
  (bit shifts and masking are needed for each get/set)
- Serialization is more complex - can't just write raw memory, need to store `bits_per_block` + packed stream
- Harder to debug - binary layout is opaque, not directly readable

This approach is highly efficient - but probably overkill unless you're optimizing for disk or network size. Still, it's a great idea to be aware of, especially if you want to push your engine further in the future.

---

## 6. Summary: When to Use a Palette?

| Scenario                            | Recommendation          |
|-------------------------------------|-------------------------|
| <= 255 block types in chunk         | Use `u8 + palette`      |
| > 255 block types in chunk (rare)   | Fallback to `u16`       |
| > 255 is frequent (unusual)         | Consider fixed `u16`    |
| Extreme compression required        | Consider bit-packed     |

In most games, and certainly in TerraVox, **palettes are the best default.**  
They strike a great balance between **performance, flexibility, and memory use.**

---

## Final Thoughts

I didn't know about this when I started writing a voxel game.
There wasn't a simple post or guide that explained the logic clearly.
This was told to me by a developer from Vintage Story, and it changed how I thought about data storage in voxel games.

So if you're starting out - I hope this helps.

---

## Contacts

- GitHub: [@ogyrec-o](https://github.com/ogyrec-o)
- Email: ogyrec.404@proton.me
- Discord: `ogyrec_`
- [TerraVox Discord](https://discord.gg/zKY3Tkk837)
