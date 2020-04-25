import * as React from "react";
import {IParameterType, parameterTypes, IParameter, validator} from "../handlers/parameters";

import {Typography} from "antd";

import InputCss from "./Input.css";

import Text             from './types/Text';
import Number           from './types/Number';
import InputRadio       from './types/Radio';
import InputSelect      from './types/Select';
import InputRate        from './types/Rate';
import DateTime         from './types/DateTime';
import File             from './types/file';

import {ValidationResult, ValidationStatus} from "../handlers/parameters/validator";
import {Icon} from "../icon";

export enum EInputTypes {
    text                    = "text",
    email                   = "email",
    password                = "password",
    number                  = "number",
    money                   = "money",
    percentage              = "percentage",
    textArea                = "textArea",
    radio                   = "radio",
    singleSelect            = "singleSelect",
    multipleSelect          = "multipleSelect",
    rate                    = "rate",
    datePicker              = "datePicker",
    dateTimePicker          = "dateTimePicker",
    dateRangePicker         = "dateRangePicker",
    dateTimeRangePicker     = "dateTimeRangePicker",
    file                    = "file"
}

export interface IInputValidValue {
    label?      : string;
    value       : any;
}

export type InputValidValues            = IInputValidValue[];

export interface IInputClass<P, S> extends React.ComponentClass<P, S> {
    parameterType: IParameterType
}

export type IInputTypes = {[name in keyof typeof EInputTypes]: IInputClass<InputProps, InputState>};

export interface IInputBasicProps extends Omit<IParameter, 'code' | 'parameterType'> {
    label?              : string;
    type                : EInputTypes;
    readOnly?           : boolean;
    validValues?        : InputValidValues;
    validationResult?   : ValidationResult;
}

export interface InputProps extends IInputBasicProps {
    onInput                         : (value: any) => void;
    onValidationChange?             : (validationResult: ValidationResult) => void;
    otherParameters?                : validator.IOtherParameters;
}

export interface InputState {
    value			    : any;
    validationResult    : ValidationResult
}


export interface InputComponentProps {
    onInput         : (value: any) => void;
    onChange        : (ev?: React.SyntheticEvent) => void;
    hasError        : boolean;
    value           : any;
    readOnly?       : boolean;
    validValues?    : InputValidValues;
}

const InputHOC = (parameterType: IParameterType, Component: React.FunctionComponent<InputComponentProps>) => {
    return class Input extends React.Component<InputProps, InputState> {

        static parameterType    = parameterType;

        state = {
            value               : this.props.value ? this.props.value : "",
            validationResult    : this.props.validationResult ? this.props.validationResult : {
                validateStatus  : ValidationStatus.ok,
                help            : []
            }
        };

        validationTimeout = null;

        shouldComponentUpdate(nextProps, nextState) {
            return this.state.value !== nextState.value
                || (nextProps.value != undefined && nextProps.value !== this.state.value && nextProps.value !== this.props.value)
                || this.state.validationResult !== nextState.validationResult
                || (
                    !!nextProps.validationResult
                    && nextProps.validationResult.validateStatus !== this.state.validationResult.validateStatus
                    && nextState.validationResult.validateStatus === this.state.validationResult.validateStatus
                )
        }

        componentWillUnmount() {
            clearTimeout(this.validationTimeout);
        }

        componentDidUpdate(prevProps, prevState) {

            let newState = {};

            if(this.props.validationResult
            && this.props.validationResult.validateStatus !== this.state.validationResult.validateStatus
            && this.state.validationResult.validateStatus === prevState.validationResult.validateStatus) {
                newState["validationResult"] = this.props.validationResult;
            }



            if(this.props.value != undefined && this.props.value !== this.state.value && this.props.value !== prevProps.value) {
                newState["value"] = this.props.value;
            }

            if(Object.keys(newState).length > 0) this.setState(newState);
        }

        onInput     = (value: any) => {
            this.setState({
                value
            }, () => {
                this.props.onInput(value);
                this._validate()
            });
        };

        onChange   = () => {};

        _validate = () => {
            clearTimeout(this.validationTimeout);

            this.validationTimeout = setTimeout(async () => {
                const validationResult = await Input.parameterType.validate({
                    isRequired      : this.props.isRequired,
                    skipValidation  : this.props.skipValidation,
                    value           : this.state.value,
                    customValidator : this.props.customValidator
                }, this.props.otherParameters ? this.props.otherParameters : {});

                if(validationResult.validateStatus !== this.state.validationResult.validateStatus
                    && typeof this.props.onValidationChange === "function") {
                    this.props.onValidationChange(validationResult);
                }

                this.setState({
                    validationResult
                });

            }, 500);

        };

        render() {

            const {onValidationChange, onInput, ...inputComponentProps} = this.props;
            const {validationResult, value}                        = this.state;

            const hasError      = validationResult.validateStatus === ValidationStatus.error;

            return (
                <div className={InputCss.input}>
                    {inputComponentProps.label ? <Typography.Text type={hasError ? "danger" : "secondary"} className={InputCss.label}>{inputComponentProps.label}</Typography.Text> : null}
                    <Component
                        onInput={this.onInput}
                        onChange={this.onChange}
                        hasError={hasError}
                        {...inputComponentProps}
                        value={value}
                    />
                    {hasError ? (
                        <ul className={InputCss.helpList}>
                            {validationResult.help.map(helpText => (
                                <li key={helpText}>
                                    <Typography.Text type="danger">
                                        <Icon iconName="times-circle" danger/>
                                        <i>{helpText}</i>
                                    </Typography.Text>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            )
        }

    };
};

const InputTypes: IInputTypes = {
    text                        : InputHOC(parameterTypes.text()        , Text),
    email                       : InputHOC(parameterTypes.email()       , Text.Email),
    password                    : InputHOC(parameterTypes.password()    , Text.Password),
    number                      : InputHOC(parameterTypes.number()      , Number),
    money                       : InputHOC(parameterTypes.number()      , Number.Money),
    percentage                  : InputHOC(parameterTypes.number()      , Number.Percentage),
    textArea                    : InputHOC(parameterTypes.text()        , Text.TextArea),
    radio                       : InputHOC(parameterTypes.text()        , InputRadio),
    singleSelect                : InputHOC(parameterTypes.text()        , InputSelect),
    multipleSelect              : InputHOC(parameterTypes.array()       , InputSelect.Multiple),
    rate                        : InputHOC(parameterTypes.number()      , InputRate),
    datePicker                  : InputHOC(parameterTypes.text()        , DateTime.DatePicker),
    dateTimePicker              : InputHOC(parameterTypes.text()        , DateTime.DateTimePicker),
    dateRangePicker             : InputHOC(parameterTypes.array({nonEmpty: true})       , DateTime.DateRangePicker),
    dateTimeRangePicker         : InputHOC(parameterTypes.array({nonEmpty: true})       , DateTime.DateTimeRangePicker),
    file                        : InputHOC(parameterTypes.file()        , File),
};

export default InputTypes;