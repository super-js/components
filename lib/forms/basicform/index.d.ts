import * as React from "react";
import { PrimaryActionProps } from "../primaryaction";
export interface BasicFormProps {
    title?: string;
    description?: string;
    iconName?: string;
    primaryActions?: PrimaryActionProps[];
    secondaryActions?: any[];
    error?: string;
    success?: string;
    info?: string;
    warning?: string;
}
export default class BasicForm extends React.Component<BasicFormProps, {}> {
    render(): JSX.Element;
}
