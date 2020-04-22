import * as React from "react";
import cx from "classnames";
import {Divider, Typography} from "antd";

import ParametersGrid, {IRow} from "./ParametersGrid";
import {IndexedParameters} from "./index";

import ParametersGroupCss from "./ParametersGroups.css";
import {ValidationResult, ValidationStatus} from "../../../handlers/parameters/validator";
import {IParameterComponent} from "./Parameter";
import Icon from "../../icon";

export interface IGroup extends IParametersGroupTitle {
    rows?           : IRow[];
    parameters      : IParameterComponent[];
}

export interface ParametersGroupsProps {
    groups                          : IGroup[],
    indexedParameters               : IndexedParameters
}

export interface ParametersGroupProps {
    rows?                           : IRow[];
    indexedParameters               : IndexedParameters;
    title                           : IParametersGroupTitle
}

export interface ParametersGroupTitle extends IParametersGroupTitle {
    toggleCollapsed?                : () => void;
    hasError                        : boolean;
}

export interface IParametersGroupTitle {
    label?                          : string;
    isCollapsed?                    : boolean;
    helpText?                       : string;
}

const ParametersGroupTitle   = (props: ParametersGroupTitle) => props.label ? (
    <div className={cx(ParametersGroupCss.groupTitle, {
        [ParametersGroupCss.error] : props.hasError
    })} onClick={props.toggleCollapsed}>
        <div className={ParametersGroupCss.groupHeading}>
            <Icon iconName="caret-down" className={cx({
                [ParametersGroupCss.collapsed] : props.isCollapsed
            })} />
            <Typography.Title level={4}>
                {props.label}
            </Typography.Title>
        </div>
        <div>
            {props.hasError ? (
                <Icon iconName="times-circle" />
            ) : null}
            {/*<div>{props.helpText}</div>*/}
        </div>
    </div>
) : null;

function ParametersGroup(props: ParametersGroupProps) {

    const {title = {}} = props;

    const [isCollapsed, setIsCollapsed]              = React.useState(!!title.isCollapsed);
    const [errorParameterCodes, setErrors]           = React.useState([]);

    const toggleCollapsed = () => setIsCollapsed(!isCollapsed);

    const onParameterValidationChange = (parameterCode: string, validationResult: ValidationResult) => {
        const errorForParameterCodeIndex = errorParameterCodes.indexOf(parameterCode);

        if(validationResult.validateStatus === ValidationStatus.error
        && errorForParameterCodeIndex < 0) {
            setErrors([
                ...errorParameterCodes,
                parameterCode
            ]);
        } else if(validationResult.validateStatus !== ValidationStatus.error
        && errorForParameterCodeIndex > -1) {
            setErrors(errorParameterCodes.splice(errorForParameterCodeIndex, errorForParameterCodeIndex));
        }
    };

    return (
        <div className={ParametersGroupCss.group}>
            <ParametersGroupTitle
                {...title}
                toggleCollapsed={toggleCollapsed}
                hasError={errorParameterCodes.length > 0}
                isCollapsed={isCollapsed}
            />
            <Divider className={ParametersGroupCss.groupTitleDivider} />
            <div className={cx({
                [ParametersGroupCss.collapsed] : isCollapsed
            })}>
                <ParametersGrid
                    indexedParameters={props.indexedParameters}
                    rows={props.rows}
                    onParameterValidationChange={onParameterValidationChange}
                />
            </div>
        </div>
    )
}

const ParametersGroups = (props: ParametersGroupsProps) => (
    <React.Fragment>
        {props.groups.map((group, ix) => (
            <ParametersGroup
                key={ix}
                rows={group.rows}
                indexedParameters={props.indexedParameters}
                title={{
                    label                           : group.label,
                    isCollapsed                     : group.isCollapsed,
                    helpText                        : group.helpText
                }}
            />
        ))}
    </React.Fragment>
);


export default ParametersGroups;