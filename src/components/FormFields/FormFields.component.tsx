import React, { useCallback } from "react";
import { UseFormRegister } from "react-hook-form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Select, { SelectOption } from "../Select";
import type { FormInput } from "../../types/FormInput";

interface FormFieldsProps {
    fields: FormInput[];
    errors: any;
    register: UseFormRegister<any>;
}

const FormFields: React.FC<FormFieldsProps> = ({ fields, errors, register }) => {
    const getSelectOptions = (input: FormInput): SelectOption[] => {
        if (input.options) {
            return input.options.map((opt) => ({ label: opt, value: opt }));
        } else {
            return [];
        }
    };

    const getLabel = (input: FormInput): string => {
        if (input.label && input.label !== "") {
            return input.label;
        } else {
            return input.name;
        }
    };

    const getDescription = (description: string | undefined) => {
        if (description && description !== "") {
            return <Form.Text>{description}</Form.Text>;
        } else {
            return <></>;
        }
    };

    const createElement = useCallback(
        (input: FormInput) => {
            switch (input.type) {
                case "header":
                    return <h3 className="text-center"> {getLabel(input)} </h3>;
                case "subheader":
                    return (
                        <Row key={input.id} className="mb-3">
                            <h5 className="text-center">{getLabel(input)}</h5>
                        </Row>
                    );
                case "boolean":
                    return (
                        <Row key={input.id} className="mb-3">
                            <Form.Group>
                                <Form.Check
                                    label={getLabel(input)}
                                    isInvalid={!!errors[input.name]}
                                    defaultChecked={input.defaultValue?.toLowerCase() === "true"}
                                    {...register(input.name, { required: input.required })}
                                />
                                {getDescription(input.description)}
                                <Form.Control.Feedback type="invalid">Ce champ est requis.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    );
                case "select":
                    return (
                        <Row key={input.id} className="mb-3">
                            <Form.Group>
                                <Select
                                    id={`select-${input.id}`}
                                    options={getSelectOptions(input)}
                                    label={getLabel(input)}
                                    isInvalid={!!errors[input.name]}
                                    {...register(input.name, { required: input.required })}
                                />
                                {getDescription(input.description)}
                                <Form.Control.Feedback type="invalid">Ce champ est requis.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    );
                case "number":
                    return (
                        <Row key={input.id} className="mb-3">
                            <Form.Group controlId={`input-${input.id}`}>
                                <Form.Label>{getLabel(input)}</Form.Label>
                                <Form.Control
                                    type="number"
                                    isInvalid={!!errors[input.name]}
                                    defaultValue={input.defaultValue}
                                    {...register(input.name, { required: input.required, valueAsNumber: true })}
                                />
                                {getDescription(input.description)}
                                <Form.Control.Feedback type="invalid">Ce champ est requis.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    );
                case "text":
                    return (
                        <Row key={input.id} className="mb-3">
                            <Form.Group controlId={`input-${input.id}`}>
                                <Form.Label>{getLabel(input)}</Form.Label>
                                <Form.Control
                                    isInvalid={!!errors[input.name]}
                                    defaultValue={input.defaultValue}
                                    {...register(input.name, { required: input.required })}
                                />
                                {getDescription(input.description)}
                                <Form.Control.Feedback type="invalid">Ce champ est requis.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    );
                case "textarea":
                    return (
                        <Row key={input.id} className="mb-3">
                            <Form.Group controlId={`input-${input.id}`}>
                                <Form.Label>{getLabel(input)}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    isInvalid={!!errors[input.name]}
                                    defaultValue={input.defaultValue}
                                    {...register(input.name, { required: input.required })}
                                />
                                {getDescription(input.description)}
                                <Form.Control.Feedback type="invalid">Ce champ est requis.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    );
                default:
                    return <></>;
            }
        },
        [errors, register]
    );

    const createFields = () => {
        const setId = new Set<string>();

        return fields.map((input, index) => {
            if (!setId.has(input.id)) {
                setId.add(input.id);
                const el = createElement(input);
                if (input.type.includes("header") || !fields[index + 1]) {
                    return <Row key={input.id}>{el}</Row>;
                } else {
                    const secondEl = createElement(fields[index + 1]);
                    setId.add(fields[index + 1].id);
                    return (
                        <Row key={input.id}>
                            <Col>{el}</Col>
                            <Col>{secondEl}</Col>
                        </Row>
                    );
                }
            } else {
                return <></>;
            }
        });
    };

    return <> {createFields()} </>;
};

export default FormFields;

