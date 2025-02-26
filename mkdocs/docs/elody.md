# Elody Functional Documentation


## Elody: a modular semantic data platform

Elody is a **modular semantic data platform** designed to revolutionize the way organizations manage, share, and distribute structured data.
By combining a powerful backend with an intuitive user interface, Elody provides users with a seamless experience for handling data.
Its flexible architecture enables businesses to define entities, establish meaningful relationships between them, and integrate external services effortlessly.
Whether working with textual, numerical, or media-based data, Elody ensures consistency, accessibility, and ease of use.

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


## Core Features

### Entity Management

Elody enables seamless data management, sharing, and distribution through a user-friendly interface that is fully customizable to meet specific needs.
With intuitive navigation and metadata configuration options, users can efficiently organize and interact with their data, ensuring a smooth and tailored experience.

1. **Customizable Entity Definition for Tailored Metadata Management**

Elody empowers customers to define a unique set of entities, each with specific attributes, to structure their metadata efficiently and to enhance organization and retrieval of entities.
Our highly flexible system enables developers to seamlessly integrate these entity definitions into the customer-specific Elody application, ensuring a tailored data schema that meets individual business requirements.

Entities within Elody can represent a wide range of real-world and digital objects, from physical assets to living organisms.
This adaptability allows organizations to digitally manage and preserve their collections, bringing both tangible and intangible assets into a structured digital environment.

2. **Flexible Viewing Options and Configurable Metadata Display for Enhanced User Experience**

Entities of the same type are displayed as structured lists on overview pages, where customers can configure which metadata fields are visible.
This ensures that the most relevant information is highlighted in this teaser metadata, offering a quick and informative snapshot of each entity.

Elody’s user interface offers multiple viewing options to accommodate different user preferences and data presentation needs.
Entities can be displayed as list items for a structured, linear view or as grid items for a more visual and dynamic layout.
This flexibility ensures that users can navigate and interact with their data in the most efficient and intuitive way.

On entity detail pages, all metadata attributes are accessible, with full customization options.
Customers can define the order in which metadata fields appear and group related attributes together for a more intuitive and organized presentation.
This ensures that users can efficiently navigate and interact with entity data in a way that best suits their needs.

3. **Seamless Semantic Linking for Enriched Data Relationships**

One of Elody’s core functionalities is the ability to establish meaningful relationships between entities, enhancing data quality and context through semantic linking.
Entities can be connected to other entities, media files, or even themselves, with no restrictions on the number or type of relationships that can be created.

Customers have full control over defining how entities relate to one another by providing this information in their data model.
Based on these definitions, we configure the user interface to support the addition of relevant relationships seamlessly.

4. **Intuitive Interface for Effortless Entity Linking**

Elody’s user-friendly interface simplifies the process of linking entities.
While viewing an entity’s metadata, users can easily access a menu to establish new connections directly.

Dedicated UI components within an entity’s detail page display related entities of specific types.
From here, users can either link existing entities or create new ones and immediately establish their relationship—all within a streamlined workflow.

5. **Comprehensive Media Integration for Visual Content Enrichment**

In addition to entities, Elody supports the integration of images and other mediafiles, offering the same extensive metadata and relationship capabilities.
By incorporating mediafiles, Elody enhances data with rich visual content, providing deeper context.

Mediafiles can come in various formats, including images, PDFs, and text files for example.
These files are displayed using Elody’s Media Viewer component, which allows users to zoom, toggle full page, navigate through multi-page documents, and interact with media intuitively.

For entities linked to media files, a thumbnail preview can be displayed on overview pages, offering users a quick visual reference.
This feature is particularly effective in grid view mode, where media-rich content can be presented in an engaging layout.












### Data Manipulation

Elody provides flexible options for managing data, whether by migrating existing records or adding new ones.
Users can edit or remove incomplete or incorrect data based on custom validation rules and restrictions.
Additionally, relationships can be established between entities and mediafiles, ensuring structured and meaningful data connections.

1. **Flexible Data Import Options**

Elody offers multiple ways to import data into the system. Clients can designate a physical or cloud storage device and place their data in a structured format within a specified folder.
This storage location is accessible directly from Elody’s user interface.

