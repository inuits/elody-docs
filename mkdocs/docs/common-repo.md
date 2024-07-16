# elody common 

## Repo structure

### Main repo

#### Services
- In the main folder, all repos for services used by multiple clients will be pulled.
  - For non-client-specific configurations, add them to `docker-compose.yml`.
  - Client-specific configurations should go in `docker-compose-include` or in the client's docker-compose file.

  In `docker-compose-include`, you can use client names and specific environment variables. If a service is not needed for every client, or if `docker-compose-include` is insufficient, place the service in the client-specific docker-compose.

#### Modules
- Modules play a critical role in customizing the user interface for each client. They determine the layout of the dashboard components through specific GraphQL queries, a required feature for personalizing the client experience. Additionally, modules have the capability to add optional client-specific endpoints to the GraphQL service, further enhancing the adaptability and functionality for individual client needs.

#### Taskfile
- Contains commands to manage the Elody common repo and the clients.
- Use `task --list` for more details.
- Taskfile installation required: [Taskfile Installation](https://taskfile.dev/installation/)

#### Docker-compose data
- For additional local setup content such as data imports, entrypoint files, or docker files, place them in the `docker-compose` folder.

#### env.dist
- A template for the environment file for common services. Usually pre-configured and copied to `.env` when preparing the repo.
- **Important**: Make persistent changes in `dist.env`, not `.env`.

#### repositories.txt
- Determines which repositories are pulled for the project, including services, modules, and clients.
- The structure of the file is as follows: `${repo-url} ${folder-to-clone-to}` each line in the file specifies a repository URL and the target folder for cloning.

### Client repo

#### Client collection module
The client collection module is a key component for tailoring the Elody platform to meet specific client needs. It encompasses:

1. **Hooks**: Code segments that execute before or after an existing endpoint, allowing for additional processing or validations as needed.

2. **Policies**: Designed to define and enforce read and write permissions for client-specific entities, ensuring data is accessed and manipulated securely and appropriately.

3. **Extra Endpoints**: Custom endpoints embedded with client-specific domain logic. These endpoints are crucial for offering functionalities that are uniquely tailored to each client's operational requirements.

4. **Data Serializers for LOD Formats**: These serializers are responsible for converting Elody data into various Linked Open Data (LOD) formats, like RDF (Resource Description Framework). This capability is essential for integrating Elody with different LOD systems and enhancing data interoperability.

5. **Data Import Serializers**: Tools for importing data from external sources into the Elody data structure. These serializers are adaptable to a wide range of data formats, both LOD and non-LOD, thereby offering flexibility in handling diverse data integration scenarios.

#### client-frontend folder
- Contains frontend files:
- Bootstrap file with a list of GraphQL modules to load.
- Client-specific Tailwind theme and logo.

#### client graphQL module
- Each instance uses the same frontend PWA build, served with Nginx.
- Customization per client is achieved through GraphQL queries to specify UI elements like entity types, forms, views, filters, and search pages.

#### docker-compose and script
- Similar to the root repo, but with client-specific files.
- Essential items include initial database data, Keycloak realm export, and collection-API configurations.

#### Taskfile
- Add client-specific tasks here.
- Default task pulls all repositories for the client.

#### env.dist
- A template for the environment file for client services. Configure new clients by adjusting variables, primarily the client name.
- **Important**: Make persistent changes in `dist.env’, not `.env`.
- If you make changes in the client `.env` and recreated it with `task remove-env && task create-env`, don't forget to `task add-static-key-to-env`    

#### repositories.txt (client specific)
- Functions similarly to the `repositories.txt` in the Main Repo.
- Determines which repositories are pulled specifically for the client, including client-specific services, modules, and configurations.
- The file format follows the same structure as in the Main Repo.

### Client repo

#### Client collection module
The client collection module is a key component for tailoring the Elody platform to meet specific client needs. It encompasses:

1. **Hooks**: Code segments that execute before or after an existing endpoint, allowing for additional processing or validations as needed.

2. **Policies**: Designed to define and enforce read and write permissions for client-specific entities, ensuring data is accessed and manipulated securely and appropriately.

3. **Extra Endpoints**: Custom endpoints embedded with client-specific domain logic. These endpoints are crucial for offering functionalities that are uniquely tailored to each client's operational requirements.

4. **Data Serializers for LOD Formats**: These serializers are responsible for converting Elody data into various Linked Open Data (LOD) formats, like RDF (Resource Description Framework). This capability is essential for integrating Elody with different LOD systems and enhancing data interoperability.

5. **Data Import Serializers**: Tools for importing data from external sources into the Elody data structure. These serializers are adaptable to a wide range of data formats, both LOD and non-LOD, thereby offering flexibility in handling diverse data integration scenarios.

#### client-frontend folder
- Contains frontend files:
- Bootstrap file with a list of GraphQL modules to load.
- Client-specific Tailwind theme and logo.

#### client graphQL module
- Each instance uses the same frontend PWA build, served with Nginx.
- Customization per client is achieved through GraphQL queries to specify UI elements like entity types, forms, views, filters, and search pages.

#### docker-compose and script
- Similar to the root repo, but with client-specific files.
- Essential items include initial database data, Keycloak realm export, and collection-API configurations.

#### taskfile
- Add client-specific tasks here.
- Default task pulls all repositories for the client.

#### env.dist
- A template for the environment file for client services. Configure new clients by adjusting variables, primarily the client name.
- **Important**: Make persistent changes in `dist.env’, not `.env`.

#### repositories.txt (client specific)
- Functions similarly to the `repositories.txt` in the Main Repo.
- Determines which repositories are pulled specifically for the client, including client-specific services, modules, and configurations.
- The file format follows the same structure as in the Main Repo:


## Initializing

### How to start for the first time

1. Install `task` command from [taskfile.dev](https://taskfile.dev/installation/) (if not available).
2. Run `task setup-env`.
3. Run `task build-client`.
4. Run `task start-client`
5. Run `task import-keycloak-realm`.
6. Run `task import-mongo-data`.
7. Run `task add-static-key-to-env`.
8. Run `task generate`.

*Note: If the local environment is already running for a client, skip steps 1 & 2.*

### Stopping environments

#### Stop a client environment
- Run `task stop-client’.

#### Stop the root environment
- Run `task stop-root’.

#### Starting a client enviroment
- Run `task start-client’.

### Working on a client

*If you've made adjustments requiring a build, such as installing a new library:*
- Run `task build-client’.

*If you've made adjustments to the queries:*
- Run `task generate’.

*show all links:*
1. Go to client directory
2. Run `task links`

*login*
- user: `developers@inuits.eu`
- password: `developers`
*this is in most cases but can be changed in the client realm import


## Common problems

### User gets logged out every time - collection-api throws 401
#### Cause
There could be more reasons/causes of why this happens. 
One of them is a problem with the data of your user.
Your user which you login with has to have a relation with the super tenant. This relation should look like:
```
"relations" : [
        {
                "key" : "tenant:super",
                "type" : "hasTenant",
                "roles" : [
                        "superAdmin"
                ]
        }
],
```
*The roles array is where the problem can be*
The value `superAdmin` has to be present in the roles array.

#### Solution
Check your mongo data by excecing into your mongo db with a mongo shell `docker exec -it [container] mongo`. 
List your entities and find the one that represents your user.
1. `show databases` and select db by:
2. `use [db you want to use]`
3. `show collections` to print out the collections
4. `db.[collection].find().pretty()` to print uit the entities

To add the role to your user entity perform an update by:
```
db.entities.findOneAndUpdate(
  {"_id": [the id of your user entity]},
  { $set: [your new entity object with the superAdmin role] }
)
```
Your user entity should now have the `superAdmin` role on the relation with your tenant.




