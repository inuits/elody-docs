# The running example: a garage network

Every example in these docs uses the same made-up client: a network of
garages that service cars and keep an inventory of parts for them. The domain
is small and familiar, so the examples can focus on Elody instead of on the
data.

## The garages

Each garage is a **tenant**. Its employees, customers, cars, parts and work
orders belong to it, and a request picks the garage with the `X-Tenant-ID`
header. The catalogue of car models is the one thing all garages share.

The entities use the `pim:1` schema, so schema-prefixed keys in filters and
policies read `pim:1|properties.category.value`.

## Entity types

| Type | What it is | Metadata keys |
|---|---|---|
| `garage` | One garage of the network, the tenant | `name`, `address`, `phone`, `opening_hours` |
| `employee` | Someone working at a garage | `first_name`, `last_name`, `email`, `role` |
| `customer` | Someone who brings a car in | `first_name`, `last_name`, `email`, `phone` |
| `car` | A customer's car | `licence_plate`, `vin`, `mileage`, `first_registration`, `colour` |
| `carModel` | A make and model, shared by all garages | `make`, `model`, `fuel_type`, `year_from`, `year_to` |
| `part` | A part in a garage's inventory | `part_number`, `name`, `category`, `price`, `stock_quantity`, `reorder_level` |
| `workOrder` | A service or repair job on a car | `title`, `description`, `status`, `planned_date`, `mileage_at_intake`, `labour_hours` |
| `mediafile` | Elody's own type: damage photos, invoices, service manuals | |

Values the examples use:

- `role`: `mechanic`, `service_advisor`, `manager`
- `fuel_type`: `petrol`, `diesel`, `electric`, `hybrid`
- `category`: `brakes`, `filters`, `tyres`, `electrical`, `engine`
- `status`: `planned`, `in_progress`, `waiting_for_parts`, `ready_for_pickup`, `done`

## Relations

Relation types are snake_case and come in pairs, one for each direction.

| From | Relation | To | Inverse |
|---|---|---|---|
| `garage` | `has_employee` | `employee` | `works_at` |
| `customer` | `owns` | `car` | `owned_by` |
| `car` | `of_model` | `carModel` | `model_of` |
| `part` | `fits_model` | `carModel` | `has_compatible_part` |
| `workOrder` | `for_car` | `car` | `has_work_order` |
| `workOrder` | `assigned_to` | `employee` | `assigned_work_order` |
| `workOrder` | `uses_part` | `part` | `used_in` |

Backend examples that store a link as a reference property instead name it
`ref_<target>`: `ref_car`, `ref_car_model`, `ref_parts`.

Photos, invoices and manuals hang off a `car`, a `workOrder` or a `carModel` as
mediafiles.

## Roles

| Role | Can |
|---|---|
| `manager` | Everything within their own garage, including employees and the parts inventory |
| `service_advisor` | Create and edit customers, cars and work orders; read parts |
| `mechanic` | Read the work orders assigned to them, change their status and register the parts used |

## Where the example shows up

- **Forms and guided flows**: taking in a car — pick or create the customer, then the car, then open a work order.
- **Pipeline view mode**: work orders on a board by `status`.
- **Bulk edit**: updating the price of every part in the `brakes` category.
- **Merge entities**: merging a customer who was entered twice.
- **History and comments**: who changed a work order, and the mechanic's notes on it.
- **Advanced filtering**: parts that fit a car model and are below their `reorder_level`.
- **Policies and permissions**: the three roles above, each limited to their own garage.
