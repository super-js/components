import * as React from "react";
export interface PrimaryActionProps {
    code?: string;
    label: string;
    type?: "default" | "primary" | "warning" | "danger" | "info";
    processing?: boolean;
    isFormSubmit?: boolean;
    onClick?: (event: React.SyntheticEvent) => void;
}
declare const PrimaryAction: (props: PrimaryActionProps) => JSX.Element;
export default PrimaryAction;
