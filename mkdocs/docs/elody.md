# Table of Contents

1. [Elody: a modular semantic data platform](#elody-a-modular-semantic-data-platform)
   1. [Semantic Data Structuring](#semantic-data-structuring)
   2. [The Modular Approach](#the-modular-approach)
   3. [Data Platform: Software as a Service](#data-platform-software-as-a-service)
   4. [A Comprehensive Data Solution](#a-comprehensive-data-solution)
2. [Core Features](#core-features)
   1. [Entity Management](#entity-management)
   2. [Data Manipulation](#data-manipulation)
   3. [Tagging Interface](#tagging-interface)
   4. [Data Filtering and Search](#data-filtering-and-search)
      1. [Types of Filters in Elody](#types-of-filters-in-elody)
      2. [Saving and Reusing Filters](#saving-and-reusing-filters)
      3. [Simple Search](#simple-search)
   5. [Navigation, Sorting, and Pagination](#navigation-sorting-and-pagination)
   6. [Access Control](#access-control)
      1. [User-role authorization](#user-role-authorization)
      2. [UI Visibility Restrictions](#ui-visibility-restrictions)
      3. [Data-Level Access Control](#data-level-access-control)
   7. [OCR - Optical Character Recognition](#ocr---optical-character-recognition)
   8. [Job System](#job-system)
   9. [Maps Integration](#maps-integration)
   10. [CSV's](#csvs)
       1. [CSV Export](#csv-export)
       2. [CSV Import](#csv-import)
       3. [CSV Mutations](#csv-mutations)
   11. [External API Integration](#external-api-integration)
   12. [Open Linked Data](#open-linked-data)
3. [Architecture](#architecture)
   1. [Modular Microservices](#modular-microservices)
   2. [Frontend Architecture](#frontend-architecture)
      1. [Progressive Web Application](#progressive-web-application)
      2. [Graphql](#graphql)
         1. [GraphQL-Driven UI Customization](#graphql-driven-ui-customization)
         2. [Optimized Data Communication](#optimized-data-communication)
   3. [Backend Architecture](#backend-architecture)
      1. [Collection API](#collection-api)
      2. [Storage API](#storage-api)
      3. [Client Collection Module](#client-collection-module)
      4. [OCR Service](#ocr-service)
      5. [Transcoder Service](#transcoder-service)
      6. [Cantaloupe & IIIF Server](#cantaloupe--iiif-server)
      7. [Filesystem Importer Service](#filesystem-importer-service)
      8. [Antivirus Software](#antivirus-software)
      9. [Database services](#database-services)
      10. [Keycloak](#keycloak)
      11. [Traefik](#traefik)
      12. [Elody Python SDK](#elody-python-sdk)

&nbsp;

# Elody Functional Documentation

## Elody: a modular semantic data platform

Elody is a **modular semantic data platform** designed to revolutionize the way organizations manage, share, and distribute structured data.
By combining a powerful backend with an intuitive user interface, Elody offers users with a consistent experience for handling data.
Its flexible architecture enables businesses to define entities, establish meaningful relationships between them, and integrate external services effortlessly.
Whether working with textual, numerical, or media-based data, Elody guarantees consistency, accessibility, and ease of use.

### Semantic Data Structuring

At the core of Elody is its ability to provide **semantic meaning** to data. Elody enables users to:

- **Define Entities** – Users can define and create a structure for an infinite number of entity types with customizable metadata fields.
- **Establish Relationships** – Entities can be linked to each other, allowing users to form complex, meaningful connections between different data points.
- **Enhance Metadata** – Every piece of data, including images, can be enriched with extensive metadata, making information more searchable and interconnected.

By offering this structured approach, Elody ensures that data is not just stored but is also **contextually relevant and easy to retrieve.**

### The Modular Approach

One of the key strengths of Elody lies in its **modular architecture**.
Elody is built on a **microservice architecture**, where each functionality operates as an independent module. This allows for:

- **High scalability** – Organizations can scale different modules independently based on usage and needs.
- **Customization** – Businesses can choose which modules to enable, ensuring they only use relevant features.
- **Flexibility** – New generic core modules can be added or customer specific modules can be added without disrupting the core functionality.

This modular nature makes Elody an ideal solution for organizations requiring adaptable and evolving data management solutions.

### Data Platform: Software as a Service

Elody is designed to function as a **data platform**, available as a **Software-as-a-Service (SaaS)**. This means that businesses do not need to worry about infrastructure maintenance, software updates, or scalability challenges. Instead, they can:

- **Deploy Elody effortlessly** – The platform can be configured and customized to fit an organization’s specific needs.
- **Ensure security and compliance** – Built-in security measures and access control ensure that (sensitive) data is well-protected.
- **Integrate seamlessly** – External applications can connect to Elody via APIs, enabling smooth data exchange between systems.
- **Distribute data effectively** – Organizations can share structured data internally and externally in a controlled and secure manner.

This approach makes Elody **easy configurable to an organizations needs**, allowing Elody to be deployed as a SaaS.

### A Comprehensive Data Solution

Elody is not just a data storage tool; it is a **full-fledged data management ecosystem**.
By combining modularity, semantic structuring, and strong integration capabilities, Elody empowers users to efficiently **organize, retrieve, manipulate, and share their data** in a user-friendly environment.
The platform's extensive customization options and robust security features make it an **ideal choice for businesses that need a dynamic and evolving data management system**.

With its scalable architecture and intuitive design, Elody provides a **future-proof solution** that adapts to an organization’s growing and changing data needs.
Whether managing business information, digital assets, research materials, or customer records, Elody ensures **clarity, efficiency, and interoperability** in the data lifecycle.

By leveraging Elody, organizations can achieve **enhanced productivity, improved decision-making, and streamlined workflows**, making it an essential tool for modern data management.

&nbsp;

&nbsp;

## Core Features

### Entity Management

Elody enables logical **data management, sharing, and distribution** through a **user-friendly interface** that is fully customizable to meet specific needs.
With intuitive navigation and metadata configuration options, users can efficiently organize and interact with their data, ensuring a smooth and tailored experience.

1. **Customizable Entity Definition for Tailored Metadata Management**

Elody empowers users to define a **unique set of entities**, each with specific attributes, to structure their metadata efficiently and to enhance **organization and retrieval of entities**.
Our highly flexible system enables developers to smoothly integrate these entity definitions into the customer-specific Elody application, ensuring a **tailored data schema** that meets individual business requirements.

Entities within Elody can represent a wide range of **real-world and digital objects**, from physical assets to living organisms.
This allows organizations to **digitally manage** and preserve their collections, bringing both tangible and intangible assets into a **structured digital environment**.

2. **Flexible Viewing Options and Configurable Metadata Display for Enhanced User Experience**

Entities are displayed as **structured lists** on overview pages, where users can configure which metadata fields are visible for which entity types.
This makes sure that the **most relevant information is highlighted** in this teaser metadata, offering a **quick and informative** snapshot of each entity.

Elody’s user interface offers multiple **viewing options** to accommodate different user preferences and **data presentation** needs.
Entities can be displayed as **list items** for a structured, linear view or as **grid items** for a more visual and dynamic layout.
This flexibility makes sure that users can navigate and interact with their data in the most **efficient and intuitive** way.

![overviewpage_listview.png](../images/elody-functional-documentation/overviewpage_listview.png)

On **entity detail pages**, all metadata attributes are accessible, with **full customization** options.
Users can define the **order** in which metadata fields appear and **group related attributes** together for a more intuitive and organized presentation.
This ensures that users can efficiently navigate and interact with entity data in a way that best suits their needs.

3. **Seamless Semantic Linking for Enriched Data Relationships**

One of Elody’s core functionalities is the ability to establish **meaningful relationships** between entities, enhancing data quality and context through semantic linking.
Entities can be **connected** to other entities, mediafiles, or even themselves, with no restrictions on the number or type of relationships that can be created.

Users have **full control** over defining how entities relate to one another by providing this information in their **data model**.
Based on these definitions, we configure the **user interface** to support the addition of relevant relationships easily.

4. **Intuitive Interface for Effortless Entity Linking**

Elody’s user-friendly interface simplifies the process of **linking entities**.
While viewing an entity’s metadata, users can easily access a menu to establish new connections directly.

Dedicated UI components within an entity’s detail page display related entities that are seperated by type.
From here, users can either **link existing** entities or **create new ones** and immediately establish their relationship—all within a streamlined workflow.

5. **Comprehensive Media Integration for Visual Content Enrichment**

In addition to entities, Elody supports the integration of **images and other mediafiles**, offering the same **extensive metadata and relationship capabilities**.
By incorporating mediafiles, Elody enhances data with **rich visual content**, providing deeper context.

Mediafiles can come in various formats, including images, videos, PDFs, and text files for example.
These files are displayed using Elody’s **Media Viewer** component, which allows users to zoom, toggle full page, navigate through multi-page documents, and **interact** with media intuitively.

For entities linked to mediafiles, a **thumbnail preview** can be displayed on overview pages, offering users a quick visual reference.
This feature is particularly effective in grid view mode, where media-rich content can be presented in an engaging layout.

![overviewpage_gridview.png](../images/elody-functional-documentation/overviewpage_gridview.png)

&nbsp;

&nbsp;

### Data Manipulation

Elody provides flexible options for **managing data**, whether by **migrating** existing records or **adding new** ones.
Users can **edit** or **remove** incomplete or incorrect data based on **custom validation rules** and restrictions.
Additionally, relationships can be established between entities and mediafiles, ensuring structured and meaningful data connections.

1. **Flexible Data Import Options**

Elody offers multiple ways to import data into the system. Users can link **an external filesystem** hosted on the customers side and place their data in a structured format within a specified directory.
This storage location can be configured to be **accessible directly** from Elody’s user interface.

With just a few clicks, users can initiate a **full import** of the selected folder through Elody's UI.
Once the process is complete, the data appears in the UI, including all specified metadata and relationships.

2. **Creating and Editing Entities in Elody**

   Create entities

Elody supports **multiple ways to create entities** through the **user interface**. A **shortcut** in the menu allows quick access to create any available entity type.
Additionally, on overview pages, users can initiate entity creation through an **action button**.
When working within the detail page of a related entity, a new entity can be created and linked instantly.

For **bulk creation**, entities can be created using a **CSV file**, where each row represents an entity.
Once uploaded, the system **automatically generates entities** along with their **metadata and relationships**, making it easy to populate **large datasets** efficiently.

    Edit entities

Entities can be edited **individually** on their detail pages, where **clear validation rules** on each metadata field guide users to ensure data accuracy.
For **bulk editing**, **CSV uploads** enable modifications across **multiple entities at once**, significantly reducing manual effort and improving workflow efficiency.

    Add or remove relations

In addition to editing metadata through the UI or bulk uploads, Elody offers an efficient process for **establishing relationships between entities**.
Certain predefined relationships can also be **created in bulk** using **CSV uploads**, allowing for large-scale data connections with minimal effort.

The standard way to add relationships **through the user interface**, is either during **entity creation** or when **editing an existing entity**.
Elody’s UI provides clearly **visible buttons and intuitive screens**, ensuring that linking (or unlinking) entities is a straightforward and user-friendly process.

![create_remove_relations.png](../images/elody-functional-documentation/create_remove_relations.png)

3. **Uploading Mediafiles**

   Direct Upload on Entity Detail Pages

Users can **upload mediafiles** directly from an entity’s detail page. Simply **drag and drop** files into the designated drop zone, click save, and the mediafiles will be inserted into to the system.

    CSV-Based Bulk Upload

For a more **structured approach**, mediafiles can be **uploaded using a CSV file**, allowing users to **specify metadata** for each file.
This method also supports the **simultaneous creation of entities** and the automatic linking of mediafiles to them, streamlining data creation.

Elody offers an **intuitive and user-friendly interface** for uploading mediafiles, designed to ensure accuracy and clarity throughout the process.
Before the upload begins, the system **automatically validates files** by comparing them with the entries defined in the accompanying CSV.
Users are notified if any files referenced in the CSV are missing from the upload selection, or if additional, undefined files have been added.

Once the upload starts, users benefit from real-time feedback through progress indicators—both for the overall upload and for each individual mediafile.
This provides transparency and control, allowing users to monitor the entire process with confidence and precision.

![upload-csv-functionality.png](../images/elody-functional-documentation/upload-csv-functionality.png)

4. **Deleting Entities in Elody**

   Bulk Deletion

Entities and mediafiles can be removed in **bulk** from overview screens. Checkboxes allow users to **select specific items**, and filtering options make it easy to **refine selections**.
Users can also increase the page limit to select and delete all entities displayed on a page at once.

The bulk delete process includes an option to **automatically remove related entities** when necessary, **preventing orphaned data**.
However, entities with **blocking relationships** —those that are required for other entities to exist— will **not be deleted**. This safeguard prevents accidental data loss and guarantees system consistency.

    Single-Entity Deletion

When deleting a **single entity**, Elody provides a **detailed overview** of all related entities. Users can choose to **remove related items simultaneously**.
If an entity cannot be deleted due to **blocking relationships**, these dependencies are **clearly displayed**, allowing users to navigate to them and take the necessary actions before proceeding.

5. **Data Migration**

Elody is designed to support data coming from **various sources**, whether it involves **migrating external data and storing it permanently** in Elody, or **continuously fetching and mapping external data** to fit Elody’s structure.

For clients transitioning from an older application or requiring a structured **data migration**, Elody lays out a tailored migration process.
A **custom migration plan** is created for each client to ensure a smooth and efficient transfer.
Once the plan is established, our team manages the full migration, minimizing disruptions and preventing data loss.

&nbsp;

&nbsp;

### Tagging Interface

Understanding and modeling relationships between data entities is at the core of every semantic platform. Elody provides a user-friendly tagging interface that brings semantic linking directly into the editing workflow.

#### Intuitive Tagging with Context

The tagging editor allows users to highlight any portion of text and instantly **tag** it with an entity. Whether referencing an existing item or introducing a new concept, the interface supports both:

- **Select existing entity**: Start typing to search and tag an existing item.
- **Create new entity**: Can’t find what you’re looking for? Just create it on the spot.

![Tagging Interface Screenshot](../images/elody-functional-documentation/tag_new_or_existing_entities.png)

This streamlined process makes enriching content with semantic links feel natural and fast.

#### Automatic Relationship Creation

When tagging an entity, Elody automatically creates a relationship between the **parent entity** (the current detail page) and the **tagged entity**. This turns raw text into structured knowledge:

- The relationship is stored in the knowledge graph.
- It enhances navigation between related entities.
- It powers richer queries and visualizations downstream.

![Entity Tagging Relationship](../images/elody-functional-documentation/tagging_editor.png)

Whether you're annotating reports, modeling processes, or documenting systems, this interface helps you semantically link your content without leaving the editor.

&nbsp;

&nbsp;

### Data Filtering and Search

A key feature of any semantic data platform is the ability to **filter and search data effectively**.
Elody provides a **powerful and flexible filtering system** that allows users to navigate large datasets with ease, ensuring that users can effortlessly **access the data** they need quickly.

Elody's filtering system allows users to **refine their searches** based on specific attributes, reducing irrelevant results and increasing precision.

Elody’s filtering supports:

- **Metadata-based filtering** – Users can refine searches based on any metadata attribute of an entity, regardless of its structure or format. Multiple filtering types are available here.
- **Relationship-based filtering** – Filters can also be applied to entity relationships, enabling precise and context-aware searches.

&nbsp;

#### Types of Filters in Elody

1. **Text-Based Filtering**

Elody allows users to apply **text filters** to any metadata field that contains textual information.
This can be useful for searching specific details, such as an entity’s **description** or **ID**, to quickly locate the required entity.

_Available Text Filters_

- **Exact match** – Finds entities where the metadata exactly matches the entered text.
- **Partial match** – Retrieves results where the entered text appears anywhere within the metadata field.
- **Empty or non-empty fields** – Filters entities based on whether a text field has a value or is left blank.

![text_filter.png](../images/elody-functional-documentation/text_filter.png)

Elody’s filtering system extends **beyond individual entities**, allowing searches based on metadata from **related entities**.

_Example Use Case_

An entity may have a related mediafile containing OCR-processed text (_[see chapter OCR: Optical Character Recognition](#ocr---optical-character-recognition)_) stored as metadata on the mediafile.
OCR is a technology that can extract text from images.
Users can apply a text filter on the asset to find mediafiles that contain specific text, enabling more advanced and context-aware searches.

2. **Number-Based Filtering**

Elody also supports **number filters**, allowing users to refine searches based on numerical metadata fields.
These filters are useful for scenarios where entities need to be retrieved based on specific numeric conditions.

_Example Use Case_

If a user wants to find all entities that have at least **15 mediafiles related** to them, they can apply a **minimum value filter** of 15.

_Available Number Filters_

- **Exact match** – Finds entities where a numerical field matches a **specific value**.
- **Minimum match** – Retrieves entities where the value is **greater than or equal** to a specified number.
- **Maximum match** – Retrieves entities where the value is **less than or equal** to a specified number.
- **Between match** – Filters entities where the value falls **within a specified range**.

This filtering capability enables more advanced data queries based on numerical attributes.

3. **Date-Based Filtering**

Elody provides **date filters** that allow users to refine searches based on date-related metadata.
These filters can be applied to any entity metadata field that contains a date value.

_Available Date Filters_

- **Exact match** – Finds entities with a metadata field that matches a **specific date**.
- **Minimum match** – Retrieves entities with dates **after** the specified date.
- **Maximum match** – Retrieves entities with dates **before** the specified date.
- **Between match** – Filters entities with dates **within a specified range**.
- **Empty or non-empty fields** – Searches for entities where a date field is either **filled in** or **left blank**.

![date_filter.png](../images/elody-functional-documentation/date_filter.png)

These filtering options help users efficiently narrow down data based on time-related criteria.

4. **Selection-Based Filtering**

One of Elody’s most **powerful and user-friendly** filters is the **selection filter**.
This filter allows users to **choose values** from a **predefined list** directly within the filtering interface, making it easy to refine searches without needing to manually input values.

_How It Works_

Selection filters can be applied to both **metadata fields** and **entity relationships**:

- When filtering **by metadata**, Elody automatically gathers all **unique values** for a given field across all entities of that type and presents them as **selectable options**.
- When filtering **by relationships**, users can **search** for **entities linked** to another entity by the **name or title** of that entity that will appear as a selection.

_Available Selection Filter Types_

- **Checkboxes** – Displays **a list of possible values** as checkboxes, allowing users to select multiple options with simple clicks.
- **Autocomplete with Dropdown** – If there are more than 10 possible values, an **autocomplete search** is enabled. Users type at least three characters, and **matching values appear in a dropdown**. Multiple selections can be made sequentially.

_Example Use Case: Filtering Download Entities by Status_

A common scenario where the **selection filter** is useful is when users need to manage and track **download requests** for mediafiles.

When a user requests mediafiles for download, Elody creates a download entity.
This entity contains a **link to a ZIP file** with the selected mediafiles and an accompanying CSV file with metadata.

Since the download process runs in the background and may take time to complete, **each download entity is assigned a status**, such as:

- Approved
- In Progress
- Finished
- Failed

On the **download entities overview page**, users can quickly **filter by status** using a **selection filter**, ensuring they can easily track the progress of their download requests.

![selection_filter.png](../images/elody-functional-documentation/selection_filter.png)

&nbsp;

#### Saving and Reusing Filters

Filters are a core part of daily operations in Elody, allowing users to efficiently navigate and retrieve relevant data.
Beyond manual filtering, **saved searches** provide a way to automate and streamline **recurring search tasks**.

_Saving and Managing Filters_

To enhance efficiency, users can **save search filters** for quick access later.

- Each saved search can be **named** for easy identification.
- Users can choose to keep saved searches **private** or make them **publicly available** for other users in the system.
- Saved searches remain **editable**, allowing users to refine search parameters as needed.

![saved_search.png](../images/elody-functional-documentation/saved_search.png)

_Use Cases for Saved Searches_

Filtered saved search results can be leveraged for **automated workflows**.
For example, users can set up saved searches to:

- Track **newly added** (f.e.) books, paintings, or other entities within an Elody-powered application.
- Monitor **recently updated** records that require further action or review.

By enabling **persistent, shareable, and editable searches**, Elody makes sure that users can **quickly reapply relevant filters**, making data retrieval faster and more efficient.

&nbsp;

#### Simple Search

To ensure **fast and efficient data retrieval**, Elody offers a **simple search** function that is available on every page.
This allows users to quickly search through collections of entities at any time.

_How Simple Search Works_

- A **search button** is always accessible, enabling users to perform quick lookups across all entity types that are included in the search configuration.
- Users can enter **text-based queries** to filter results based on **predefined metadata fields** in the simple search.

This functionality sets out an easy way to locate relevant data without **knowing the exact filtering options**, making it ideal for **everyday searches** and **immediate data access**.

&nbsp;

&nbsp;

### Navigation, Sorting, and Pagination

Elody promises a **smooth browsing experience** through an intuitive navigation system, allowing users to efficiently explore and manage data.

**Sorting for Better Organization**

- Users can **define sorting preferences** for each entity type, ensuring data is displayed in the most relevant order.
- Sorting options can be based on **metadata fields**, such as name, creation date, or other metadata attributes.

**Customizable Pagination**

- Users can **adjust pagination limits** to control how many entities are displayed per page.
- This flexibility helps optimize data viewing and retrieval, especially when working with large datasets.

With these features, Elody provides a **structured and efficient** way to navigate and organize complex data collections.

&nbsp;

&nbsp;

### Access Control

Access control is a **key component** of any data management system, ensuring that users have the appropriate permissions based on their roles.
Elody provides a **flexible and configurable policies system**, allowing organizations to manage data access effectively.

&nbsp;

#### User-role authorization

Elody's access control system is designed to **restrict or grant access** based on predefined user roles.
Clients can define an **unlimited number of roles**, each with its own set of permissions, ensuring users have access only to the **data and actions** relevant to their responsibilities.

_Example Use Case: Library Management_

In a library setting, different roles may have different levels of access:

- **Intern**: Can **only view** assets in Elody but cannot edit, add, or delete data. Restricted menu items and action buttons make sure the intern does not have unauthorized access to these actions.
- **Employee**: Responsible for book check-ins and check-outs. Needs the ability to **edit some entities** -in this case an entity of the type 'Book Inventory'- but not modify other entity types, users, or system settings.
- **Library Manager**: Has **full access** to the application, including managing users, defining roles, and reviewing entity modifications.

Roles can be assigned to **user groups**, allowing multiple users to **inherit the same permissions**. Additionally, **specific users** can be **assigned individual roles** outside of a group if needed.

&nbsp;

#### UI Visibility Restrictions

Policies in Elody also **shape the user interface**, to provide a streamlined experience.

- **Menu Restrictions**: When users log in, Elody **automatically adjusts the menu**, displaying only the sections they have the permission to access. If a user attempts to access a restricted page via URL, they will be redirected to the unauthorized page.
- **Button and Action Validation**: Action buttons are validated against the user’s role. If a user lacks permission for a specific function, the button will be **hidden**.

With **customizable access control**, Elody guarantees **data security, role-based efficiency, and a user experience tailored to each role’s needs**.

&nbsp;

#### Data-Level Access Control

Elody ensures that **access control extends beyond just UI restrictions** — it also applies at the **data level**, ensuring that users only see the entities they are permitted to access.

_Example: Restricted Entity Visibility in a Library_

Even if a user has access to an **overview page** (e.g., a list of books), not all entities within that list may be visible to them.

- When a user navigates to the **Books** page, Elody retrieves a set number of book entities based on pagination settings.
- Some books may still be **incomplete or restricted**, meaning only users with the **necessary permissions** can view them.
- If an intern or any other restricted user **does not have access** to certain books, Elody **automatically filters out** those entities, ensuring they are not **retrieved and displayed**.

This **dynamic data authorization** guarantees that users only interact with **relevant and permitted data**, reinforcing **security and role-based access control** at every level.

&nbsp;

&nbsp;

### OCR - Optical Character Recognition

When a mediafile containing text is uploaded, the system **does not automatically recognize** or index the text within the image.
This means that users cannot **search or filter** based on that text until **OCR** is applied.

To address this, users can **manually trigger an OCR process**, which:

- **Extracts** text from the image.
- **Saves** the extracted text as metadata on the mediafile.
- **Enables search and filtering** based on the extracted text, improving data accessibility.

_Generating Searchable PDFs_

Beyond simple text extraction, OCR in Elody provides additional functionality:

- Users can generate **searchable PDFs** from the extracted text.
- If an entity contains **multiple related mediafiles**, a **single PDF** can be created, compiling all mediafiles along with their extracted text.
- These PDFs improve **document management, retrieval, and searchability** across large collections of media.

By leveraging OCR, Elody enhances the ability to **store, search, and manage text-based mediafiles**, transforming static images into structured, discoverable data.

&nbsp;

&nbsp;

### Job System

Elody includes a **job system** to manage and track background processing tasks, ensuring users can monitor the **progress and status** of various **system actions**.

_How the Job System Works_

Certain operations, such as OCR processing or mediafile downloads, require **background processing**.
Instead of forcing users to wait, Elody creates a **job** for each action, allowing users to continue their work while monitoring the task's progress.

Each job contains:

- **Status updates** (e.g., Running, Waiting, Finished, or Failed).
- **Error messages** (if something went wrong).
- **Subjobs**, when applicable (e.g., a general OCR job with subjobs for each mediafile being processed). This structure allows users to track both high-level and detailed progress of system operations efficiently.

![overviewpage_jobs.png](../images/elody-functional-documentation/overviewpage_jobs.png)

_Job System for Non-Background Processing Tasks_

Even tasks that do **not require background processing**, such as bulk uploads, can **generate jobs**.
This ensures users receive a **comprehensive overview** of completed tasks.

For example, after a bulk upload:

- Users can see a **list of successfully created entities** and their details.
- Any **failed uploads** will be logged, providing clear information about what went wrong and why.

The job system **increases transparency and efficiency**, ensuring users stay informed about all major actions in the system.

&nbsp;

&nbsp;

### Geospatial Data Visualization

Elody offers built-in support for **displaying spatial data on a map**, allowing users to manage and interact with geospatial information effectively.

The platform supports **multiple mapping formats** and **various layers**, including heatmaps, polygons, markers, and more to represent spatial relationships visually.

This feature enhances geospatial analysis and enables users to gain deeper insights through these visualization capabilities within the platform.

![map_component.png](../images/elody-functional-documentation/map_component.png)

&nbsp;

&nbsp;

### CSV-Based Data Management

Elody extensively utilizes CSV files for **importing, exporting, and modifying** data.
The backend processes CSVs to create or edit entities and manage relationships efficiently.

#### CSV Export

Users can **export** both mediafiles and entities in a **structured CSV format**, packaged within a ZIP file.
This provides a convenient way to access metadata and files for external reporting and analysis.
Users can facilitate regular data extraction of scheduled data to enhance analysis and reporting.

#### CSV Import

CSV files enable **bulk imports** of large datasets, allowing users to insert data quickly and efficiently.
This ensures a smooth transition when onboarding new data into the system.

#### CSV Mutations

Users can **modify metadata** for a selected set of entities using CSV files.
This functionality streamlines bulk updates, ensuring efficient data management across large datasets.

&nbsp;

&nbsp;

### External API Integration

Elody's flexible architecture supports **multiple data sources**, allowing seamless **integration** with both internal and **external APIs**.
These data sources can be configured to dynamically fetch external data to enrich the platform’s capabilities.

By mapping external data to Elody’s structure, the platform ensures a **unified experience**, displaying information consistently within the UI regardless of its origin.
Users can interact with external data just as they would with internally stored entities.
This means Elody enables **relationships** between internal entities and data coming from external sources, ensuring smooth cross-referencing without disrupting the user experience.

&nbsp;

&nbsp;

### Open Linked Data

Elody supports the principles of **open linked data**, enabling data to be structured, connected, and shared across platforms in a meaningful way.
Open linked data allows information to be interlinked and machine-readable, promoting interoperability between systems and improving discoverability on the web.

Elody is capable of both importing and exporting data using common open linked data formats such as **RDF, JSON-LD, N-Triples, and Turtle**.
This ensures easy integration with external datasets, such as authority files, knowledge graphs, or other cultural heritage platforms, while allowing clients to maintain control over how their data is shared and reused.

&nbsp;

&nbsp;

## Architecture

### Modular Microservices

Elody is built with a **modular architecture**, allowing flexibility in both the frontend and backend.
This modularity enables seamless inclusion or exclusion of specific features based on user needs, ensuring a durable foundation for long-term scalability.

**Frontend Modularity**

Elody’s frontend consists of **interchangeable modules** that can be enabled or disabled per client.
This ensures a tailored user experience while maintaining a consistent and durable core system across all implementations.

**Backend Microservices**

Elody’s backend is designed as a **microservice architecture**, where each service operates in its own environment.
These services communicate and interact with each other, ensuring scalability and maintainability.
These can also be enabled or disabled per client ensuring easy scalability.

**Core and Custom Components**

All Elody clients benefit from a **core set** of frontend modules and backend services that form the **foundation of Elody**.
On top of this, Elody allows **deep customization** through customer-specific **frontend modules** or **backend services**.

Customer-specific frontend modules enable a **tailored UI experience** based on user needs.
Every visible UI component can be customized, ensuring an interface that aligns with specific workflows and businesses preferences.

In the backend, customer-specific services allow for the addition of **business logic** and integration with **external APIs** or the logic for **migration scripts** for example.

&nbsp;

This modular approach allows for **optimized performance**, **easy scalability**, and **personalized functionality** while maintaining a strong and reliable base system.

&nbsp;

![elody_architecture-elody-base.png](../images/elody-functional-documentation/elody_architecture-elody-base.png)

&nbsp;

&nbsp;

### Frontend Architecture

Elody’s frontend is structured into two main components, ensuring a modular, scalable, and highly customizable user interface:

1. **Progressive Web Application** (PWA)

   - Built using **Vue 3** and **TypeScript**, the PWA is the core of Elody’s UI.
   - It includes all UI components and composables, making it the **standard frontend module** for every Elody application.
   - This certifies a unified and consistent user experience across all clients.

2. **GraphQL** acting as a Backend for Frontend (BFF)
   - The BFF acts as an **intermediary** between the frontend and backend services.
   - It contains **schemas, queries, resolvers, endpoints, parsers**, and more to optimize data retrieval and management.
   - Built with **modular GraphQL architecture**, it consists of:
     - **Base modules**: Included in every Elody application to provide **core frontend functionalities**.
     - **Customer-specific modules**: Allow customization of the **UI structure**, including menu items, overview pages, and entity detail layouts.
   - This modular approach ensures that each client can have a **uniquely structured UI** while maintaining a solid foundation.

&nbsp;

#### Progressive Web Application

Elody’s **Progressive Web Application (PWA)** is responsible for managing and displaying UI components, handling user interactions, and ensuring the data gets handled accordingly.

_Key Responsibilities of the PWA_:

- **UI Component Management**: The PWA contains all the necessary code and logic to **display UI components and manage their behavior**.
- **User Interaction Handling**: When users **interact** with components (e.g., clicking buttons, applying filters, navigating), the PWA processes these actions accordingly.
- **Data Fetching & Display**: The PWA **fetches data** through **GraphQL**, executing queries and making API requests to retrieve data. The fetched data is then **displayed** according to the defined UI structure.
- **Data Parsing & Modification**: Before modifying or uploading data, the PWA **validates, parses and processes** the input to make sure it meets the required format before sending it to the backend through Graphql.
- **Generic Component Library**: Component library includes **reusable UI elements** such as buttons, menu items, list/grid/media viewers, entity detail page components, upload components, ...
- **Error Handling & Notifications**: **Displays** error messages, warnings, and success notifications to users.

&nbsp;

#### Graphql

GraphQL is a core component of Elody’s architecture, enabling efficient **data communication** and **dynamic UI customization**.
It acts as the bridge between the **frontend and backend**, ensuring seamless data retrieval, modification, and structuring.
GraphQL serves two primary functions:

- **Dynamic UI Customization** – Structuring the frontend dynamically to furnish a tailored user experience for each client.
- **Optimized Data Communication** – Facilitating efficient data retrieval, mutation, and integration from multiple sources.

##### _GraphQL-Driven UI Customization_

GraphQL plays a vital role in **structuring and customizing the frontend dynamically**, ensuring a tailored user experience for each client:

- **Component Control**: Determines which **UI components** are displayed and what data they receive.
- **Client-Specific Adaptability**: Each client’s frontend structure is dynamically configured based on their **unique GraphQL setup**, allowing seamless adjustments to various business needs and use cases.
- **Modular & Scalable**: This flexible, modular approach ensures that different clients can maintain **highly personalized UI experiences** while benefiting from a consistent, maintainable, and scalable underlying framework.

##### _Optimized Data Communication_

Beyond UI customization, GraphQL **manages the flow of data** between the frontend and backend, ensuring that only the necessary data is retrieved, preventing inefficiencies such as over-fetching or under-fetching.
It streamlines communication and enhances performance through:

- **Efficient Data Retrieval**: The Progressive Web Application (PWA) executes **GraphQL queries** to fetch data from Elody’s **internal services and external APIs**.
- **Optimized Data Mutation**: Any **modifications** made within the PWA are transmitted back to the backend **through Graphql**, ensuring accurate data updates and storage.
- **Seamless Data Integration**: GraphQL aggregates data from **multiple sources**, including third-party APIs, and returns a **structured response** tailored to the frontend’s needs.
- **Performance Optimization**: By **acting as an intermediary**, GraphQL reduces network load and improves response times by fetching only the **essential data** required for the user interface.

&nbsp;

&nbsp;

### Backend Architecture

Elody is built on a **microservices architecture**, ensuring a **modular, scalable, durable, and high-performance** system.
Each microservice is responsible for a **specific core functionality**, allowing for **efficient management, independent scaling, and seamless communication** between services.
Microservices are able to **delegate tasks to** and **communicate with other services**.

This section provides an overview of **each microservice**, explaining its role, benefits, and how it contributes to Elody’s overall functionality.

&nbsp;

#### Collection API

The Collection API is the **central microservice** of Elody, responsible for **managing and organizing data** across the platform.
It plays a critical role in **handling data-related requests**, ensuring efficient data retrieval, modification, creation, and deletion.

The Collection API is designed to efficiently **process requests** coming from the frontend via GraphQL.
It handles all **CRUD** (Create, Read, Update, Delete) operations on entity data and ensures seamless **interactions between the frontend, database and other services**.
It is able to execute **direct database queries**, allowing it to retrieve large volumes of filtered data quickly and efficiently.

By **optimizing data retrieval processes**, user queries are handled with minimal delay, contributing to a highly responsive user experience.
Instead of operating in isolation, it interacts with other backend services to retrieve additional information when necessary.

By handling **large volumes** of requests efficiently and ensuring **direct, optimized access to stored data**, the Collection API is fundamental to Elody’s reliability and performance.
is also able to execute direct queries into our database. That way it is able to query the db to retrieve (filtered) data, modify, create or delete data.

&nbsp;

#### Storage API

The Storage API is responsible for **handling file storage and retrieval** within Elody, ensuring that **mediafiles** such as images, PDFs, and videos are stored and accessed efficiently.
It plays a crucial role in managing secure file uploads, ensuring that all media is safely stored and easily retrievable when needed.

The Storage API is able to **scale based on file storage demands**, making it suitable for **handling large datasets** and extensive media libraries.
Whether users are **uploading files in bulk** or **requesting multiple downloads** simultaneously, the Storage API ensures that all operations run smoothly without delays or bottlenecks.

The Storage API optimizes **file retrieval**, ensuring that downloads are processed efficiently and that users can access the required files without latency.

&nbsp;

#### Client Collection Module

The Client Collection Module is the **customizable component** of Elody’s backend, designed to incorporate **client-specific business logic** and features.
This microservice enables seamless **integration with external APIs**, ensuring smooth data exchange between Elody and third-party systems.

Beyond API integrations, this module plays a crucial role in **data transformation**.
It includes migration scripts that parse and convert external data into the Elody format, allowing structured and efficient data management.

For users utilizing **bulk imports**, this service automates the process by monitoring the **designated filesystem directory** given by the customer and connecting incoming data for streamlined batch processing.
Additionally, it handles **business logic-driven validation on metadata fields**, ensuring data accuracy and compliance.

Another key aspect of this module is **access control and role management**.
It defines policies and permission structures, ensuring that user roles and access levels align with business requirements.

This flexible, client-specific backend component empowers users with **tailored functionality**, enabling Elody to adapt to diverse workflows and operational needs.

&nbsp;

#### OCR Service

The OCR Service is responsible for **processing images** to extract text, enabling advanced **search and document management** within Elody.
It provides an API with dedicated endpoints for **text extraction**, as well as the generation of **searchable PDFs** from individual or grouped images.

Once text is extracted, the OCR Service communicates with the Collection API to **store the recognized text** as metadata on the corresponding mediafile entity.
This secures that **text within images** becomes **searchable, structured, and integrated** into Elody’s data ecosystem.

By transforming images into **indexed, searchable content**, the OCR Service significantly enhances **retrieval efficiency** and **document accessibility**, making media assets more useful and easier to manage.

&nbsp;

#### Transcoder Service

The Transcode Service ensures that mediafiles are accessible and compatible across different platforms by **converting them into various formats**.
This microservice processes **audio, video, and image files**, optimizing them for different use cases such as **web display, archival storage, or high-quality downloads**.

By automatically adapting files to the required format, the Transcode Service enhances **usability, performance, and cross-platform compatibility**, ensuring that media assets in Elody are always available in the most suitable format without manual intervention.

&nbsp;

#### Cantaloupe & IIIF Server

Elody utilizes Cantaloupe as its **image server**, enabling the **on-demand generation of derivatives** from high-resolution source images.
This service promises **optimized image delivery**, allowing users to **view and manipulate images** efficiently within the platform.

Cantaloupe is fully compliant with **IIIF** (International Image Interoperability Framework), a set of **open standards** designed for scalable and high-quality digital object delivery.
By integrating IIIF with Cantaloupe, Elody provides **image manipulation capabilities**, allowing users to scale and rotate images directly in the frontend.

Additionally, Cantaloupe supports **deep-zoom functionality**, enhancing the viewing experience in Elody’s image viewer.
**Thumbnails** are also dynamically generated, ensuring **fast and responsive previews** without unnecessary storage consumption.

As a **core service for image rendering and handling**, Cantaloupe enhances performance, flexibility, and user experience, making image management in Elody efficient.

&nbsp;

#### Filesystem Importer Service

The Filesystem Importer Service **automates the bulk import of files from a designated filesystem directory**, ensuring a structured and efficient ingestion process.
It identifies a single CSV file that serves as a reference guide for importing all other files within the same directory.
Once validated, the service processes and **integrates the files into Elody**, maintaining data consistency and organization.

Beyond simple file imports, the service can **analyze directory structures**, detecting whether subdirectories contain additional nested layers.

This approach enhances scalability, making it easier to manage large-scale imports while reducing manual effort.

&nbsp;

#### Antivirus Service

Elody integrates **ClamAV**, an open-source antivirus solution, to **safeguard** the platform from **malicious files**.
Every file uploaded or processed within Elody undergoes an **automated security scan**, ensuring that viruses, malware, or other threats do not compromise the system’s integrity.

This **proactive security measure** is particularly critical for a **data-driven platform** like Elody, where large volumes of external files are regularly imported and shared.
By preventing the spread of **infected files**, the antivirus service uses ClamAV to reinforce data security, system stability, and user trust, making Elody a secure environment for managing and integrating files and information.

&nbsp;

#### Database services

Elody supports multiple **Database Management Systems (DBMS)**, allowing customers to choose between **MongoDB** or **ArangoDB** based on their specific requirements.
Depending on the selected DBMS, a dedicated **database service** will be running to ensure data storage and retrieval.

This service includes the database itself and is responsible for maintaining **continuous availability** while delivering **high response times** for all queries.
As a critical component of Elody’s architecture, it guarantees data integrity, reliability, and optimized performance, ensuring that all operations—from simple lookups to complex queries—run efficiently and without interruption.

&nbsp;

#### Keycloak

Elody leverages Keycloak as its **access management solution**, providing **robust authentication** and **identity management**.
Keycloak ensures that user access is handled securely and efficiently, allowing administrators to manage users, roles, and permissions with fine-grained control.

Through **single sign-on (SSO)**, **multi-factor authentication (MFA)**, and **role-based access control (RBAC)**, Keycloak enables a **highly secure** login experience.
This integration promises that only authorized users can access specific parts of Elody, reinforcing **data security and compliance** without compromising user convenience.

&nbsp;

#### Traefik

Traefik is a **modern reverse proxy and load balancer** optimized for **dynamic container environments**, making it an ideal fit for Elody’s microservices architecture.
It plays a critical role in **efficiently managing internal traffic**, ensuring communication between services without manual configuration.

By **automatically detecting and routing requests** to the correct microservice, Traefik eliminates complexity while maintaining high availability and scalability.
This means users experience a smooth, uninterrupted workflow, even as the platform dynamically scales to meet demand.

Additionally, Traefik enhances security and performance, providing built-in support for authentication and load balancing.
By integrating Traefik, Elody guarantees a reliable, resilient, and flexible system, allowing us to focus on workflows without worrying about complex network configurations.

&nbsp;

#### Elody Python SDK

The Elody Python SDK serves as a **centralized toolkit** containing essential **functionality (such as CSV logic)** used across all microservices.
Instead of duplicating logic in each service, this **dedicated software development kit** ensures consistency, maintainability, and efficiency.

By providing a **standardized set of reusable utilities**, the Elody Python SDK reduces redundancy and accelerates the implementation of core functionalities across the platform.
