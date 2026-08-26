# Translations

Almost no user-facing string in Elody is written where it is displayed. GraphQL
queries carry translation *keys* — `label(input: "metadata.labels.serial-number")` —
and the PWA resolves them at render time with `t()`. Adding a label therefore
always has two halves: the key in the query, and the key in a translation file.

This page is about the second half: where those files live, how baseGraphql's own
translations and a client's get merged, and how the result reaches the browser.

## The pipeline

```
baseGraphql/translations/*.json ─┐
                                 ├─ mergeObjects ─→ availableLanguages filter
clients/<c>/.../translations/*.json ─┘                        │
                                                              ▼
                                              GET /api/app-configs
                                                              │
                                                              ▼
                                            setupI18n → createI18n({ messages })
```

### 1. baseGraphql ships its own

`modules/baseGraphql/translations/` holds the shared set — currently `en.json`,
`nl.json` and `ar.json`. Everything generic lives here: `metadata.labels.*`,
notifications, confirm-modal copy, bulk-operation labels, error codes.

They are read from disk at request time by `loadTranslationsFromDirectory`, which
treats **the filename as the locale**:

```ts
translationFileNames.forEach((fileName: string) => {
  const translationKey = fileName.replace('.json', '');
  baseTranslations[translationKey] = loadTranslations(
    path.join(directory, `${fileName}`)
  )[translationKey];
});
```

Note the trailing `[translationKey]`: the file is unwrapped by its own name. So
`nl.json` must have a single top-level `"nl"` key wrapping everything:

```json
{
  "nl": {
    "metadata": {
      "labels": { "serial-number": "Serienummer" }
    }
  }
}
```

::: warning A wrapper key that doesn't match the filename yields `undefined`
`loadTranslationsFromDirectory` derives the locale from the filename and then
indexes the parsed JSON with it. Name the file `nl.json` but wrap the contents in
`"nl-BE"` — or `"NL"`, or nothing — and that locale's entry is `undefined`. No
exception, no warning; every key for that language then falls through as raw
dot-notation text.
:::

### 2. A client passes its own into `start()`

Client translations live in
`clients/<client>/client-frontend/inuits-dams-graphql-service/src/translations/`,
same shape, same filename-is-locale rule. Clients load them with the *same*
exported helper:

```ts
import { loadTranslationsFromDirectory } from "base-graphql";

const podiumnetTranslations: Record<string, Object> =
  loadTranslationsFromDirectory(path.join(__dirname, "translations"));
```

and hand the result to `start()`:

```ts
start({
  customModuleConfig: podiumnetElodyConfig,
  appConfig: podiumnetAppConfig,
  customTranslations: podiumnetTranslations,
  // ...
});
```

`start()` forwards `customTranslations` to the app-config endpoint — it is one of
the four arguments in the `configsEndoint` slot of
`defaultElodyEndpointVariableMapping`. Nothing else in baseGraphql reads them.

### 3. Merge, then filter

`getAvailableTranslations` in `appConfigEndpoint.ts` does both steps:

```ts
const baseTranslations: Object = loadTranslationsFromDirectory(
  path.join(__dirname, `../translations`)
);
const fullTranslations = mergeObjects([baseTranslations, translations]);
```

`mergeObjects` (from `json-merger`) is a **deep** merge with the client second, so:

- a client key that does not exist in base is added
- a client key that does exist in base **overrides** it
- everything else in base is kept

That is what lets a client rename a shared concept — `metadata.labels.title`
becoming "Productietitel" for one tenant — without touching baseGraphql, and it
is also why a client file only needs the keys it actually changes or adds.

The filter step is `customization.availableLanguages` from the client's app
config:

```ts
availableLanguages: ["en", "nl"],
```

Locales outside that list are dropped from the payload. If the list is absent,
everything merged is shipped.

::: warning The `availableLanguages` check tests the client's files, not the merged set
```ts
includedTranslationKeys.forEach((key: string) => {
  if (!(key in translations)) {
    console.error(`Language with key ${key} not available in translations, ...`);
  } else {
    availableTranslations[key] = fullTranslations[key];
  }
});
```

`translations` there is the *client's* object, not `fullTranslations`. So listing
a locale that baseGraphql ships but the client does not — `ar` is the live example
— logs an error and drops the language entirely, even though a complete base
translation for it exists.

