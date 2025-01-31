### Example for Bulk Uploading Files in Elody

#### Objective

In this example, we demonstrate how to upload a set of photos related to coastal management in Koksijde in 2014. The goal is to import these photos along with relevant metadata and link them as a single media entity with multiple media files in Elody.

### Step-by-Step Guide

#### Step 1: Open the Upload Form

Open the **upload module** in Elody via the sidebar. Select the "Upload entities with media files" option. Below is a screenshot with the highlighted option:

#### Step 2: Prepare the CSV File

To simplify the process, you can first upload the images via the form. Add the files you want to use and then select the option to download a sample CSV. This CSV will automatically include the filenames, making it easier to fill in the correct metadata.

#### Step 3: Assign the Correct Context

In this step, assign the correct context to the files. This ensures that the right people within VLIZ have access to the files. If you are unsure which context to use, ask internally. For this example, we use the default context `vliz_context`.

#### Step 4: Assign the Correct Value to the *same\_entity* Column

Ensure that all media files belonging to the same media entity share the same value in the *same\_entity* column. For this example, we use the number `1` throughout to indicate that the files belong to the same media entity.


#### Step 5: Assign Metadata to the Media Entity

1. **title**: For this example, we assign the title `Koksijde 2014` to the media entity.
2. **tag**: We link the tag `Coastal Management` as a relationship to the keywords entity. Ensure this tag is created in Elody beforehand so it can be linked correctly.
3. **marine_region**: Create a marine region with the title of Mediterranean Sea. To add this to the Media entity, place the title `Mediterranean Sea` in the second line in the column marine_region.

Additionally, fill in only columns A through R (e.g., *title*, *description*, *coordinates*, etc.) for the first row. Columns starting from S, which pertain to specific media files, can be filled in separately for each row.


#### Step 6: Assign Metadata to the Media Files

To indicate the owner of the media files, add `vliz` to the *mediafile\_owner\_person* column. This column must be filled in for each row because it pertains to individual media files and can vary by file if desired. For this example, we use `vliz` throughout.

#### Step 7: Remove Placeholder Data

Ensure that all placeholder data, such as `title of a keyword for mediafile`, is removed from the CSV. These placeholders are meant as examples and must be replaced with actual data relevant to your media files and metadata.


#### (optional) Step 8: Add multiple keywords an entity

To illustrate how you can add multiple keywords to a single entity, we will use the example of adding keywords to the `Koksijde 2014 Media` entity.

To add a second keyword, `Beach profiles`, place it on the third line in the media_keyword column underneath `Coastal Management`.
Ensure that the same_entity column for both keywords has the same identifier to link them to the same entity.

To add even more keywords, follow the same steps. Each new keyword should be placed on a new line under the `media_keyword` column. Make sure each line has the same identifier in the `same_entity` column to associate all keywords with the same entity.

#### Step 9: Upload the CSV

Now you can upload the CSV in the top window of the **upload module** and start the upload. Make sure the ZIP archive containing the media files is also uploaded as part of the process.

Below is an example of how your CSV should look:

| same_entity | title         | description | coordinates | context      | media_keyword      | language | asset_category | location_type | marine_region      | event | project | partner | creator_person | owner_person | creator_partner | owner_partner | type  | filename                                | mediafile_copyright_color | content_drager | external_link | usage_guidelines | usage_guidelines_until | embargo | qualityRating | mediafile_keyword | confidentiality | person | mediafile_creator_person | mediafile_creator_partner | mediafile_owner_person | mediafile_owner_partner |
|-------------|---------------|-------------|-------------|--------------|--------------------|----------|----------------|---------------|--------------------|-------|---------|---------|----------------|--------------|-----------------|---------------|-------|-----------------------------------------|---------------------------|----------------|---------------|------------------|------------------------|---------|---------------|-------------------|-----------------|--------|--------------------------|---------------------------|------------------------|-------------------------|
| 1           | Koksijde 2014 |             |             | vliz_context | Coastal Management |          |                |               | Mediterranean Sea  |       |         |         |                |              |                 |               | media | Screenshot from 2025-01-13 11-27-54.png |                           |                |               |                  |                        |         |               |                   |                 |        |                          |                           | vliz                   |                         |
| 1           |               |             |             |              | Beach profiles     |          |                |               |                    |       |         |         |                |              |                 |               | media | Screenshot from 2025-01-13 11-26-26.png |                           |                |               |                  |                        |         |               |                   |                 |        |                          |                           | vliz                   |                         |
| 1           |               |             |             |              |                    |          |                |               |                    |       |         |         |                |              |                 |               | media | Screenshot from 2025-01-09 10-02-48.png |                           |                |               |                  |                        |         |               |                   |                 |        |                          |                           | vliz                   |                         |

#### Step 10: Validation and Error Checking

After importing, you can check in Elody whether:

- The files are correctly linked to the entities.
- The metadata and relationships have been imported accurately.

If there are errors, they will be displayed in Elody's UI. You can also download an updated CSV that includes the errors, making it easier to process and correct large CSV files.

#### Additional Information

For more detailed information on working with CSV files in Elody, visit the following documentation: [CSV Import Documentation](https://github.com/inuits/elody-docs/blob/master/mkdocs/docs/csv-import.md).

With this step-by-step guide, you can easily bulk upload files and link them to entities in Elody, as shown in this example of coastal management in Koksijde in 2014.

