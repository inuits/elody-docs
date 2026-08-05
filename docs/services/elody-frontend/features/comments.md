# Comments & Threads

Users can hold threaded discussions on an entity. A top-level comment acts as
the **subject** (the thread starter) and every reply is a separate comment
entity linked back to it. The entity detail page lists the subjects; opening a
thread, replying and editing all happen inside a modal.

Each subject carries an `open` or `resolved` status, so a whole discussion can
be closed at once rather than per message.

The composer is a WYSIWYG field with two kinds of tagging:

- `@` tags a colleague and **triggers a notification**.
- `#` links another entity and **does not notify** — it is a clickable
  reference only.

## Data model

A comment is its own entity type, so nothing is stored on the parent entity.
Every comment holds:

| Property | Purpose |
| --- | --- |
| `body` | The composed HTML, including any tag elements. |
| `status` | `open` / `resolved`. Only meaningful on a subject; absent reads as `open`. |
| `author_name` | Denormalised for display. |
| `ref_parent_entity` | The entity the thread hangs off. |
| `ref_subject` | The thread starter. Absent on a subject, set on every reply. |
| `ref_tagged_users` | Users tagged with `@` — this relation is what drives notification. |
| `ref_tagged_entities` | Entities linked with `#`. |

Two decisions here are worth knowing, because they explain the shape:

**A reply carries both `ref_parent_entity` and `ref_subject`.** That looks
redundant, but it means "all subjects of this entity" is a single filter over a
single document. Without it, listing a parent's threads would need a two-hop
traversal that the filter engine cannot express in one call.

**None of these relations are virtual.** A virtual inverse would have to be
declared on every parent entity type, and syncing it writes to the *parent*
document — which bumps the parent's version and audit info. Commenting on a
record must not look like editing that record.

Author and timestamps come from the entity's existing audit block rather than
dedicated properties. `author_name` is for display; `audit.created.by` remains
the authority for "may this user edit their own comment".

## How the list is fetched

The detail page issues **one** query for the entity's comments, filtered on
`ref_parent_entity`. Everything else is derived from that single response:

- A comment with no `ref_subject` is a subject; the rest are replies grouped by
  the subject they point at.
- Reply counts and thread status come from the same data.

Opening a thread therefore costs **no additional request**. Only posting,
editing or resolving refetches.

## Permissions

| Action | Requires |
| --- | --- |
| View threads | read rights on comments |
| Post, reply, resolve | create rights on comments **and** edit rights on the parent entity |
| Edit a comment | the above, and being its original author |

A read-only user sees the thread list and can open threads, but gets no
composer, no resolve toggle and no edit buttons. A resolved thread hides its
composer until someone reopens it.

Comments must also be granted in the client's role configuration. An entity
type that is missing there resolves to "not permitted" silently, which makes
the element render read-only with no obvious cause.

## Notifications

There is no separate notify call and no notify flag. The **relation is the
trigger**: `@` configurations write `ref_tagged_users` while `#` configurations
write `ref_tagged_entities`, so the distinction is pure configuration.

Tagged users are read back out of the composed HTML when a comment is
submitted, which means the relations can never disagree with the body that was
actually saved.

Delivery itself (in-app notification, plus email when the user has an address)
happens on the backend in response to the created comment. A backend handler
should diff `ref_tagged_users` against the previous version on update, so
editing a comment does not re-notify everyone who was already tagged.

## Configuring it for a client

The feature is enabled per entity type by adding a comments element to that
entity's detail view. The element's composer is an ordinary WYSIWYG element, so
the tagging setup is declared once and the thread modal reuses it.

```graphql
comments: commentsElement {
  label(input: "element-labels.comments")
  composer {
    label(input: "element-labels.comment-body")
    metadataKey(input: "body")
    extensions(input: [doc, paragraph, text, bold, italic, hardBreak, elodyTaggingExtension])
    taggingConfiguration {
      customQuery(input: "GetUsers")
      taggableEntityConfiguration(configuration: [
        {
          tag: "user"
          taggableEntityType: user
          relationType: "refTaggedUsers"
          metadataFilterForTagContent: "<schema>|properties.name.value"
          inlineTrigger: { character: "@", minCharacters: 1 }
        }
        {
          tag: "work"
          taggableEntityType: work
          relationType: "refTaggedEntities"
          metadataFilterForTagContent: "<schema>|properties.title.value"
          inlineTrigger: { character: "#", minCharacters: 2 }
        }
      ]) {
        ...taggableEntityConfiguration
      }
    }
  }
}
```

::: warning `tag` is not the trigger character
`tag` is the node name, and therefore the name of the element written into the
stored HTML (`elody-user`, `elody-work`). The character the user types lives in
`inlineTrigger`. Putting `"@"` in `tag` would put it in the saved markup.
:::

Add one `#` entry per entity type that should be linkable. The `@` entry needs
no new entity type — `user` is a queryable type already.

On the backend the client needs a `comment` validator and object configuration
registered in its mappers, an id-prefix branch so relation lookups resolve, and
`comment` granted in its role configuration.

## Tagging behaviour across clients

Tagging is configured entirely through GraphQL, so a client opts into whichever
interaction it needs without any client-specific frontend code:

- **Declaring an `inlineTrigger`** gives inline autocomplete while typing. The
  trigger character is consumed by the insertion and never remains in the
  document.
- **Omitting it** keeps the original flow: select text, press the Tag button,
  pick an entity in a modal. No trigger character appears anywhere.

Both modes can coexist in one editor and produce identical markup. The inline
mode only fires at a word boundary, so a client that needs to tag part of a
single word must use the selection flow.

::: tip Multiple editors on one page
Comments mount several editors at once — one composer in the list and another
in the open thread. Tagging state is per editor, so each composer keeps its own
configuration and styling. A component embedding a composer must give it a
scratch form id unique to what it is composing, since the tagging instance is
identified from it.
:::
