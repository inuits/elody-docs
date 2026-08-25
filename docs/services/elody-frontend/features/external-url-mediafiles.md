# External URL Mediafiles

Some material a client wants to attach to an entity does not live in storage:
a trailer on YouTube, a music fragment on Spotify, a review on a newspaper
site. A mediafile can stand in for such a link instead of a stored file, by
carrying a reserved `external_url` property and no `filename`.

This is opt-in per client and per mediafile type. Nothing changes for
mediafiles that do have a file.

## The reserved key

The PWA's media viewer reads a fixed set of reserved keys off a mediafile's
`intialValues` — `mimetype`, `display_filename`, `original_filename`,
`height`, `width` and so on. `external_url` is one of these.

A client does not have to name its own property `external_url`: the GraphQL
alias in `intialValues` is what the viewer reads, and `key(input:)` names the
source property. So a client whose property is called `trailer_link` writes:

```graphql
intialValues {
  external_url: keyValue(key: "trailer_link", source: metadata)
}
```

If the key is absent, the viewer behaves exactly as before. There is no
feature flag.

## Setting it up

### 1. collection-api

Add the property to the mediafile validator's `PROPERTY_VALUE_MAP`:

```python
"external_url": {"type": "string"},
```

If your client requires `filename` on a mediafile, it can no longer be
unconditionally required — a mediafile with only an `external_url` has no
file, and therefore no `filename`, no `mimetype` and no file locations. The
schema generator emits a flat `required` list with no conditional support, so
drop `filename` from `REQUIRED_PROPERTIES` and let its own `minLength` keep
validating it when present.

Then check your mediafile configuration for code that assumes a file. Note
that the serializer omits the `metadata` key **entirely** when no
file-derived value is present, so guards must be `document.get("metadata", {})`
— `document["metadata"].get("filename")` still raises. In the base
configuration this affects:

- `_creator` — do not append a `filename` identifier when there is none
- `__correct_document_metadata` — skip when there is no `metadata`
- `__generate_upload_link` — no file means no upload ticket
- `__delete_file_from_storage` — do **not** emit `dams.mediafile_deleted`
  without a filename, or storage-api's `remove_file_from_storage` consumer
  fails and restarts

::: warning
Do not store the link in `original_file_location`, and do not mark it with
`technical_origin`. `original_file_location` is a storage-api path that is
rewritten into a ticketed download URL on every read, which destroys an
external URL; `technical_origin` selects the relation type, so an unknown
value silently produces the wrong relation and the mediafile disappears from
its parent's list.
:::

### 2. Create forms

A create form that should accept a link instead of a file needs two changes:

```graphql
uploadContainer {
  uploadFlow(input: optionalMediafiles)   # was: mediafilesOnly
  ...
}
external_url: metaData {
  label(input: "metadata.labels.url")
  key(input: "external_url")
  inputField(type: baseTextField) {
    ...inputfield
    validation(input: { value: [url] }) { ...validation }
  }
}
```

`mediafilesOnly` disables the submit button until a file is dropped;
`optionalMediafiles` allows submitting without one. Because each mediafile
type usually has its own create-form query, this is how you make the file
optional for only the types that can carry a link — leave the other forms on
`mediafilesOnly`.

Keep `actionType(input: uploadWithMetadata)` and
`creationType(input: mediafile)`. When the form is submitted with no file, the
PWA creates the mediafile from its metadata alone rather than deriving one per
uploaded file.

### 3. Read views

Expose the key wherever the mediafile is read — the teaser fragment, the
detail panel and any completeness overview:

```graphql
intialValues {
  external_url: keyValue(key: "external_url", source: metadata)
}
teaserMetadata {
  external_url: metaData {
    label(input: "metadata.labels.url")
    key(input: "external_url")
    linkText(input: "metadata.labels.open-url")
  }
}
```

Teaser metadata values that look like URLs are rendered as `_blank` links
automatically, so no extra component is needed. `linkText` replaces the raw
URL with a translated label.

To show the field only for the mediafile types that can carry a link, gate it
with `visibleIf`:

```graphql
visibleIf(input: {
  dependsOn: "mediafile_type"
  values: ["trailer", "music_fragments", "review"]
})
```

## What the viewer does

A mediafile with no file has no mimetype, so the viewer has no player to pick.
When `external_url` is present it instead:

- **embeds the link** when the host offers an embed player — YouTube (incl.
  `youtu.be` and shorts), Vimeo, Spotify and SoundCloud are mapped to their
  player URLs
- **links out** for anything else, with an "open in new tab" button

The distinction is deliberate. Most sites send `X-Frame-Options` and refuse to
be framed, and the embedding page gets no usable error for it — only a blank
frame. So only hosts known to be embeddable are framed; everything else gets
the link card rather than a frame that may silently fail. The open-in-new-tab
button is present in both states, because an embed can still be blocked by the
provider.

Only absolute `http(s)` URLs are used. A scheme-less value such as
`www.example.org` is rejected rather than resolved against the app's own
origin.

::: warning Two allowlists, keep them in sync
The provider list lives in `getEmbeddableUrl`
(`inuits-dams-pwa/src/utils/embeddableUrl.ts`), but the browser also enforces
the `frame-src` directive from
`modules/baseGraphql/helpers/contentSecurityPolicyHelper.ts`. A host missing
there is blocked with `frame-src ... violates default-src 'self'` no matter
what `getEmbeddableUrl` returns. Adding a provider means editing both.
:::

## Listings

A mediafile with no file has no thumbnail. Listings already fall back to a
placeholder icon and a "No media" label, so nothing extra is needed — but be
aware that any client code keying off `original_file_location`,
`thumbnail_file_location` or `mimetype` should tolerate their absence.
