# Meta Context

## Purpose

This demo preserves the Monologi-LARP / Dramaturgi experiment from the Elopeli development lineage.

The prototype explores a single-player performance format where an LLM acts as a dramaturgical director. Instead of asking the player what they want to do next, the system generates direct spoken or embodied prompts for the player to perform aloud.

## What It Proved

- A language model can be steered toward monologue-LARP output when the prompt focuses on dramaturgical function, theme, tone, and action rather than free world simulation.
- A small taxonomy of `mechanic`, `dynamic`, and `content` helps turn generation into playable performance instructions.
- The "And then..." interaction pattern can keep the player in a performed scene without falling immediately into choose-your-own-story style option menus.

## Main Limitation

This is a prompt-engineering and format study, not a complete Elopeli engine. It is single-player, browser-local, and does not test private multi-player information flow, phone clients, scene-wide shared state, or real-time group dramaturgy.

## Main Finding

The useful control surface was dramaturgical taxonomy, not imagined world-state. The model became more useful when asked to generate performable dramatic actions and dynamics instead of maintaining a whole fictional reality.

## Lineage

- Branch: adjacent method study.
- Related Elopeli lineage: after the LGM/world-state dead end and before the later Rautatie / pregenerated coherence turn.
- Conceptual connection: helped clarify that LLM direction should be thematic, semantic, and dramaturgical.
- Later relevance: supports the taxonomy logic used in Elopeli Rautatie and Elopeli Threads / Säikeet.

## Current Status

- Source imported from a Google AI Studio export on 2026-06-05.
- Repository is preserved as a historical/prototype artifact.
- `.env.local` from the export is intentionally not committed; use `.env.example` as the local environment template.

