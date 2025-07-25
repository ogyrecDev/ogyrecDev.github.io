---
title: "Face Culling for Cubes and Stairs (Vintage Story-like Method)"
description: "Clear explanation of face culling for cubes and stairs in voxel games, inspired by Vintage Story. Includes visuals, logic, and pseudocode."
date: 2025-07-22 11:30:00 +0200
categories: [guides, voxel]
tags: [face-culling, voxels, rendering, vintage-story, stairs, vintage-story-graphics]
toc: true
keywords: ["face culling", "vintage story", "voxel engine", "stairs rendering", "block face culling", "voxel culling", "ogyrec", "terravox", "minecraft", "stairs face culling", "shape face culling", "vintage story face culling"]
---

This guide explains clearly how face culling works for **cubes** and **stairs** in voxel engines.
The explanation is inspired by Vintage Story's method, clarified with real logic examples.

The aim is simplicity: to make sure you understand the logic behind culling clearly and can implement it yourself.

---

## What is Face Culling?

Face culling is skipping the rendering of block faces that are not visible, improving performance significantly.

**Why is it important?**
Without culling, your engine draws thousands of hidden faces - wasting GPU resources and slowing down the game.

---

## 1. Basic Cube Face Culling

For cubes, culling is simple:

- Each face of a cube has a neighbor block.
- If both the current face and the opposite face of the neighbor are **solid**, then the current face is **invisible** and can be skipped.

Here's the logic clearly expressed in pseudocode (Rust-inspired):

```rust
fn should_cull_face(block, face_direction, neighbor_block) -> bool {
    block.is_side_solid(face_direction) && neighbor_block.is_side_solid(face_direction.opposite())
}
```

- **`is_side_solid(face)`** means:
  - Cubes have all faces solid by default.
  - For special blocks (stairs), only specific faces are solid.

- **Opposite faces:**
  - North ↔ South, East ↔ West, Up ↔ Down
  - In code, this can be implemented using simple arrays or enums (bit masks for directions).

---

## 2. Stairs: Why Cubic Logic Breaks

For stairs, simple logic is not enough.
A stair's solid faces are usually only **bottom** and **back**, while the front, sides, and top are not solid by default.

**Example:**
- If you place stairs next to a cube (e.g. side-by-side), the cube's face should **not** disappear because the stair side isn't solid.
- But, if you place **two stairs side-by-side** in the same orientation, the internal faces **should** disappear - even though these faces are not marked as solid.

This is a special case handled differently. It requires recognizing stair-stair adjacency and overriding the default solid-face logic.

---

## 3. Special Culling Logic for Stairs

Stairs need custom logic:

- Stairs **never cull** their top face (always visible).
- The front and sides are not solid by default, but:
  - If two stairs of the **same type** touch each other, faces between them are culled if orientations match, despite faces being non-solid by default.
- Bottom and back faces are solid and always cull as usual.

Clearly put, in pseudocode:

```rust
fn should_cull_face_stairs(block, face_direction, neighbor_block) -> bool {
    let same_block_type = block.type == neighbor_block.type;
    let neighbor_face_solid = neighbor_block.is_side_solid(face_direction.opposite());

    if face_direction == Up {
        return false; // stairs top face is never culled
    }

    // Check special stair alignment logic
    if same_block_type {
        let aligned = check_faces_aligned(block, neighbor_block, face_direction);
        if aligned {
            return true; // aligned stairs: hide face
        }
    }

    // Default solid check otherwise
    block.is_side_solid(face_direction) && neighbor_face_solid
}
```

Here, `check_faces_aligned()` means orientation and geometry match exactly.

```rust
fn check_faces_aligned(a: Block, b: Block, face: BlockFace) -> bool {
    a.shape == b.shape && a.rotation == b.rotation
}
```

---

## 4. Implementation Details (from my code)

### Border Faces Optimization
You only check culling for **border faces** - faces at the edge of the block:

```rust
// This avoids checking inner faces of multi-element shapes (like stairs)
// Only the faces that lie exactly on block borders are relevant for culling
fn is_border_face(face, vertices, axis, border) -> bool {
    vertices.all(|v| abs(v[axis] - border) < epsilon)
}
```

