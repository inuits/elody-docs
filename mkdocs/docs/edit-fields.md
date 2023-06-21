# Edit fields

Edit fields are defined within the customer-specific GraphQL module, specifically within the `fullEntity` fragment of the entity type.

### Edit fields inner workings

The resolution of inputfields occurs in the [baseResolver.ts](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-base-graphql/-/blob/master/baseModule/baseResolver.ts#L458) file within the base GraphQL module. The inputField resolver function handles this resolution. It retrieves the specified field based on the provided type and fetches additional options if required.
```js
inputField: async (_source, { type }, { dataSources }) => {
    const field = baseFields[type];
    const fieldWithOptions = getOptionsByConfigKey(field, dataSources);
    return fieldWithOptions;
},
```

Input fields are structured using the following JSON structure:

```json
  type InputField {
    fieldName(input: String): String
    type: String!
    acceptedEntityTypes: [String]
    validation: Boolean
    options: [String]
    optionsConfigKey: String
  }
```
- `fieldName` is an optional parameter that can be used to define a new label for the inputfield. 

- `type` is a string that comes from the [InputFieldTypes](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-base-graphql/-/blob/master/baseModule/baseSchema.schema.ts#L23) enum, these are basically all html input types that can be used and are also used to set the type of the html `<input :type="Inputfield.type"></input>` tag in the frontend. You may notice there is also a `dropdown` type defined, when an inputfield has this type the frontend loads a custom `select` component with all `options` in the `InputField` options array.

- `options` is an array that gets filled in when the inputfield gets resolved, it uses the `optionsConfigKey` to [get](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-base-graphql/-/blob/master/sources/forms.ts#L30) options for dropdown fields.

- `optionsConfigKey` is a string that contains the key of where te resolver has to search inside of the config to find all `options`.

By using this mechanism, input fields can dynamically fetch their options based on a configuration key, allowing for flexibility in defining and updating the available options for each field.

```js
export const getOptionsByConfigKey = async (
  field: InputField,
  dataSources: DataSources
): Promise<InputField> => {
  if (!field.optionsConfigKey) return field;

  const optionsForField = (await dataSources.CollectionAPI.getConfig())[
    field.optionsConfigKey
  ];
  field.options = optionsForField;
  return field;
};
```

The base edit fields are defined in [forms.ts](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-base-graphql/-/blob/master/sources/forms.ts) and are structured like this:
```js
export const baseFields: { [key: string]: InputField } = {
  baseCheckbox: {
    type: InputFieldTypes.Checkbox,
  },
  baseDateField: {
    type: InputFieldTypes.Date,
  ,
  baseDateTimeField: {
    type: 'datetime-local'
  },
  baseNumberField: {
    type: InputFieldTypes.Number,
  },
  baseColorField: {
    type: InputFieldTypes.Color,
  },
  baseTextField: {
    type: InputFieldTypes.Text,
  },
};
```

### Add inputfields to metadata

A metadata item receives the inputfield declaration when the item needs to be editable trough the frontend, this is setup on per-entity-type bases. This inputfield also receives a `type` which is one of the `BaseFieldTypes` declared inside of the schemas.

```json
alternateName: metaData {
    label(input: "Alternate name")
    key(input: "alternateName")
    inputField(type: baseTextField) {
    ...inputfield
    }
}
```

## Generic input field types

These are all generic inputField types you can use on the `type` declaration of the inputField:

```json
enum BaseFieldType {
    baseCheckbox
    baseColorField
    baseTextField
    baseNumberField
    baseDateField
    baseDateTimeField
  }
```

## More specific input field types

Furthermore it is possible to define some more specific input types inside of the client specific module, these are some examples:

```json
enum BaseFieldType {
    locationTypeField
  }
```

```json
  enum BaseFieldType {
    coghentPublisherField
  }
```

Notice that this enum type has also been called `BaseFieldType`, this is because our `graphql-codegen` merges these types and makes it so that we can use all `BaseFieldTypes` declared in all modules we use in our setup.

When we add a client specific inputfield option we also need to declare the inputfield itself, just like with the generic inputfields. In this example we define a dropdown field with some options specific to our client:

```js
export const pzaIotFields: { [key: string]: InputField } = {
  locationTypeField: {
    type: InputFieldTypes.Dropdown,
    options: Object.values(LocationType),
    optionsConfigKey: undefined,
  },
};
```

These fields then get [exported](https://gitlab.inuits.io/customers/pza/iot/pza-iot-pza-module/-/blob/master/pzaIotModule.ts#L22) by our graphql-module and loaded in at the startup of our graphql server like so:
```js
import { pzaIotModule, pzaAppConfig, pzaIotFields } from "pza-iot-module";

export const application: Application = createApplication({
  modules: [
    baseModule,
    pzaIotModule,
    mediafileModule,
    advancedFilterModule,
    jobModule,
    importModule,
    advancedSearchModule,
    savedSearchModule,
  ],
});

start(application, pzaAppConfig, [], pzaIotFields);
```
And get [merged](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-base-graphql/-/blob/master/main.ts#L31) with our basefields so that we can use them just like any other field inside our application.



