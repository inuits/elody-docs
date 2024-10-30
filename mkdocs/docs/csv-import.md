# Elody CSV Import Documentation

This guide explains how to bulk import data into Elody via CSV files. It provides step-by-step instructions for importing entities with textual metadata, relationships between entities, and media files.

---

## Table of Contents
1. [Introduction to CSV Import](#introduction-to-csv-import)
2. [Basic Structure of the CSV](#basic-structure-of-the-csv)
3. [Importing Textual Metadata](#importing-textual-metadata)
4. [Adding Relationships](#adding-relationships)
5. [Importing Media Files](#importing-media-files)
6. [Using the *same_entity* Column](#using-the-same_entity-column)
7. [Sample CSVs](#sample-csvs)

---

### Introduction to CSV Import

In Elody, entities can be bulk imported using CSV files. Each entity can contain metadata in the form of text, such as descriptions or titles, and relationships with other entities. This process helps users manage data efficiently and accurately.

### Basic Structure of the CSV

The CSV files contain columns that correspond to technical keys for metadata and relationships. Note that these technical keys in the CSV may differ from the labels visible in the Elody interface.

### Importing Textual Metadata

For entities with only textual metadata, you can enter the desired text in the appropriate column in the CSV file. Use the technical keys of the metadata:

- **Example:** If you want to add a description, place the text in the column with the key `description`.

> **Note:** The technical keys in the CSV may differ from the labels you see in the Elody interface.

### Adding Relationships

Relationships in Elody connect entities with each other. When adding a relationship, you need to use the relationship name and the UUID of the related entity. You can always find an entity’s UUID in its URL.

- **URL format for UUIDs:** `https://elody/$entitytype/$uuid`
- **Example:** For a *hasPhotographer* relationship between a media file and a person, add the photographer’s UUID in the column with the name *hasPhotographer*.

> **Tip:** To add multiple items to the same entity, such as multiple photographers, add each item on a new line. Only the relationship column needs to be filled in, and the other fields can remain blank.

### Importing Media Files

Elody allows users to import media files directly when creating an entity. Media files are a separate entity type in the Elody data model, but they can also be directly linked to other entity types:

1. Add the filename in the *filename* column for the entity to which you want to link the media file.
2. This method is available for all entity types that can contain media files, such as the *asset* type.

### Using the *same_entity* Column

To link multiple media files to a single entity, you can use the *same_entity* column. By setting the same number in the *same_entity* column:

1. Enter all metadata for the entity in the first row.
2. Use additional rows with the same number in *same_entity* to easily link multiple media files to this entity.

### Sample CSVs

In Elody's import modal, you can download sample CSVs that contain all possible metadata and relationship columns. These templates are a helpful starting point for entering your data and help avoid formatting errors.

> **Tip:** Start with a sample CSV and complete it with your data to simplify the import process.
