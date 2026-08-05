# Comments & Threads

Users can hold threaded discussions on an entity. A top-level comment acts as
the **subject** (the thread starter) and every reply is a separate comment
entity linked back to it. The entity detail page lists the subjects; opening a
thread, replying and editing all happen inside a modal.

Each subject carries an `open` or `resolved` status, so a whole discussion can
be closed at once rather than message by message. A resolved thread stays
readable, but stops accepting replies until someone reopens it.

Because a comment is its own entity type, nothing is stored on the entity being
discussed — commenting on a record never counts as editing that record, and
never bumps its version or audit trail.

## Threads

Threads are two levels deep: subjects, and replies to a subject. There is no
nesting beyond that.

The detail page shows the list of subjects with, for each, its status and how
many replies it has. Opening one shows the full exchange and a reply box.
Everything a thread needs is already loaded with the list, so opening a thread
is instant rather than a fresh round trip.

## Tagging

The comment composer is a WYSIWYG field that supports two kinds of tag:

| Tag | Meaning |
| --- | --- |
| `@` | Mentions a colleague. **Notifies them.** |
| `#` | Links another entity. **Does not notify** — a clickable reference only. |

Both render as a highlighted chip in the comment rather than raw text, and an
entity link stays clickable when the comment is read back, opening the entity it
points at.

Which entity types can be tagged is part of the platform's tagging
configuration, so a deployment decides for itself whether `#` can point at any
entity type or only some.

### Two ways to tag

Tagging supports two interaction styles, and a deployment can use either or
both in the same editor:

- **Inline** — type the trigger character and pick from an autocomplete
  dropdown. The trigger character is consumed by the insertion, so it never
  remains in the saved text.
- **From a selection** — select some text, press the Tag button, and pick an
  entity in a modal. No trigger character is involved at any point, and this is
  the only way to tag part of a single word, since inline triggers only fire at
  a word boundary.

The two produce identical markup, so a comment does not record which style
created a tag.

Several composers can be active on one page at once — for instance the list's
composer and an open thread's reply box — each with its own tagging behaviour.

## Notifications

Tagging a user with `@` raises an in-app notification. If that user has an email
address, an email is sent as well.

There is no separate "notify" step: a mention is recorded as a relation on the
comment, and that relation is what delivery reacts to. Entity links are recorded
as a *different* relation, which is why they never notify anyone.

Mentions are read out of the comment as it was actually saved, so the people
notified always match the text that was stored. Editing a comment notifies
anyone newly mentioned, without re-notifying people who were already tagged.

## Permissions

| Action | Requires |
| --- | --- |
| View threads | read access to comments |
| Post, reply, resolve, reopen | permission to edit the entity being discussed |
| Edit a comment | the above, and being its author |

Rights on the discussion follow rights on the entity: anyone who may edit the
entity may take part in its discussions, and anyone who may only read it can
follow along without contributing. A read-only user sees the thread list and can
open threads, but gets no composer, no resolve toggle and no edit buttons.

## How a comment is stored

Each comment holds:

| Property | Purpose |
| --- | --- |
| `body` | The composed HTML, including any tag elements. |
| `status` | `open` / `resolved`. Only meaningful on a subject; absent reads as `open`. |
| `author_name` | Denormalised for display. |
| `ref_parent_entity` | The entity the thread hangs off. |
| `ref_subject` | The thread starter. Absent on a subject, set on every reply. |
| `ref_tagged_users` | Users mentioned with `@`. Drives notification. |
| `ref_tagged_entities` | Entities linked with `#`. |

Author and timestamps come from the entity's existing audit block rather than
dedicated properties, so `author_name` is only ever a display convenience —
the audit record remains the authority for who wrote a comment.

A reply stores both `ref_parent_entity` and `ref_subject`. That looks redundant,
but it is what lets a whole page of threads be fetched with one filter on the
discussed entity, instead of walking from entity to subject to replies.
