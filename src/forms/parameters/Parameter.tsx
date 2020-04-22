import InputTypes, {IInputBasicProps}        from "../../input";
import * as React                           from "react";

import ParameterCss       from "./ParameterCss.css";
import {ParametersContext} from "./index";
import {ValidationResult} from "../../../handlers/parameters/validator";

export type OnParameterValidationChange = (parameterCode: string, validationResult: ValidationResult) => void;

export interface IParameterComponent extends IInputBasicProps {
    code                : string
}

export interface ParameterProps extends IParameterComponent {
    onValidationChange? : OnParameterValidationChange
}

function Parameter(props: ParameterProps) {

    const {code, onValidationChange, ...inputProps} = props;

    const parametersContext = React.useContext(ParametersContext);

    const InputComponent    = InputTypes.hasOwnProperty(props.type) ?
        InputTypes[props.type] : InputTypes.text;

    const _onValidationChange = validationResult => {
        parametersContext.onParameterValidationChange(code, validationResult);

        if(typeof onValidationChange === "function") {
            onValidationChange(props.code, validationResult);
        }
    };

    return <InputComponent
        onInput={value => parametersContext.onParameterValueInput(code, value)}
        onValidationChange={_onValidationChange}
        otherParameters={Object.fromEntries(parametersContext.indexedParameters)}
        {...inputProps}
    />;

}

export default Parameter;