### Neighbor Access (including chunk edges)
Neighbor blocks might be in adjacent chunks:

```rust
fn get_block_local(chunk, neighbors, x, y, z) -> BlockId {
    if in_chunk_bounds(x,y,z) {
        chunk.get(x,y,z)
    } else {
        // Access neighbor chunks based on direction
        neighbor_chunk = get_neighbor_chunk(neighbors, x,y,z);
        if neighbor_chunk.exists {
            neighbor_chunk.get(mapped_coords(x,y,z))
        } else {
            AIR // if neighbor chunk missing, treat as air
        }
    }
}
```

### Directions (as bit masks or enums)

Directions are easily handled with bit masks or enums for efficiency:

- **Enums** clearly represent directions and their opposites:

```rust
enum BlockFace { North, South, East, West, Up, Down }

fn opposite(face: BlockFace) -> BlockFace {
    match face {
        North => South,
        South => North,
        East  => West,
        West  => East,
        Up    => Down,
        Down  => Up,
    }
}
```

- **Bit masks** are fast and efficient when storing multiple faces at once (e.g., checking multiple directions):

```rust
const NORTH: u8 = 0b000001;
const SOUTH: u8 = 0b000010;
const EAST:  u8 = 0b000100;
const WEST:  u8 = 0b001000;
const UP:    u8 = 0b010000;
const DOWN:  u8 = 0b100000;

// Combine directions easily:
let solid_faces = NORTH | EAST | UP;

// Check if direction is solid:
fn is_solid(face: u8, solid_faces: u8) -> bool {
    solid_faces & face != 0
}

// Example usage:
if is_solid(NORTH, solid_faces) {
    // North face is solid
}
```

---

## 5. Actual Logic (combined from my implementation):

Here's a clearly simplified version of my working logic for cubes and stairs:

```rust
fn should_cull_face(block, face, neighbor_block) -> bool {
    match block.cull_mode {
        Default => {
            block.is_side_solid(face) &&
            neighbor_block.is_side_solid(face.opposite())
        }
        Stairs => {
            if face == Up { return false; }

            let same_type = block.type == neighbor_block.type;
            let aligned_stairs = same_type && faces_aligned(block, neighbor_block, face);

            if aligned_stairs {
                true
            } else {
                block.is_side_solid(face) &&
                neighbor_block.is_side_solid(face.opposite())
            }
        }
    }
}
```

**This logic ensures:**
- Cubes always use simple culling.
- Stairs use special alignment checks before falling back to solid checks.

---

## Visual Comparison

Here's how the wireframe looks **without face culling**:

![Without culling](/assets/img/posts/2025-07-22-face-culling/no-culling.png)

And here's the same scene **with face culling enabled**:

![With culling](/assets/img/posts/2025-07-22-face-culling/with-culling.png)

Notice how all hidden faces are skipped, improving both clarity and performance.

---

## 6. Summary (Why This Works Clearly)

- **Cubes:** always hide faces if both sides are solid.
- **Stairs:** top face never culled; sides/front culled only if stairs perfectly align; back/bottom faces culled normally.
- **Border faces optimization** prevents useless internal checks.
- **Bit masks or enums** simplify direction handling efficiently.

This approach is clear, robust, and used in engines like Vintage Story. It's also easy to expand later if needed.

---

## Special thanks

- Tyron ([Vintage Story](https://www.vintagestory.at/)) for insights on logic and approach.

For more details or questions, reach out to me.

Happy building!

## Contacts

- **GitHub:** [@ogyrec](https://github.com/ogyrec-o)
- **Telegram:** [@ogyrrrec](https://t.me/ogyrrrec)
- **Signal:** `0546e47e337a19217a59d92043be4433d93a23946a8d171dccfdab393781e9f77a`
- **Discord:** `ogyrec_`
- **TerraVox Discord:** [https://discord.gg/zKY3Tkk837](https://discord.gg/zKY3Tkk837)
- **Email:** ogyrec.404@proton.me