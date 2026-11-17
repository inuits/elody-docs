---
title: Comments
---

# Comments

Discussions about a record: a list of threads on the record's page, each
opened in a modal to read and reply.

<StoryEmbed id="components-comments--list" height="270px" />

## When to use

- Questions and remarks between colleagues about a record, such as a review
  note or a request to check a value.
- Pointing a colleague or another record into the conversation with a tag.

## When not to use

- **Information that belongs to the record:** put it in a field, such as a
  [WYSIWYG editor](./wysiwyg-editor) for a longer note.
- **Who changed what:** that is in the [history diff](./history-diff).

## Anatomy

1. **Comments panel:** an element [panel](./panel-and-block-shells) with the
   configured title and a collapse chevron.
2. **New discussion:** a small commit [button](./button) with a plus icon at
   the top of the panel. It opens the composer in place.
3. **Composer:** a [WYSIWYG editor](./wysiwyg-editor) that is open for
   typing, the client's extra fields (such as a category) under it, then
   _Cancel_ and a commit _Post_ button.
4. **Discussion card,** newest first. The header line holds:
   - the author in bold and the date in a lighter grey;
   - _New_ for a comment you haven't seen yet, when the client tracks this.
     The card then also gets an accent bar on its left edge;
   - _edited_ in italics, when the comment was changed after posting;
   - on the right: the extra field values, the status chip (_Open_ on the
     accent colour, _Resolved_ in grey) and the reply count.

   The comment text follows under the header.
5. **Tag:** a record named in the text, as an inline chip in
   `--color-accent-light` with an accent outline.

## Variants

| Variant | Where | What changes |
|---|---|---|
| List card | in the comments panel | status and reply count; the whole card opens the discussion; hover gives an accent border |
| Discussion | in the modal | the first comment, then the replies indented, oldest first; your own comments get _Edit_ and _Delete_ |
| Editing | in the modal, on your own comment | the card turns into the composer, with _Save_ and _Cancel_ |

<StoryEmbed id="components-comments--thread" height="390px" />

**The discussion modal** has the title _Discussion_ and, on the right, the
status buttons and a close cross. The reply composer sits at the bottom with
a commit _Reply_ button.

<StoryEmbed id="components-comments--composer" height="360px" />

**Tagging** is set up per client: typing the tag's trigger character, such
as `@`, lists matching records, and the toolbar can offer a button per tag
type. The picked record is saved as a relation of the comment. A click on a
tag opens that record in a modal.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | _Loading comments..._ | the panel fetches its comments |
| Empty | _No comments yet_ in italics | no discussions on the record |
| Composing | composer open; _Post_ stays disabled until there is text or a tag, and the extra fields are valid | _New discussion_ |
| Open | _Open_ chip; replies allowed; a _Resolve_ button in the modal | a new discussion |
| Resolved | grey _Resolved_ chip; no reply composer but _This discussion is resolved. Reopen it to reply._; _Reopen_, and _Archive_ for those who took part | _Resolve_ |
| Archived | gone from the panel's list; _Reopen_ when the discussion is opened | _Archive_ |
| Read-only | no _New discussion_, no status buttons, no reply composer, no _Edit_ or _Delete_ | the panel is configured read-only |

**Edit and delete.** Only the author sees _Edit_ and _Delete_ on a comment.
_Edit_ shows only while the discussion is open. _Delete_ asks for
confirmation in a [modal](./modal). Deleting the first comment deletes the
whole discussion, replies of others included, and the modal says so.

## Keyboard & accessibility

| Key | Where | Does |
|---|---|---|
| Tab | panel and modal | moves through _New discussion_, the composer, _Cancel_, _Post_, the status buttons, _Edit_ and _Delete_ |
| Escape | discussion modal | closes it |
| ↑ / ↓ | tag suggestions | moves through the list |
| Enter / Tab | tag suggestions | picks the highlighted record |
| Escape | tag suggestions | closes the list |

- The composer is a [WYSIWYG editor](./wysiwyg-editor); its toolbar and
  formatting keys apply.
- _Edit_ and _Delete_ are real buttons. A click on them doesn't open the
  card's discussion.
- A click on a tag opens the record instead of the discussion.
- Opening a discussion card and opening a tag work by mouse only for now.

## Content

- Keep comments about the record; anything that has to stay with the record
  belongs in a field.
- Resolve a discussion when the question is answered; archive it to take it
  out of the list.
- Translation keys: `comments.new-thread`, `comments.post`,
  `comments.reply`, `comments.save`, `comments.cancel`, `comments.edit`,
  `comments.edited`, `comments.delete`, `comments.resolve`,
  `comments.archive`, `comments.reopen`, `comments.thread-title`,
  `comments.empty`, `comments.loading`, `comments.unknown-author`,
  `comments.new`, `comments.reply-count`, `comments.status.*`,
  `comments.resolved-hint`, `comments.archived-hint`,
  `confirm.delete-comment.*`.

## Related

[WYSIWYG editor](./wysiwyg-editor) · [Modal](./modal) ·
[Panel & block shells](./panel-and-block-shells) · [Button](./button) ·
[History diff](./history-diff)