With just a few clicks, users can initiate a full import of the selected folder through Elody's UI.
Once the process is complete, the data appears in the UI, including all specified metadata and relationships.

2. **Creating and Editing Entities in Elody**

  2.1 Create entities

Elody provides multiple ways to create entities through the user interface. A shortcut in the menu allows quick access to create any available entity type.
Additionally, on overview pages, users can initiate entity creation through an action button.
When working within the detail page of a related entity, a new entity can be created and linked instantly.

For bulk creation, entities can be created using a **CSV file**, where each row represents an entity.
Once uploaded, the system automatically generates entities along with their metadata and relationships, making it easy to populate large datasets efficiently.

2.2 Edit entities

Entities can be edited individually on their detail pages, where clear validation rules on each metadata field guide users to ensure data accuracy.
For bulk editing, CSV imports enable modifications across multiple entities at once, significantly reducing manual effort and improving workflow efficiency.

2.3 Add or remove relations

In addition to editing metadata through the UI or bulk uploads, Elody offers an efficient process for establishing relationships between entities.
Certain predefined relationships can also be created in bulk using CSV uploads or edits, allowing for large-scale data connections with minimal effort.

The standard way to add relationships is through the user interface, either during entity creation or when editing an existing entity. 
Elody’s UI provides clearly visible buttons and intuitive screens, ensuring that linking (or unlinking) entities is a straightforward and user-friendly process.

3. **Uploading Mediafiles**

3.1 Direct Upload on Entity Detail Pages

Users can upload mediafiles directly from an entity’s detail page. Simply drag and drop files into the designated drop zone, click save, and the media files will be inserted into to the system.

3.2 CSV-Based Bulk Upload

For a more structured approach, mediafiles can be uploaded using a CSV file, allowing users to specify metadata for each file.
This method also supports the simultaneous creation of entities and the automatic linking of mediafiles to them, streamlining data organization.

4. **Deleting Entities in Elody**

4.1 Bulk Deletion

Entities and mediafiles can be removed in bulk from overview screens. Checkboxes allow users to select specific items, and filtering options make it easy to refine selections.
Users can also increase the page limit to select and delete all entities displayed on a page at once.

The bulk delete process includes an option to automatically remove related entities when necessary, preventing orphaned data.
However, entities with blocking relationships—those that are required for other entities to function—will not be deleted. This safeguard prevents accidental data loss and ensures system consistency.

4.2 Single-Entity Deletion

When deleting a single entity, Elody provides a detailed overview of all related entities. Users can choose to remove related items simultaneously.
If an entity cannot be deleted due to blocking relationships, these dependencies are clearly displayed, allowing users to navigate to them and take the necessary actions before proceeding.

5. **Data Migration**

Elody is designed to support data coming from various sources, whether it involves migrating external data and storing it permanently in Elody, or continuously fetching and mapping external data to fit Elody’s structure.

For clients transitioning from an older application or requiring a structured data migration, Elody provides a tailored migration process.
A custom migration plan is created for each client to ensure a smooth and efficient transfer.
Once the plan is established, our team manages the full migration, minimizing disruptions and preventing data loss.























### Data Filtering and Search

The benefits of making your data searchable through filters include:

##### 1. Faster Data Retrieval
Filters help users quickly find relevant information without manually sifting through large datasets. This improves efficiency and reduces frustration.

##### 2. Improved Accuracy
Instead of relying on broad search terms, filters allow users to refine their searches based on specific attributes, reducing irrelevant results and increasing precision.

##### 3. Better User Experience
A well-structured filtering system makes navigation intuitive, ensuring that users can effortlessly access the data they need.

##### 4. Enhanced Productivity
By eliminating unnecessary searches and guesswork, filters enable users to focus on analyzing data and making informed decisions.

##### 5. Scalability
As datasets grow, filters become even more crucial in maintaining usability, preventing overwhelming search results and keeping data manageable.

##### 6. Customization & Personalization
Filters allow users to tailor their searches based on unique criteria, ensuring that different user needs are met without cluttering the interface.

