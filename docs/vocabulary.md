# Words VWB uses

The app uses its own warm names for things. The database sometimes uses older names.
This page matches them up. Use the app's words in anything people see.

## People and roles

| In the app | What it means | In the database |
|---|---|---|
| Member | Anyone with an account. All members are adults (18+). | |
| New member | The first 14 days, unless someone vouched for them or they finished a task with someone. New members have some limits. | |
| Hope Ambassador | A trusted neighbor who can verify emergencies and help keep people safe. | |
| VWB admin | Looks after villages they are assigned to. Say "VWB admins", never "staff". | `role = 'admin'` |
| Founder | The person who started VWB. | |

## Places and groups

| In the app | What it means | In the database |
|---|---|---|
| Village | Neighbors in an area, built from zip codes. Run by a Keeper and Helpers. | |
| Group | A mutual aid group, club or organization. Run by Heads and Organizers. The group can rename these titles. | `kind = 'organization'` |
| Emergency crew (or crew) | A team that responds to emergencies. Run by a Keeper and Helpers. Its icon is a tent. | `kind = 'group'` |
| World, Village, Cottage | The three Places in the top bar. The Cottage is your own space. | |
| My Corner | Your account, settings and tools. | |

Never show the word "organization" on screen, except for the "Official organization" kind of group
and for outside resource providers.

## Chats

| In the app | What it is |
|---|---|
| Village chat | The chat for everyone in a village. |
| Campfire | A team chat. |
| Sister Campfire | A Campfire shared between two groups. |
| Cottage Chat | A private chat between people who chose each other. Never call it a group. |
| Response Camp | The chat that opens for a verified emergency. |
| Village Square | The shared posts space, found under Places. |
| Announcements | VWB's own news, in the Messages hub. |
| Spark | The one gentle reaction. There are no likes or counts to chase. |

## Help

| In the app | In the database |
|---|---|
| Ask for help | a row in `help_requests` |
| Offer help | a row in `skill_matches` (a helper matched to an ask) |
| What the ask is for | `skill_needed` |
| Asking for someone else | `for_name`, and `for_consent` says they agreed |
