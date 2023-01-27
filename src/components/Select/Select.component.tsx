import React from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Spinner from "react-bootstrap/Spinner";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface SelectOption {
    /**
     * Value of the option.
     */
    value: string;
    /**
     * Label to show for this option.
     */
    label: string;
}

interface SelectProps {
    /**
     * The label to show.
     */
    label: string;
    /**
     * The options to populate.
     */
    options: SelectOption[];
    /**
     * The default option label. Defaults to `Choose...`
     */
    defaultOption?: string;
    /**
     * The ID of the component.
     */
    id: string;
    /**
     * If the form validation deems this value invalid. 
     */
    isInvalid?: boolean;
    /**
     * Props to show a loading animation while options are loading.
     */
    isLoading?: boolean;
    /**
     * Aria element.
     */
    describedBy?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps & UseFormRegisterReturn>(
  ({ label, options, defaultOption = "Choose...", id, describedBy, name, isInvalid, isLoading = false, onChange, onBlur, required, disabled }, ref) => {
    return (
      <>
        <Form.Label htmlFor={id} id={`${id}Label`}>
          {label}
        </Form.Label>
        <Stack direction="horizontal" gap={3}>
          <Form.Select
            id={id}
            name={name}
            aria-describedby={describedBy}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            isInvalid={isInvalid}
            required={required}
            disabled={disabled}
          >
            <option value="" disabled>
              {defaultOption}
            </option>
            {options.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label !== "" ? option.label : option.value}
              </option>
            ))}
          </Form.Select>
          {isLoading && (
            <Spinner animation="border" variant="secondary">
              <span className="visually-hidden">Loading options...</span>
            </Spinner>
          )}
        </Stack>
      </>
    );
  }
);

Select.displayName = "Select";

export default Select;
