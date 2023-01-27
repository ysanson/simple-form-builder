# Simple-form-builder

## Description

This component library aims to help simplify the creation of dynamic forms.
By using a form definition describing inputs, users can create, store and generate forms to be used in an application.

## Dependencies

This library is based on the fantastic [react-hook-form](https://react-hook-form.com) library for validations and input management.

For the input list, we use the [react-sortablejs](https://github.com/SortableJS/react-sortablejs) library.

The UI is based on Bootstrap, and the [react-bootstrap](https://react-bootstrap.github.io) library. This library required Bootstrap to be loaded in the project.

## Usage

### Installation

Download and install it with `npm i @ysanson/simple-form-builder`. 

### Using the components

#### FormBuilder

In a Function Component, import the FormBuilder component and provide it a form definition to work with:
```JS
const FormCreationPage = () => {
    const [formDefinition, setLocalFormDefinition] = useState<FormInput[]>([]);
    
    return <>
      <FormBuilder formDefinition={formDefinition} updateFormDefinition={(data) => setLocalFormDefinition(data)} />
    </>
  }
```

You may run into problems by using Redux as the state manager, so I recommend using a local state to handle the form definition.

#### FormPreview

The form preview component is there to display the form as it would be in use. It's there so that the necessary props of the FormGenerator component aren't needed.

```JS
const FormPreviewPage = () => {
    const [formDefinition, setLocalFormDefinition] = useState<FormInput[]>([]);
    
    return <>
      <FormPreview formDefinition={formDefinition} /> 
    </>
  }
```

#### FormGenerator

The form generator component supports both in-component and props-based submit events, meaning you can either control it from the parent component or leave a Submit button. In all cases, the onSubmitSuccess prop is required. The following is an example of basic use-case where the submit is internal:

```JS
const FormUserPage = () => {
    const [formDefinition, setLocalFormDefinition] = useState<FormInput[]>([]);
    
    return <>
      <FormGenerator formDefinition={formDefinition} onSubmitSuccess={(responses: FieldValues) => console.log(responses)} /> 
    </>
  }

```

If you want to handle the submit externally, simply fill the hideSubmit and triggerSubmit props:

```JS
const FormUserPage = () => {
    const [formDefinition, setLocalFormDefinition] = useState<FormInput[]>([]);
    const [submitNow, setSubmitNow] = useState(false);
    
    return <>
      <FormGenerator 
        formDefinition={formDefinition}
        hideSubmit
        triggerSubmit={submitNow}
        onSubmitSuccess={(responses: FieldValues) => console.log(responses)}
      /> 
    </>
  }
```

## Roadmap

- Add tests
- Add more documentation
- Improve the creation of Select component
- Better locale handling
- Improve performance
- Add more validation options
