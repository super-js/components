import * as React                           from "react";
import {Button, Icon}                       from 'antd';
import {ButtonType}                         from "antd/lib/button/button";

import PrimaryActionsCss from './PrimaryActions.css';


export interface PrimaryActionProps {
    code?           : string,
    label           : string,
    type?           : ButtonType,
    isFormSubmit?   : boolean,
    onClick?        : (event: React.SyntheticEvent) => void,
    iconName?       : string
}

export interface PrimaryActionsProps {
    primaryActions  : PrimaryActionProps[],
    submitting      : boolean
}

const PrimaryActions = (props: PrimaryActionsProps): JSX.Element => {
    return (
        <div className={PrimaryActionsCss.primaryActions}>
            {props.primaryActions.map((primaryAction) => (
                <Button
                    disabled={props.submitting}
                    type={primaryAction.type ? primaryAction.type : "primary"}
                    shape="round"
                    loading={primaryAction.isFormSubmit && props.submitting}
                    htmlType={primaryAction.isFormSubmit ? "submit" : "button"}
                    onClick={primaryAction.onClick}
                >
                    {primaryAction.iconName ? <Icon type={primaryAction.iconName} /> : null}
                    {primaryAction.label ? primaryAction.label.toUpperCase() : ""}
                </Button>
            ))}
        </div>
    );
};

export default PrimaryActions;