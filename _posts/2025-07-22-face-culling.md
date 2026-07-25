---
title: "Face Culling for Voxel Cubes and Partial Shapes"
description: "A practical approach to culling hidden voxel faces, from simple cubes to stairs and other partial block shapes."
date: 2025-07-22 11:30:00 +0200
last_modified_at: 2026-07-25 02:30:00 +0200
categories: [guides, voxel]
tags: [face-culling, voxel, rendering, meshing, optimization, rust]
toc: true
---

Face culling in a voxel renderer starts simple: if two opaque cube faces touch, the internal faces do not need to be emitted into the mesh.

The interesting part begins when blocks are not full cubes.

Stairs, slabs, slopes, fences, custom meshes, and other partial shapes force you to answer a more precise question:

> Does the neighboring shape actually cover the visible area of this face?

That distinction is more useful than a single `solid: bool` once geometry becomes non-trivial.

## 1. Full cube culling

For two opaque full cubes, the rule is straightforward.

```rust
fn should_cull_full_face(
    current_opaque: bool,
    neighbor_opaque: bool,
) -> bool {
    current_opaque && neighbor_opaque
}
```

In practice you normally care about the current face and the opposite face on the neighbor:

```rust
fn opposite(face: Face) -> Face {
    match face {
        Face::North => Face::South,
        Face::South => Face::North,
        Face::East  => Face::West,
        Face::West  => Face::East,
        Face::Up    => Face::Down,
        Face::Down  => Face::Up,
    }
}
```

If both touching sides are fully opaque, emitting both faces wastes vertices, indices, rasterization work, and potentially fragment work.

## 2. Why `is_side_solid()` stops being enough

A boolean per face works well for cubes because each face is either fully covered or not present.

A stair is different.

Imagine looking at one side of a stair. Part of the side may be filled by geometry while another part is open. If you represent that entire side as either `solid` or `not solid`, one of two things happens:

- you keep geometry that is actually hidden, or
- you remove geometry that should still be visible

For partial shapes, visibility is a **coverage problem** rather than only a solidity problem.

## 3. Represent face coverage

A practical solution is to give each block shape an occlusion description for each of its six boundary faces.

One simple representation is a small bit mask.

For example, divide a face into a `4 × 4` grid:

```rust
#[derive(Clone, Copy)]
struct FaceMask(u16);
```

A full cube face has every bit set:

```rust
const FULL: FaceMask = FaceMask(0xffff);
const EMPTY: FaceMask = FaceMask(0x0000);
```

A stair side can describe only the cells occupied by its geometry.

The resolution does not have to be `4 × 4`; it depends on the shape vocabulary your engine supports. The important part is that the representation describes **which parts of the boundary plane are covered**.

## 4. Compare the current face with the neighbor

Suppose `current_mask` describes the portion of the current block face that could be emitted, and `neighbor_mask` describes the opposite boundary face on the neighboring block.

The current face is completely hidden when the neighbor covers every occupied region of the current face:

```rust
fn fully_occluded(current: FaceMask, neighbor: FaceMask) -> bool {
    current.0 & !neighbor.0 == 0
}
```

Conceptually:

```text
visible = current coverage - neighbor coverage
```

If nothing remains, the face can be removed entirely.

If only part remains, you have a choice:

1. keep the original face geometry, accepting some overdraw, or
2. generate/subdivide geometry so only the uncovered region remains

The second option can reduce geometry further but makes the mesher more complex.

## 5. Cubes become a special case

With coverage masks, full cubes no longer need fundamentally separate logic.

Their boundary faces are simply `FULL`.

Two opaque cubes:

```text
current:  1111111111111111
neighbor: 1111111111111111
result:   fully occluded
```

Cube next to empty space:

```text
current:  1111111111111111
neighbor: 0000000000000000
result:   visible
```

A stair or slab uses a partial mask, and the same comparison logic still applies.

This is usually easier to extend than adding a new branch for every pair of special block types.

## 6. Rotation matters

Coverage belongs to the **oriented shape**, not just the block type.

