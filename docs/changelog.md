# Changelog

Here you can find an overview of all the newly developed features in recent Elody versions.

_Please note that not all of these features might be automatically available for each environment. For some of these features client specific configuration is required._

## Upcoming
Features that we are working on but are not yet finished. These might come in a future version when they are ready.

## 2026.Q4
### History viewer
Entities can now show their history: a "View history" button on the detail page opens two versions side by side. Changed fields are marked, relations that were added, removed or renamed show as coloured chips, and each version shows who edited it and when. Related entities appear with the name they had at that time. See [History Viewer](/services/elody-frontend/features/history-viewer) for the configuration.

## 2026.Q3
### Navigation between search results
After filtering entities on an overview page and opening the detail page of an entity, you will now find navigation arrows to jump to the previous or next entity from the filter result. This allows you to easily go to the previous/next result without first having to open the filter result again.

### Search highlighting
When searching for text elody can now highlight the matched word in the search result

![Highlighting](/images/changelog-0004.png)

*Note that this only works if TypeSense is available*

### API token management
API token management: users with the correct permissions can now define third parties and create API tokens for them. These tokens can then be used to access the elody API.

![API Token](/images/changelog-0003.png)

### Bulk edit UI
Elody now has a graphical interface to update multiple entities in bulk. After making a selection it is possible to update one or more fields.

![Bulk UI](/images/changelog-0002.png)

### Merge UI
A new interface is added to merge two entities together. One of the entities will remain, the other will be removed. Entities pointing to the one that is being removed will be updated to point to the remaining entity.

![Merge UI](/images/changelog-0001.png)

### Communication platform between users
elody now has an optional communication platform where users can discuss entities. Discussions can be shown as threads and can be closed once they are resolved. In messages it is possible to mention users as well as refer to entities which will then be linked.

![Discussion](/images/changelog-0005.png)

