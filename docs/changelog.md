# Changelog

## Upcoming
### Improved history service
TODO

## 2026-09
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

**Note**: This change requires client specific configuration

### Merge UI
A new interface is added to merge two or more entities together. One of the entities will remain, the others will be removed. Entities pointing to the ones that are being removed will be updated to point to the remaining entity.

![Merge UI](/images/changelog-0001.png)

**Note**: This change requires client specific configuration


### Communication platform between users
elody now has an optional communication platform where users can discuss entities. Discussions can be shown as threads and can be closed once they are resolved. In messages it is possible to mention users as well as refer to entities which will then be linked.

![Discussion](/images/changelog-0005.png)

**Note**: This change requires client specific configuration

