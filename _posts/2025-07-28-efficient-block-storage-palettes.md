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
**How should I store block data in a chunk efficiently – without wasting memory, and without limiting flexibility?**

This post explains the **palette-based approach** I use in [TerraVox](https://discord.gg/zKY3Tkk837), why it's better than just storing raw `u16` block IDs, and what to do **if your chunk ends up with more than 255 block types**.

It's written especially for people starting out – because when I began, I had no idea this even mattered. Until a developer from Vintage Story explained it to me.

---

## 1. The Naive Way: Store Block IDs Directly

Let’s say your world uses `u16` block IDs – that gives you up to **65,536 global block types**.

The simplest way to store a chunk is:

```rust
let blocks: Vec<u16> = vec![0; 32 * 32 * 32]; // one per voxel
```

That’s **65,536 bytes per chunk**, or **64 KB**.

For one chunk it’s fine.  
But across 100,000 chunks, that’s ~6.5 GB of block data – not counting lighting, metadata, or entities.

The problem is: **most chunks don’t use more than 50–100 unique blocks.** So why waste 2 bytes per voxel?

---

## 2. The Palette-Based Format (Used in TerraVox and Vintage Story)

Both [TerraVox](https://discord.gg/zKY3Tkk837) and [Vintage Story](https://www.vintagestory.at/) use **per-chunk palettes** for compact block storage.

> **Note from Tyron (Vintage Story dev via DM):**  
> Block data we store in a paletted format, much like a .gif file with a color palette. Each 32x32x32 chunk gets its own palette. This allows compact storage (because most chunks never use many variants of blocks), but you do need to resize the palette and index array when new types get added.

In TerraVox, the format is:

- Global `BlockId` is `u16` (supports up to 65,536 unique block types).
- Each chunk stores:
  - A **palette**: `Vec<BlockId>` (max 255 entries)
  - A **data array**: `Vec<u8>` (32768 entries), indexing into the palette

Memory usage:

- 32 KB for block indices (`32768` x `u8`)
- + max ~0.5 KB for the palette (`255` x `u16`)

**Total: ~33 KB per chunk -> nearly 2x smaller than naive `u16` storage.**

---

## 3. Code Example

Structure:

```rust
struct Chunk {
    palette: Vec<u16>,     // global BlockIds
    blocks: Vec<u8>,       // indices into palette
}
```

Access a voxel:

```rust
let index = chunk.blocks[flat_index(x, y, z)];
let block_id = chunk.palette[index as usize];
```

Insert a block:

```rust
fn insert_block(chunk: &mut Chunk, block: u16) -> u8 {
    if let Some(i) = chunk.palette.iter().position(|&b| b == block) {
        return i as u8;
    }
    if chunk.palette.len() >= 255 {
        panic!("Palette overflow: too many unique blocks in chunk!");
    }
    chunk.palette.push(block);
    (chunk.palette.len() - 1) as u8
}
```

---

## 4. Why It Works So Well

Most chunks only contain a small set of blocks:

- Grass, dirt, stone, water, air – that's enough for basic terrain.
- Even complex chunks rarely exceed 100–150 block types.
- You can support **up to 65,536 (or more) global blocks**, but each chunk only needs the local ones.

So with `u8 + palette`, you:

- Use only **1 byte per voxel**
- Still support **full `u16` or even `u32` global BlockIds**
- Avoid bloating memory with huge global IDs

You could also upgrade to `u16` palette indices for up to 65,535 unique blocks per chunk – but most engines never need this. `u8` is compact and cache-friendly.

---

## 5. What If a Chunk Has More Than 255 Unique Blocks?

It’s rare – but can happen in:

- Heavily modded worlds
- Highly decorated structures
- Glitched or biome-transition edge cases

### Option A: Fallback to `u16` format (recommended)

Stop using a palette and store raw `u16` per voxel:

```rust
let blocks: Vec<u16> = vec![0; 32768];
```

**Pros:**
- Very simple to implement
- Constant-time access, no indirection
- No need to manage palettes

**Cons:**
- Uses ~64 KB vs. ~33 KB (≈ 2x memory)
- Slightly slower to serialize due to size
- Wasteful in most chunks

This is what **Minecraft does internally** using `bits_per_block` – if more than 8 bits are needed, it falls back to 13-bit global IDs.  
See [PalettedContainer.java (source)](https://github.com/KryptonMC/Krypton/blob/trunk/server/src/main/java/org/kryptonmc/krypton/world/chunks/PalettedContainer.java).

### Option B: Multiple palettes (not recommended)

Split the palette:

- Use two palettes (`palette_a`, `palette_b`)
- Use high bit of `u8` to select the group

Gives 510 unique blocks with 1-byte indices.

**But...**

**Cons:**
- More branching:
  ```rust
  let block_id = if index < 128 {
      palette_a[index as usize]
  } else {
      palette_b[(index - 128) as usize]
  };
  ```

- Slower and harder to maintain
- Tiny memory savings (~32 KB per chunk)

Too complex for little benefit.

### Option C: Bit-packed dynamic format (advanced)

**Used in Minecraft Java Edition 1.13+**

- For 2 blocks -> 1 bit
- For 4 blocks -> 2 bits
- For 16 blocks -> 4 bits
- For 256 blocks -> 8 bits
- For >256 blocks -> fallback to global ID (13 bits)

Internally stored as a **bitstream** with dynamic `bits_per_block`.

See Mojang's:
- `BitStorage` (bit array)
- `PalettedContainer` (palette + bit-packed storage)

**Pros:**
- Extremely compact in simple chunks (plains/caves)
- Automatically adjusts to chunk complexity

**Cons:**
- Slower: bit shifts, masking, and bounds checks per voxel
- More complex to serialize and debug
- No `Vec<u8>` or `Vec<u16>` – must write custom bitarray

Benchmarks in real-world engines (like Minecraft modded or cubic chunks) often show 1.5x to 2x slower access compared to flat arrays.
So weigh trade-offs carefully.

---

## 6. Do You *Have* to Use `u16`?

No – global `BlockId` can even be `u32` if your game needs >65,536 blocks.

The chunk storage (palette + index) stays the same – just the palette values become `u32`.

- If your world uses 2 million blocks (e.g., modded ecosystem), just change:

```rust
type BlockId = u32; // instead of u16
```

- You can still use `u8` or `u16` indices into the palette, depending on how many block types are in the chunk.

This keeps your system future-proof and avoids artificial limits.

---

## 7. Summary: When to Use a Palette?

| Scenario                            | Recommendation          |
|-------------------------------------|--------------------------|
| ≤ 255 block types per chunk         | Use `u8 + palette`       |
| > 255 block types (rare)            | Fallback to `u16`        |
| Frequent >255 chunks (unusual)      | Consider fixed `u16`     |
| Extreme compression needs           | Use bit-packed           |
| Global block count > 65536          | Use `u32` BlockId        |

**Per-chunk palettes are the best default** – compact, flexible, and widely used.

---

## Final Thoughts

I didn’t know about this when I started building TerraVox.  
There wasn’t a simple post explaining it clearly.

Back when I was learning voxel engine internals, Tyron from Vintage Story explained this idea to me – and it completely changed how I thought about chunk storage.

If you're working on a voxel game, I hope this guide saves you from the same early mistakes – and gives you a solid foundation to build on.

---

## Contacts

- GitHub: [@ogyrec-o](https://github.com/ogyrec-o)  
- Email: ogyrec.404@proton.me  
- Discord: `ogyrec_`  
- [TerraVox Discord](https://discord.gg/zKY3Tkk837)
