import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { FieldErrorsImpl, FieldValues, useForm } from "react-hook-form";
import FormFields from "../FormFields";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import type { FormInput } from "../../types/FormInput";

interface FormGeneratorProps {
    /**
     * The form definition to build, contains a list of FormInput.
     */
    formDefinition: FormInput[];
    /**
     * If true, hides the submit button (must then pass the prop `triggerSubmit`).
     */
    hideSubmit: boolean;
    /**
     * Triggers a submit externally.
     */
    triggerSubmit: boolean;
    /**
     * Custom label for the submit button.
     */
    submitBtnLabel?: string;
    /**
     * Custom label for the reset button.
     */
    resetBtnLabel?: string;
    /**
     * Prop to tell the component a loading state, usually after submitting.
     */
    isLoading?: boolean;
    /**
     * Callback when the validation is successful.
     *
     * @param responses The responses to the form. Object containing key-value pairs, the keys being the input name.
     */
    onSubmitSuccess: (responses: FieldValues) => void;
    /**
     * Callback when the validation is on error.
     *
     * @param errors The validation errors in the fields.
     */
    onSubmitError?: (errors: Partial<FieldErrorsImpl<{ [x: string]: any }>>) => void;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
    formDefinition,
    hideSubmit,
    triggerSubmit,
    submitBtnLabel,
    resetBtnLabel,
    isLoading,
    onSubmitError,
    onSubmitSuccess,
}) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();

    /**
     * UseEffect for external submit
     */
    useEffect(() => {
        if (triggerSubmit) {
            handleSubmit(
                (data) => onSubmitSuccess(data),
                (errs) => {
                    if (onSubmitError) onSubmitError(errs);
                }
            )();
        }
    }, [handleSubmit, onSubmitError, onSubmitSuccess, triggerSubmit]);

    return (
        <Container>
            <Form
                noValidate
                onSubmit={handleSubmit(
                    (data) => onSubmitSuccess(data),
                    (errs) => {
                        if (onSubmitError) onSubmitError(errs);
                    }
                )}
            >
                <Row>
                    <FormFields fields={formDefinition} register={register} errors={errors} />
                </Row>
                <Row>
                    <div className="d-flex justify-content-around">
                        <Button type="reset" variant="danger" onClick={() => reset()}>
                            {resetBtnLabel ?? "Réinitialiser"}
                        </Button>
                        {!hideSubmit && (
                            <Button type="submit" variant="success" disabled={isLoading}>
                                {isLoading && (
                                    <>
                                        <Spinner as="span" size="sm" animation="border" role="status" aria-hidden />
                                        &nbsp;&nbsp;
                                    </>
                                )}
                                {submitBtnLabel ?? "Envoyer"}
                            </Button>
                        )}
                    </div>
                </Row>
            </Form>
        </Container>
    );
};

export default FormGenerator;

