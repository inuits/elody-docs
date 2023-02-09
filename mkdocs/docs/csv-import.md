# Technical implementation

## How uploads go currently in DAMS Antwerpen

1. An upload form gets shown, images can be put here in a dropbox. A CSV with
metadata can also be, optionally added. (external systems also can be selected).
2. When adding files to the dropzone, uploadtickets get created. (POST request 
to https://dams-a.antwerpen.be/uploadtickets/create, which in its turn asks for
uploadtickets to mediamosa)
3. When uploading the optional CSV file, the CSV gets saved to the temp 
directory and is later parsed (POST request to https://dams-a.antwerpen.be/upload/csv)
4. After clicking on submit, a Drupal batch operation is started. In this batch
operation, the CSV that is optionally uploaded, gets parsed, but in the cache,
and metadata for assets matching with a given filename/asset_id gets updated.

## How would the implementation look like in DAMS v2

Currently, the `/entities/<id>/mediafiles`, `/entities` endpoints don't support 
posting multiple mediafiles/entities. We could support posting either a single
document or an array of entities/mediafiles. This then returns single or multiple
upload urls.
As for the CSV upload with metadata, the csv could be streamed to the csv-importer
together with a list of tupples of the mediafile/entity id together with the
filename. The csv-importer can then update the entities/mediafiles with the values
from the CSV file.

Another possibility could be that the CSV is uploaded to the csv-importer which
would return a document containing the representation of the entities/mediafiles
in JSON-format. This could than be used to POST to the collection-api. The
consumer of these endpoints can match the filenames in the form with the filenams
in the upload-urls/tickets.

## Streamlining backend-import with uploads via frontend

The backend/frontend upload/import funcionality in the current DAMS Antwerpen
doesn't re-use code.
The two systems have been developed totally independent. In the new system we
will re-use the code base for CSV parsing/updating metadata.
