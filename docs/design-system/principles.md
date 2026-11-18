---
title: Principles
---

# Principles

Rules every screen and component in Elody follows.

## One field at a time
A field is edited, saved and validated on its own. Opening a field never
opens or validates its neighbours, and a failed save keeps only that field
open.

## Leaving a field saves it
Picking a value in a dropdown, date picker or autocomplete only changes what
you are editing. An inline field saves when you leave it (click elsewhere or
press Tab) or press Enter. A form saves with its save button. Every editor of
the same kind behaves the same way.

## Actions carry a label
The main action on a screen is a labelled button, and menus of further
actions have a labelled trigger. Where space is tight, in list rows and on
small screens, the trigger is a ⋮ icon with an accessible name.

## Shape shows what a button does
- A **pill** (fully rounded) starts something safe and reversible: add, search,
  navigate.
- A **rectangle** (slightly rounded) acts immediately: save, open a record.

A pill never changes data.

## Two levels of elevation
Cards and panels have a 1px border and no shadow. Only overlays (menus,
popovers, modals and notifications) cast a shadow. There is no third level.

## Three layers at most
A detail screen nests at most panel → block → rows. There is never another
bordered box inside a block.

## Save and focus look the same everywhere
The save colour and the keyboard focus ring are the same on every deployment,
whatever its brand colours, so users always recognise them.

## Empty reads "No value"
An empty value shows "No value" in a dimmed style, never a dash or a blank.

## Accessible by default
Focus, accessible names, contrast and keyboard support are part of every
component, not something added later. See [accessibility](./accessibility).
