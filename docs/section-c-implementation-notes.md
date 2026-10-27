# Section C implementation notes

Section C uses the verified organ-specific HRA v1.3 Large Intestine GLBs for both sides of the comparison. The left and right panels clone the same sex/organ/side model source; the left clone applies the HRApop expression color mapping and the right clone applies one neutral material.

The expression response is the existing HRApop v1.1 snapshot. Values remain the unweighted arithmetic mean of source `mean_expr` rows grouped by `as_id`, and matches are made against scene-node name fragments and the node's `representation_of` crosswalk already stored in the snapshot. Missing values remain light gray. A zero expression value is treated as valid data.

For organs without an organ-specific local asset, the viewer uses the matching HRA v1.5 whole-body GLB served by the local model API and isolates only meshes whose names belong to the selected organ. If no target mesh is found, an explicit `3D anatomy unavailable` diagnostic is shown; the Section C renderer has no sphere or point fallback.

Both panels use independent Three.js controls with the same fitted camera pose. Organ or sex changes recreate both panels; gene changes only rebuild the expression colors and leave the HPO panel neutral.
