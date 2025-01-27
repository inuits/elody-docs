### Example for Bulk Uploading Files in Elody

#### Objective

In this example, we demonstrate how to upload a set of photos related to coastal management in Koksijde in 2014. The goal is to import these photos along with relevant metadata and link them as a single media entity with multiple media files in Elody.

### Step-by-Step Guide

#### Step 1: Open the Upload Form

Open the **upload module** in Elody via the sidebar. Select the "Upload entities with media files" option. Below is a screenshot with the highlighted option:

#### Step 2: Prepare the CSV File

To simplify the process, you can first upload the images via the form. Add the files you want to use and then select the option to download a sample CSV. This CSV will automatically include the filenames, making it easier to fill in the correct metadata.

##### Step 3: Assign the Correct Context

In this step, assign the correct context to the files. This ensures that the right people within VLIZ have access to the files. If you are unsure which context to use, ask internally. For this example, we use the default context `vliz_context`.

#### Step 4: Assign the Correct Value to the *same\_entity* Column

Ensure that all media files belonging to the same media entity share the same value in the *same\_entity* column. For this example, we use the number `1` throughout to indicate that the files belong to the same media entity.

Additionally, fill in only columns A through R (e.g., *title*, *description*, *coordinates*, etc.) for the first row. Columns starting from S, which pertain to specific media files, can be filled in separately for each row.

#### Step 5: Assign Metadata to the Media Entity

1. **Title**: For this example, we assign the title `Koksijde 2014` to the media entity.
2. **Tag**: We link the tag `Coastal Management` as a relationship to the keywords entity. Ensure this tag is created in Elody beforehand so it can be linked correctly.

#### Step 6: Assign Metadata to the Media Files

To indicate the owner of the media files, add `vliz` to the *mediafile\_owner\_person* column. This column must be filled in for each row because it pertains to individual media files and can vary by file if desired. For this example, we use `vliz` throughout.

#### Step 7: Remove Placeholder Data

Ensure that all placeholder data, such as `title of a keyword for mediafile`, is removed from the CSV. These placeholders are meant as examples and must be replaced with actual data relevant to your media files and metadata.

#### Step 8: Upload the CSV

Now you can upload the CSV in the top window of the **upload module** and start the upload. Make sure the ZIP archive containing the media files is also uploaded as part of the process.

Below is an example of how your CSV should look:

| same\_entity | title         | description | coordinates | context      | media\_keyword | language | asset\_category | location\_type | marine\_region | event | project | partner | creator\_person | owner\_person | creator\_partner | owner\_partner | type   | filename       | content\_drager | external\_link | usage\_guidelines | usage\_guidelines\_until | embargo | qualityRating | mediafile\_keyword | confidentiality | person | mediafile\_creator\_person | mediafile\_creator\_partner | mediafile\_owner\_person | mediafile\_owner\_partner |
|--------------:|:-------------|------------:|------------:|:-------------|:----------------|---------:|-----------------:|----------------:|----------------:|------:|--------:|--------:|----------------:|---------------:|------------------:|----------------:|:-------|:---------------|-----------------:|----------------:|-------------------:|-------------------------:|--------:|--------------:|--------------------:|----------------:|:-------|---------------------------:|----------------------------:|-------------------------:|--------------------------:|
|             1 | Koksijde 2014 |          |          | vliz\_context | Coastal Management |       |               |              |              |    |      |      |               |            vliz |                |              | media  | IMG_4529.JPG   |               |              |                 |                       |      |            |                  |              | vliz   |                         |                          |                       |                        |
|             1 |            |          |          | vliz\_context |              |       |               |              |              |    |      |      |               |            vliz |                |              | media  | IMG_4530.JPG   |               |              |                 |                       |      |            |                  |              |     |                         |                          |                       |                        |

#### Step 9: Validation and Error Checking

After importing, you can check in Elody whether:

- The files are correctly linked to the entities.
- The metadata and relationships have been imported accurately.

If there are errors, they will be displayed in Elody's UI. You can also download an updated CSV that includes the errors, making it easier to process and correct large CSV files.

#### Additional Information

For more detailed information on working with CSV files in Elody, visit the following documentation: [CSV Import Documentation](https://github.com/inuits/elody-docs/blob/master/mkdocs/docs/csv-import.md).

With this step-by-step guide, you can easily bulk upload files and link them to entities in Elody, as shown in this example of coastal management in Koksijde in 2014.

