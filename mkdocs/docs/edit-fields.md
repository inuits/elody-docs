# Edit fields

Edit fields are defined within the customer-specific GraphQL module, specifically within the `fullEntity` fragment of the entity type.

### Input fields inner workings

Input fields are structured using the following JSON structure:

```js
  type InputField {
    fieldName(input: String): String
    type: String!
    validation(input: ValidationInput): Validation
    options: [DropdownOption]
    relationType: String
    fromRelationType: String
    canCreateEntityFromOption: Boolean
    metadataKeyToCreateEntityFromOption: String
    advancedFilterInputForSearchingOptions: AdvancedFilterInputType
    fileTypes: [FileType]
    maxFileSize: String
    maxAmountOfFiles: Int
    uploadMultiple: Boolean
    fileProgressSteps: FileProgress
    autoSelectable: Boolean
    disabled: Boolean
    fieldKeyToSave(input: String): String
  }
```
| Property                                   | Type                      | Description                                                                                                                              |
|--------------------------------------------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **fieldName**                              | `string`                  | Name for the input field to be displayed as label                                                                                        |
| **type**                                   | `string`                  | Input field type, comes from `InputfieldTypes`                                                                                           |
| **validation**                             | `Validation`              | Type of validation                                                                                                                       |
| **options**                                | `DropdownOptions`         | Predefined options, only required if `type` is `Dropdown`                                                                                |
| **relationType**                           | `string`                  | Relation type that needs to be set, only required if type is set to `DropdownMultiselect` or `DropdownSingleselect`                      |
| **fromRelationType**                       | `string`                  | Opposite relation type, only required if type is set to `DropdownMultiselect` or `DropdownSingleselect`                                  |
| **canCreateEntityFromOption**              | `boolean`                 | If a new entity can be created from a `DropdownMultiselect` or `DropdownSingleselect`                                                    |
| **metadataKeyToCreateEntityFromOption**    | `string`                  | The metadata key to store the value typed in the `DropdownMultiselect` or `DropdownSingleselect`                                         |
| **advancedFilterInputForSearchingOptions** | `AdvancedFilterInputType` | Sets the filters to get entities for `DropdownMultiselect` or `DropdownSingleselect`                                                     |
| **fileTypes**                              | `string[]`                | File extensions that can be uploaded if type is set to `FileUpload`                                                                      |
| **maxFileSize**                            | `string`                  | Maximum file size that can be uploaded when type has been set to `FileUpload`                                                            |
| **maxAmountOfFiles**                       | `number`                  | Maximum amount of files that can be placed in the dropzone of an input field with type `FileUpload`                                      |
| **uploadMultiple**                         | `boolean`                 | If multiple files can be uploaded (`FileUpload`)                                                                                         |
| **fileProgressSteps**                      | `FileProgress`            | The definition of progress steps for `FileUpload`                                                                                        |
| **autoSelectable**                         | `string[]`                | If an input field of type `DropdownMultiselect` or `DropdownSingleselect` automatically selects the option if only 1 option is available |
| **disabled**                               | `boolean`                 | If an input field is disabled                                                                                                            |
| **fieldKeyToSave**                         | `string`                  | The metadata key to save to if the field needs to be saved to another key than the `fieldName`                                           |


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

A metadata item receives the inputfield declaration when the item needs to be editable through the frontend, this is setup on per-entity-type bases. This inputfield also receives a `type` which is one of the `BaseFieldTypes` declared inside of the schemas.

```js
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

```js
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

Furthermore it is possible to define some more specific input types inside of the client graphql, these are some examples:

```js
enum BaseFieldType {
    locationTypeField
  }
```

```js
  enum BaseFieldType {
    publisherTypeField
  }
```

Notice that this enum type has also been called `BaseFieldType`, this is because our `graphql-codegen` merges these types and makes it so that we can use all `BaseFieldTypes` declared in all modules we use in our setup.

When we add a client specific inputfield option we also need to declare the inputfield itself, just like with the generic inputfields. In this example we define a dropdown field with some options specific to our client:

```js
export const exampleFields: { [key: string]: InputField } = {
  locationTypeField: {
    type: InputFieldTypes.Dropdown,
    options: Object.values(LocationType),
  },
};
```

These fields then get used as a variable in the `start` function of our graphql instance
```js
start(application, exampleAppConfig, [], exampleFields);
```
And get [merged](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-base-graphql/-/blob/master/main.ts#L31) with our basefields so that we can use them just like any other field inside our application.



