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

- Define an unlimited number of entity types, each with unique attributes.
  - Preserve and manage physical and digital assets and bringing your collection to a digital environment.
- Customize metadata fields for each entity to enhance organization and retrieval.
- Establish meaningful relationships between different entities, enriching the meaning and quality of data through semantic linking.
- Integrate images or mediafiles with extensive metadata support, unlocking the power of visual content enrichment.
- Manage, share, and distribute data efficiently through a user-friendly, fully customizable interface.

### Data Manipulation

- **Data Migration** – Seamlessly transfer existing data into Elody, ensuring minimal disruption.
- **Data Creation** – Easily create new entities either manually or through bulk uploads.
- **Bulk Editing** – Modify multiple entities at once, saving time and reducing errors.
- **Relations Management** – Create and manage complex relationships between different data entities using a highly intuitive UI.
- **Deletion** – Remove single or multiple entities efficiently, with safeguards to prevent data loss.




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

### Data Migration

- Easily let your business existing datasets be migrated from other applications into Elody with minimal manual effort.
- Provide automated data validation to ensure integrity during migration.

### External API Integration

- Connect to external APIs and fetch data dynamically to enrich the platform’s capabilities.
- Display external data seamlessly within Elody’s UI, ensuring a unified experience.

### Open Linked Data

- Support for linked data formats enhances interoperability with external systems.
- Enable semantic web integrations for richer data connectivity.
- Facilitate seamless data sharing across platforms using open standards.


## Architecture

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