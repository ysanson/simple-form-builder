import React from "react";
import { FormInput } from "../../types/FormInput"; 
import { ReactSortable } from "react-sortablejs";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

const CustomLG = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return <ListGroup ref={ref}>{props.children}</ListGroup>;
});
CustomLG.displayName = "CustomListGroup";

interface SortableContainerProps {
    updateFormDefinition: (data: FormInput[]) => void;
    formDefinition: FormInput[];
    editId: string;
    setEditId: (payload: string) => void;
    setEditFormData: (payload: FormInput | undefined) => void;
    reset: () => void;
}

const SortableContainer: React.FC<SortableContainerProps> = ({ updateFormDefinition, formDefinition, editId, setEditId, setEditFormData, reset }) => {
  return (
    <ReactSortable
      tag={CustomLG}
      list={formDefinition}
      setList={(items) => {
        updateFormDefinition(items);
      }}
    >
      {formDefinition.map((field) => {
        return (
          <ListGroup.Item key={field.id} className="d-flex justify-content-between align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M96 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM288 32h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"/>
            </svg>
            <div className="ms-2 me-auto">
              <div className="fw-bold">{field.name}</div>
              {field.type}
            </div>

            <div className="edit-panel">
              <ButtonGroup size="sm">
                <Button
                  active={editId === field.id}
                  variant="outline-primary"
                  onClick={() => {
                    if (editId === field.id) {
                      setEditId("");
                      setEditFormData(undefined);
                      reset();
                    } else {
                      const index = formDefinition.findIndex((data) => field.name === data.name);
                      setEditFormData(formDefinition[index]);
                      setEditId(field.id);
                    }
                  }}
                >
                  {editId === field.id ? "Cancel" : "Edit"}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    if (window.confirm("Do you really want to delete this field?")) {
                      const index = formDefinition.findIndex((data) => field.name === data.name);
                      if (editId === field.id) {
                        setEditFormData(undefined);
                      }

                      if (index >= 0) {
                        updateFormDefinition([...formDefinition.slice(0, index), ...formDefinition.slice(index + 1)]);
                        setEditId("");
                      }
                    }
                  }}
                >
                                   Delete 
                </Button>
              </ButtonGroup>
            </div>
          </ListGroup.Item>
        );
      })}
    </ReactSortable>
  );
};

export default SortableContainer;