##### 7. Data Integrity & Quality Control
When users can filter by structured metadata, it ensures that data is consistently categorized and easier to maintain.

##### 8. Seamless Integration with Automation
Filtered search results can be used for automated workflows, such as triggering actions based on specific data attributes.

#### Filtering in elody
- **Advanced Filters** – Apply granular filters to refine search results based on:
    - ID
    - Text
    - Date
    - Number
    - Selection values
    - Boolean values
    - Entity Type
- **Simple Search** – Conduct quick searches across all defined entity types for instant access to relevant data.



### Access Control

- **User-role authorization** – Restrict data access based on user roles and permissions.
- **UI Visibility Restrictions** – Limit access to specific:
    - Menu items
    - Pages
    - Buttons
    - Actions
- **Granular Permissions** – Ensure different users have tailored access levels according to their responsibilities.




### Sorting and Pagination

- Define sorting options per entity to enhance organization.
- Customize pagination limits to optimize data viewing and retrieval.
- Provide users with a seamless browsing experience through an intuitive navigation system.




### OCR (Optical Character Recognition)

- Extract text from images to enhance searchability and usability.
- Generate searchable PDFs from multiple images, allowing for efficient document management, retrieval and searching.
- Automatically save extracted text on mediafiles for enhanced usability/searchability.




### Job System

- Track background operations triggered by users, ensuring transparency and efficiency.
- Monitor the progress of tasks running or waiting in the queue, such as extracting text from images.
- Monitor the progress of finished tasks, f.e. get a full overview of entities created after a batch upload. Entities created are linked to the job and failed uploads contain all the information needed.





### Maps Integration

- Display and manage spatial data effectively.
- Supports multiple mapping formats and layers on the map component.
- Enhance geospatial analysis and visualization capabilities within the platform.




### CSV's

#### CSV Export

- Download entities and mediafiles as CSV for quick insights and easy external reporting.
- Automate periodic exports for scheduled data analysis and reporting.

#### CSV Import

- Efficiently import large datasets using CSV files for quick and seamless data insertion.

#### CSV Mutations

- Modify metadata for a selected set of entities quickly and efficiently, streamlining data management.




### External API Integration

- Connect to external APIs and fetch data dynamically to enrich the platform’s capabilities.
- Display external data seamlessly within Elody’s UI, ensuring a unified experience.

### Open Linked Data

- Support for linked data formats enhances interoperability with external systems.
- Enable semantic web integrations for richer data connectivity.
- Facilitate seamless data sharing across platforms using open standards.








## Architecture

(duurzaam gebruiken)

### Modular Microservices

- **Generic Modules & Services** – Core functionality available to all Elody clients ensures a strong foundation.
- **Client-Specific Modules** – Tailor functionalities to meet the unique needs of each client, providing a personalized experience.
- **Scalability & Performance** – The modular nature ensures easy scaling and optimized performance.

### Frontend

#### Progressive Web Application
- Provides a structured and generic frontend that can be generated through different graphql implementations.
- **Progressive Web Application (PWA)** for easy access across devices.

#### Graphql
- Facilitates dynamic UI configurations tailored to client-specific needs, ensuring a highly customizable user experience.
- Enhances performance and development efficiency by streamlining communication between frontend and backend systems.
- Simplifies data integration from multiple sources, internal or external, making it easy to fetch data from external APIs.

### Backend

Elody utilizes a microservices architecture with key services including:

- **Collection API** – Manages and organizes data collection efficiently.
- **Storage API** – Handles file storage and ensures data security.
- **OCR Service** – Processes images for text extraction, improving search capabilities.
- **Transcode Service** – Converts mediafiles into various formats for compatibility.
- **Cantaloupe & IIIF Server** – Enhances image rendering and handling.
- **Filesystem Importer Service** – Facilitates seamless bulk data imports.
- **Antivirus Software** – Ensures security by scanning uploaded files.
- **Database Support:** Compatible with MongoDB and ArangoDB for scalable, high-performance data storage.
- **Authentication & Identity Management:** Utilizes **Keycloak** to manage user authentication securely.
- **API Gateway & Routing:** **Traefik** efficiently handles API requests and network traffic.