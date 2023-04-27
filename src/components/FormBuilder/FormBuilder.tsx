import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SortableContainer from "../SortableContainer";
import Form from "react-bootstrap/Form";
import Select, { SelectOption } from "../Select";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import InputGroup from "react-bootstrap/InputGroup";
import { v4 } from "uuid";
import type { FormInput } from "../../types/FormInput";

const defaultValues: FormInput = {
  id: "",
  max: undefined,
  min: undefined,
  pattern: undefined,
  maxLength: undefined,
  minLength: undefined,
  required: false,
  hidden: false,
  disabled: false,
  name: "",
  type: "",
  defaultValue: "",
  description: "",
  label: "",
  options: [],
};

const fieldTypesOptions: SelectOption[] = [
  { label: "Texte", value: "text" },
  { label: "Nombre", value: "number" },
  { label: "Booléen", value: "boolean" },
  { label: "Champ texte", value: "textarea" },
  { label: "Sélect", value: "select" },
  { label: "Titre", value: "header" },
  { label: "Sous titre", value: "subheader" },
];

interface FormBuilderProps {
  /**
   * The form definition, containing a list of form inputs.
   */
  formDefinition: FormInput[];
  /**
   * Callback to update the form definition.
   *
   * @param data The new form definition.
   */
  updateFormDefinition: (data: FormInput[]) => void;
}

/**
 * The backbone of the form building. Layout for displaying the SortableContainer in which fields are organized, as well as having an Edit form to add or update fields.
 * The formDefinition and updateFormDefinition props must be populated; the component does not handle the form definition by itself.
 *
 * @param param0 The props.
 * @param {FormInput[]} param0.formDefinition The form definition to build.
 * @param param0.updateFormDefinition Callback to update the form definition.
 * @returns {React.FC<FormBuilderProps>} The JSX component.
 */
const FormBuilder: React.FC<FormBuilderProps> = (
  { formDefinition, updateFormDefinition },
) => {
  const [editFormData, setEditFormData] = useState<FormInput | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<FormInput>({ defaultValues });
  const { fields, append, swap, remove } = useFieldArray({
    control,
    name: "options",
  });
  const [editId, setEditId] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const type = watch("type");

  /**
   * Handler for a successful edit form validation.
   *
   * @param data The data returned by the form validation
   */
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // Transform some data to conform to FormInput.
    if (data.label === "") {
      data.label = undefined;
    }
    const newItem = data;
    newItem.options = data.options?.map((opt) => ({
      label: opt.value,
      value: opt.value,
    }));

    //If we edit, => update input
    // If edit index === -1 => append
    if (editId !== "") {
      const newForm = formDefinition.map((input) => {
        if (input.id === newItem.id) {
          return newItem;
        } else {
          return input;
        }
      });
      updateFormDefinition(newForm);
      setEditFormData(defaultValues);
      setEditId("");
    } else {
      data.id = v4();
      const newForm = formDefinition.concat([newItem]);
      updateFormDefinition(newForm);
    }
    reset();
  };

  /**
   * UseEffect to populate the edit form if a field has been selected.
   * If the field has been deselected, resets the form to the default values.
   */
  useEffect(() => {
    if (editFormData) {
      reset(editFormData);
    } else {
      setEditId("");
      reset(defaultValues);
    }
  }, [editFormData, reset, setValue]);

  /**
   * Validates that the input name is unique, so as to not override an existing field.
   * Callback to not have it reload every time for performance reasons.
   */
  const validateInputName = useCallback(
    (inputName: string) => {
      return editId === ""
        ? !formDefinition.some((input) => input.name === inputName)
        : true;
    },
    [editId, formDefinition],
  );

  const body = (
    <Container fluid>
      <Row>
        <Col md={8}>
          <SortableContainer
            editId={editId}
            setEditId={setEditId}
            setEditFormData={(item) => setEditFormData(item)}
            reset={reset}
            updateFormDefinition={(data) => {
              setEditFormData(undefined);
              reset(defaultValues);
              updateFormDefinition(data);
            }}
            formDefinition={formDefinition}
          />
        </Col>
        <Col md={4}>
          <div className="sticky-top" style={{ top: "70px" }}>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <h4>Créer ou modifier un champ</h4>
              </Row>
              <input type="hidden" {...register("id")} />
              <Row className="mb-3">
                <Form.Group controlId="field-name">
                  <Form.Label>Field name</Form.Label>
                  <Form.Control
                    isInvalid={!!errors.name}
                    defaultValue={editFormData?.name}
                    disabled={editId !== ""}
                    {...register("name", {
                      required: true,
                      validate: { validateInputName },
                    })}
                  />
                  <Form.Text>
                    The field name, which will be sent in the response data.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.type === "validateInputName" &&
                      "This name is already in use."}
                    {errors.name?.type === "required" &&
                      "This field is required."}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group>
                  <Select
                    label="Field type"
                    id="field-type"
                    isInvalid={!!errors.type}
                    options={fieldTypesOptions}
                    {...register("type", { required: true })}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="field-label">
                  <Form.Label>Field label</Form.Label>
                  <Form.Control {...register("label")} />
                  <Form.Text>If empty, the field name will be used.</Form.Text>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="field-default-value">
                  <Form.Label>Default value</Form.Label>
                  <Form.Control
                    disabled={type.includes("header")}
                    defaultValue={editFormData?.defaultValue}
                    {...register("defaultValue")}
                  />
                </Form.Group>
              </Row>
              {type === "select" && (
                <>
                  <Row className="mb-1">
                    <Col md="auto">
                      <Button
                        onClick={() => setShowOptions(!showOptions)}
                        variant="outline-primary"
                        size="sm"
                        active={showOptions}
                      >
                        {showOptions ? "Hide options" : "Show options"}
                      </Button>
                    </Col>
                  </Row>
                  <Collapse in={showOptions}>
                    <div id="collapse-options">
                      <Row className="mb-1">
                        {fields.map((input, index) => {
                          return (
                            <Row className="mb-1" key={input.id}>
                              <InputGroup>
                                <Form.Control
                                  placeholder={`Option ${index + 1}`}
                                  aria-label="option"
                                  defaultValue={input.value}
                                  {...register(`options.${index}.value`, {
                                    required: true,
                                  })}
                                />
                                <Button
                                  variant="outline-secondary"
                                  disabled={index === 0}
                                  onClick={() => swap(index, index - 1)}
                                >
                                  🔼
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  disabled={index === fields.length - 1}
                                  onClick={() => swap(index, index - 1)}
                                >
                                  🔽
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() => remove(index)}
                                >
                                  🗑️
                                </Button>
                              </InputGroup>
                            </Row>
                          );
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Col md="auto">
                          <Button
                            variant="outline-secondary"
                            onClick={() => append({ value: "", label: "" })}
                          >
                            ➕
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Collapse>
                </>
              )}
              <Row className="mb-3">
                <Form.Group controlId="field-description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    disabled={type.includes("header")}
                    defaultValue={editFormData?.description}
                    rows={5}
                    {...register("description")}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Check
                    disabled={type.includes("header")}
                    type="switch"
                    id="check-required"
                    label="Required"
                    {...register("required")}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="switch"
                    id="check-hidden"
                    label="Hidden"
                    {...register("hidden")}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="switch"
                    id="check-disabled"
                    label="Disabled"
                    {...register("disabled")}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="outline-success" type="submit">
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );

  return <>{formDefinition.length === 0 ? <h2>No data</h2> : body}</>;
};

export default FormBuilder;
