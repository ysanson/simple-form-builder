export interface FormInput {
    id: string;
    name: string;
    label?: string;
    type: "" | "text" | "number" | "boolean" | "textarea" | "select" | "header" | "subheader";
    required: boolean;
    hidden: boolean;
    disabled: boolean;
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    description?: string;
    defaultValue?: string;
    options?: string[];
}

