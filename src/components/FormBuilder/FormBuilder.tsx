import React, { useState, useEffect, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SortableContainer from "../SortableContainer";
import Form from "react-bootstrap/Form";
import Select, { SelectOption } from "../Select";
import Button from "react-bootstrap/Button";
import { v4 } from "uuid";
import type { FormInput } from "../../types/FormInput";

/**
 * Types for the edit form. Some fields have to change types in order to be inputable.
 */
interface EditFormData extends Omit<FormInput, "options"> {
    /**
     * Transforms the type of the key Option from string[] to string.
     */
    options?: string;
}

const defaultValues: EditFormData = {
    id: "",
    max: undefined,
    min: undefined,
    pattern: undefined,
    maxLength: undefined,
    minLength: undefined,
    required: false,
    name: "",
    type: "",
    defaultValue: "",
    description: "",
    label: "",
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
const FormBuilder: React.FC<FormBuilderProps> = ({ formDefinition, updateFormDefinition }) => {
    const [editFormData, setEditFormData] = useState<EditFormData | undefined>();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<EditFormData>({ defaultValues });
    const [editId, setEditId] = useState("");
    const type = watch("type");

    /**
     * Handler for a successful edit form validation.
     *
     * @param data The data returned by the form validation
     */
    const onSubmit: SubmitHandler<EditFormData> = (data) => {
        // Transform some data to conform to FormInput.
        if (data.label === "") {
            data.label = undefined;
        }
        const newItem = data as FormInput;
        newItem.options = data.options?.split(";").map((opt) => opt.trim());

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
            return editId === "" ? !formDefinition.some((input) => input.name === inputName) : true;
        },
        [editId, formDefinition]
    );

    const body = (
        <Container fluid>
            <Row>
                <Col md={8}>
                    <SortableContainer
                        editId={editId}
                        setEditId={setEditId}
                        setEditFormData={(item) => {
                            if (item) {
                                const editItem: any = item;
                                editItem.options = item.options?.join(";");
                                setEditFormData(editItem as EditFormData);
                            } else {
                                setEditFormData(undefined);
                            }
                        }}
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
                                    <Form.Label>Nom du champ</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.name}
                                        defaultValue={editFormData?.name}
                                        disabled={editId !== ""}
                                        {...register("name", { required: true, validate: { validateInputName } })}
                                    />
                                    <Form.Text>Le nom du champ, égal au nom de la variable Terraform.</Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name?.type === "validateInputName" && "Ce nom est déjà pris."}
                                        {errors.name?.type === "required" && "Ce champ est requis."}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group>
                                    <Select
                                        label="Type de champ"
                                        id="field-type"
                                        isInvalid={!!errors.type}
                                        options={fieldTypesOptions}
                                        {...register("type", { required: true })}
                                    />
                                    <Form.Control.Feedback type="invalid">Ce champ est requis</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group controlId="field-label">
                                    <Form.Label>Label du champ</Form.Label>
                                    <Form.Control {...register("label")} />
                                    <Form.Text>Si vide, le nom du champ sera utilisé.</Form.Text>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group controlId="field-default-value">
                                    <Form.Label>Valeur par défaut</Form.Label>
                                    <Form.Control disabled={type.includes("header")} defaultValue={editFormData?.defaultValue} {...register("defaultValue")} />
                                </Form.Group>
                            </Row>
                            {type === "select" && (
                                <Row className="mb-3">
                                    <Form.Group controlId="field-options">
                                        <Form.Label>Options du sélect</Form.Label>
                                        <Form.Control
                                            defaultValue={editFormData?.options}
                                            isInvalid={!!errors.options}
                                            {...register("options", { required: type === "select" })}
                                        />
                                        <Form.Text>Séparez les options par des points virgules (;)</Form.Text>
                                    </Form.Group>
                                </Row>
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
                                <Form.Group>
                                    <Form.Check
                                        disabled={type.includes("header")}
                                        type="switch"
                                        id="check-required"
                                        label="Requis ?"
                                        {...register("required")}
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="outline-success" type="submit">
                                        Enregistrer
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