The fix is to add an `ar.json` to the client's own translations directory. It can
be nearly empty; it only has to exist so the locale is present in
`customTranslations`, and the merge then fills in everything from base. UGent
AICAP, the one client that lists `ar`, does exactly that.
:::

### 4. Shipped with the app config

There is no dedicated translations endpoint. The merged, filtered object rides
along on the same call that carries the runtime config:

```ts
app.get('/api/app-configs', async (req, res) => {
  res.end(
    JSON.stringify({
      config: getConfig(config),
      translations: getAvailableTranslations(config, translations),
      urlMapping,
      version: { 'apollo-graphql-version': config.version },
    })
  );
});
```

Because the files are read inside the request handler, a changed JSON file is
picked up by reloading the page — no GraphQL-service restart needed in
development.

### 5. Installed once at PWA startup

`main.ts` fetches it before anything else renders and builds the i18n instance:

```ts
const { config, translations, version, urlMapping } =
  await getApplicationDetails();
i18n = setupI18n(translations, config.customization.applicationLocale);
// ...
initializeInputValidation(translations);
```

`applicationLocale` is the starting language; `setupI18n` hardcodes `en` as the
fallback. The same object is also handed to `initializeInputValidation`, which is
how vee-validate's validation messages get translated.

## Where to put a key

One question decides it: would another client want this label?

- **Yes** → `modules/baseGraphql/translations/{en,nl,ar}.json`. `metadata.labels.*`,
  buttons, notifications, generic entity labels.
- **No** → `clients/<client>/.../src/translations/{en,nl}.json`. Domain vocabulary,
  branding, client-specific entity names.

Client-specific error-code translations (`error-codes.W5019` for a client's own
validation rule) go in the **client** files. The merge is deep, so a client can
introduce new keys under an existing base namespace like `error-codes` without
having to restate the base ones.

## When a label shows as `metadata.labels.something`

That is the failure mode you will actually hit, and it is silent by design:

```ts
createI18n({
  locale: applicationLocale,
  fallbackLocale: "en",
  messages: translations,
  missingWarn: false,
  fallbackWarn: false,
});
```

`missingWarn: false` and `fallbackWarn: false` mean vue-i18n prints the key it
could not resolve and says nothing about it. Nothing appears in the console, the
network tab, or the GraphQL response. Work down this list:

1. Is the key spelled the same in the query and in the JSON? Keys are
   kebab-case inside dot-separated namespaces — `metadata.labels.serial-number`,
   not `serial_number`.
2. Is it in the right file for the locale you are viewing? A key present in
   `en.json` but missing from `nl.json` falls back to `en`, so it renders in the
   wrong language rather than as a raw key — a different symptom of the same
   mistake.
3. Is the locale in `availableLanguages`, and does the client ship a file for it?
   See the warning above.
4. Does the JSON file's top-level wrapper key match its filename?

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`translations/loadTranslations.ts`](https://github.com/inuits/elody-base-graphql/blob/master/translations/loadTranslations.ts) | elody-base-graphql | `loadTranslationsFromDirectory`, filename-is-locale |
| [`translations/*.json`](https://github.com/inuits/elody-base-graphql/tree/master/translations) | elody-base-graphql | the shared set (`en`, `nl`, `ar`) |
| [`endpoints/appConfigEndpoint.ts`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/appConfigEndpoint.ts) | elody-base-graphql | `getAvailableTranslations`, `/api/app-configs` |
| [`main.ts`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts) | elody-base-graphql | `customTranslations` → `configsEndoint` |
| `src/translations/*.json` | each client | client overrides and additions |
| [`src/helpers.ts`](https://github.com/inuits/elody-pwa/blob/master/src/helpers.ts) | elody-pwa | `setupI18n`, `getApplicationDetails` |
| [`src/main.ts`](https://github.com/inuits/elody-pwa/blob/master/src/main.ts) | elody-pwa | installs i18n and validation messages at startup |
| [`src/components/metadata/MetadataTitle.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/metadata/MetadataTitle.vue) | elody-pwa | `t(metadata.label)` — a representative consumer |

For how labels get into a query in the first place, see
[GraphQL-Driven UI](./graphql-driven-ui).
