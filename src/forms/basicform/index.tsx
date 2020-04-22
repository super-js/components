import * as React from "react";
import cx from "classnames";

import {Divider, Form} from 'antd';

import BasicFormCss from './BasicForm.css';
import AppCard from "../../appcard";
import AppAlert from '../../appalert';
import Actions, {IAction} from "../actions";
import Parameters, {
    IndexedParameters,
    IndexedParametersNoOrder,
    OnParametersChangeInfo,
    TParameterDefinition
} from "../parameters";
import {bulkValidate} from "../../../handlers/parameters/validator";

import InputTypes from '../../input';
import {IConfirmationResult, TOnConfirmation} from "../../appbutton";
import {IconName} from "../../icon";


export interface BasicFormProps {
    title?              : string,
    fullHeight?         : boolean,
    description?        : string,
    iconName?           : IconName,
    primaryActions?     : IAction[],
    parameters?         : TParameterDefinition,
    secondaryActions?   : IAction[],
    info?               : string,
    warning?            : string,
    onSubmit?           : (parameters: any) => Promise<any>;
    clearValuesAfterSubmit?: boolean;
    onExit?             : () => void;
}

export interface BasicFormState {
    submitting                  : boolean;
    hasErrors                   : boolean;
    indexedParameters           : IndexedParameters;
    updatedParametersStates     : IndexedParametersNoOrder;
    errors                      : string[];
    success                     : string;
}

class BasicForm extends React.Component<BasicFormProps, BasicFormState> {

    static CRUD: React.FunctionComponentFactory<any>;

    _unMounted = false;

    state       = {
        submitting                  : false,
        hasErrors                   : false,
        indexedParameters           : new Map(),
        updatedParametersStates     : {},
        errors                      : [],
        success                     : ""
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.submitting !== nextState.submitting
        || this.state.hasErrors !== nextState.hasErrors
        || this.state.updatedParametersStates !== nextState.updatedParametersStates
        || this.state.submitting !== nextState.submitting
        || this.state.errors !== nextState.errors
        || this.state.success !== nextState.success
        || this.props.title !== nextProps.title
    }

    componentWillUnmount() {
        this._unMounted = true;
    }

    onSubmit    = async ev => {
        ev.preventDefault();

        const {indexedParameters} = this.state;

        const indexedParametersObject   = Object.fromEntries(indexedParameters.entries());
        let parametersValues          = {}, success = "";

        const {
            hasErrors, validatedParameters
        } = await bulkValidate(Object.keys(indexedParametersObject).map(parameterCode => {

            const parameter = indexedParametersObject[parameterCode];
            parametersValues[parameterCode] = parameter.value;

            return {
                ...parameter,
                parameterType : InputTypes[parameter.type].parameterType
            }
        }));

        const readyToSubmit = !hasErrors && typeof this.props.onSubmit === "function";

        this.setState({
            hasErrors,
            updatedParametersStates : Object.keys(validatedParameters).reduce((_, parameterCode) => {
                _[parameterCode] = {
                    validationResult : validatedParameters[parameterCode]
                };
                return _;
            }, {}),
            submitting: readyToSubmit,
            errors: []
        });

        if(readyToSubmit) {

            let errors = [];

            try {
                success = await this.props.onSubmit(parametersValues);
            } catch(err) {
                errors = Array.isArray(err.validationErrors) && err.validationErrors.length > 0 ?
                    err.validationErrors : [err.message];
            } finally {

                if(!this._unMounted) {
                    let afterSubmitState = {submitting : false, errors, success};

                    if(this.props.clearValuesAfterSubmit
                        && errors.length === 0) {
                        let updatedParametersStates = {...indexedParametersObject};
                        Object.keys(updatedParametersStates)
                            .forEach(parameterCode => updatedParametersStates[parameterCode] = {value: ""});

                        afterSubmitState["updatedParametersStates"] = updatedParametersStates;
                    }

                    this.setState(afterSubmitState);
                }

            }

        }
    };

    onParametersChange = (parametersInfo: OnParametersChangeInfo) => {
        this.setState({
            indexedParameters   : parametersInfo.indexedParameters,
            hasErrors           : parametersInfo.hasErrors
        })
    };

    render() {

        const {
            title, primaryActions, description, secondaryActions, iconName, info, warning, parameters, fullHeight, onExit
        } = this.props;

        const {submitting, hasErrors, updatedParametersStates, errors, success} = this.state;

        return (
            <AppCard
                title={title}
                description={description}
                iconName={iconName}
                fullHeight={fullHeight}
                small
                onExit={onExit}
            >
                <Form layout="vertical" className={cx(BasicFormCss.form, {
                    [BasicFormCss.fullHeight] : fullHeight
                })} onSubmitCapture={this.onSubmit}>
                    {Array.isArray(errors) && errors.length > 0 ? (
                        errors.map(error => <AppAlert message={error} type="error" />)
                    ) : null}
                    {success ? (
                        <AppAlert message={success} type="success" />
                    ) : null}
                    {info ? (
                        <AppAlert message={info} type="info" />
                    ) : null}
                    {warning ? (
                        <AppAlert message={warning} type="warning" />
                    ) : null}
                    <div className={cx(BasicFormCss.parameters, {
                        [BasicFormCss.fullHeight] : fullHeight
                    })}>
                        <Parameters
                            definition={parameters}
                            onParametersChange={this.onParametersChange}
                            updatedParametersStates={updatedParametersStates}
                        />
                    </div>
                    {Array.isArray(primaryActions) && primaryActions.length > 0 ? <Divider /> : null}
                    <Actions
                        primaryActions={primaryActions}
                        secondaryActions={secondaryActions}
                        submitting={submitting}
                        hasErrors={hasErrors}
                    />
                </Form>
            </AppCard>
        )
    }
}

export interface BasicFormCrudProps extends BasicFormProps {
    onDelete?: () => Promise<void>;
    onCancel?: () => void;
    onDeleteConfirmation?: TOnConfirmation;
    onCancelConfirmation?: TOnConfirmation;
    onSaveConfirmation?: TOnConfirmation;
}

BasicForm.CRUD = (props: BasicFormCrudProps) => {

    const onDelete = () => {
        if(typeof props.onDelete === "function") {
            return  props.onDelete();
        }
    };

    const onCancel = () => {
        if(typeof props.onCancel === "function") {
            return props.onCancel();
        }
    };

    return (
        <BasicForm
            primaryActions={[
                {code: 'save', label: 'SAVE', isSubmit: true, iconName: "save", onConfirmation: props.onSaveConfirmation},
                {code: 'cancel', label: 'CANCEL', onClick: onCancel, onConfirmation: props.onCancelConfirmation}
            ]}
            secondaryActions={[
                {code: 'delete', iconName: "trash", onClick: onDelete, onConfirmation: props.onDeleteConfirmation}
            ]}
            {...props}
        />
    );
};

export default BasicForm;