If a stair rotates, its face masks need to rotate with it.

You can either:

- precompute masks for every allowed orientation, or
- rotate a canonical mask when building the block state

Precomputation is often attractive when the set of orientations is small because the hot meshing loop then only performs table lookups and bit operations.

For example:

```rust
let current_mask = shape.occlusion[rotation][face];
let neighbor_mask = neighbor_shape.occlusion[neighbor_rotation][opposite(face)];
```

## 7. Only boundary geometry participates

Internal triangles inside a complex block should not be tested against neighboring blocks.

Neighbor-based culling only concerns geometry that lies on one of the six voxel-cell boundary planes.

For generated shape geometry, classify a polygon as a boundary polygon when all relevant vertices lie on the same cell boundary within a small tolerance.

Conceptually:

```rust
fn lies_on_boundary(vertices: &[Vec3], axis: usize, plane: f32, eps: f32) -> bool {
    vertices
        .iter()
        .all(|v| (v[axis] - plane).abs() <= eps)
}
```

This lets the mesher keep arbitrary internal geometry while applying neighbor occlusion only where it makes spatial sense.

## 8. Chunk borders are not special semantically

A face on the edge of a chunk still has a normal voxel neighbor. The only difference is where you retrieve that neighbor from.

A mesher therefore benefits from a read-only neighborhood view rather than embedding chunk-transition logic everywhere.

For example:

```rust
trait VoxelNeighborhood {
    fn get(&self, position: IVec3) -> Option<BlockState>;
}
```

Then the meshing code can query local and cross-chunk neighbors through the same interface.

If a neighbor chunk is not currently available, the engine must define a policy explicitly. Common options include:

- treat missing data as air and remesh later
- delay meshing until required neighbors are present
- use an explicit unknown state

The correct choice depends on the world-streaming model.

## 9. Transparency needs separate rules

Geometry coverage and render opacity are related but not identical.

For example, two adjacent glass blocks may geometrically cover each other, but whether their shared face should be removed depends on material/rendering semantics.

A robust culling decision may therefore combine:

```text
shape coverage
+ material occlusion behavior
+ block/material compatibility
```

Do not bake all three concepts into one vague `solid` flag if the engine needs transparent or cutout materials.

A useful separation is:

```rust
struct FaceOcclusion {
    coverage: FaceMask,
    mode: OcclusionMode,
}
```

where `OcclusionMode` can express behavior such as opaque, cutout, translucent, or never-occluding.

## 10. Performance considerations

The meshing loop can touch millions of voxel faces, so the representation should make the common path cheap.

Good properties include:

- precomputed shape masks
- precomputed rotation variants
- small integer masks
- contiguous block-state storage
- cheap neighbor access
- minimal allocation inside the inner loop

But measure before optimizing aggressively.

A more sophisticated culling scheme can save mesh geometry while simultaneously making mesh generation slower. The useful metric is the cost of the whole pipeline, not the cleverness of the culling function.

## Visual comparison

Here is an older test scene without hidden-face removal:

![Without culling](/assets/img/posts/2025-07-22-face-culling/no-culling.png)

And the same scene with culling enabled:

![With culling](/assets/img/posts/2025-07-22-face-culling/with-culling.png)

The exact implementation behind these images predates my current engine architecture, but the visual purpose is the same: geometry that cannot contribute to the final image should ideally never enter the generated mesh.

## Summary

For full cubes, voxel face culling is simple neighbor rejection.

For partial shapes, a more scalable mental model is:

1. describe boundary coverage for each oriented face
2. compare it with the neighbor's opposite-face coverage
3. combine geometric coverage with material occlusion rules
4. only apply neighbor culling to geometry on cell boundaries
5. make chunk-border access an input problem, not a separate meshing algorithm
6. precompute the common cases and measure the complete meshing pipeline

That approach generalizes much better than accumulating special cases for `cube + stair`, `stair + stair`, `slab + stair`, and every new shape that comes later.

---

For more current engine work, see the **[Projects](/projects/)** page or **[my GitHub](https://github.com/ogyrec-o)**.
