# Technical implementation

## How would the implementation look like in DAMS v2

A very elegant solution for this seems to me to add support to the backend to
interpret the "Content-Type" header in the `/entpoint(?ids)`, `/mediafiles(?ids)`
endpoints. The content-type can be one of `text/csv`, `application/json`,
`application/ld+json`. The system returns the entities in the specified format.
Optionally fields could also be passed in the query string to limit the amount
of fields in the exported csv/json `?fields[]=title,fields[]=publisher`, similar
to the current 'custom csv export functionality' in the current DAMS Antwerpen.

DAMS also supports certain predefined CSV exports. In the new DAMS these could
also be integrated using an abstract document of the type predefined_csv_export.
The id of this predefined CSV export can be passed in the query parameters, and
will be used to specify which fields will be returned `?predefined_csv_export={ID}`.
