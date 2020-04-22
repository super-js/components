import * as React from "react";
import { Skeleton } from 'antd';
import {cloneDeep} from "lodash";

import ParametersGroups, {IGroup} from "./ParametersGroups";
import ParametersGrid from "./ParametersGrid";

import {ValidationResult, ValidationStatus} from "../../../handlers/parameters/validator";
import {IParameterComponent} from "./Parameter";

export enum OnParametersChangeEventCode {
    PARAMS_VALUE_INPUT          = "PARAM_VALUE_INPUT",
    PARAMS_INIT                 = "PARAMS_INIT",
    PARAMS_VALIDATION_CHANGE    = "PARAMS_VALIDATION_CHANGE"
}

export type IndexedParametersNoOrder        = {[code: string] : Partial<IParameterComponent>};
export type IndexedParameters               = Map<string, IParameterComponent>;

export interface OnParametersChangeInfo {
    eventCode           : OnParametersChangeEventCode;
    indexedParameters   : IndexedParameters;
    hasErrors           : boolean;
}
export type OnParametersChange      = (parametersChangeInfo: OnParametersChangeInfo) => void;
export type ParametersDefinition    = IGroup[] | IGroup;
export type TParameterDefinition    = ParametersDefinition | (() => Promise<ParametersDefinition>);

export interface ParametersProps {
    definition?                 : TParameterDefinition,
    onParametersChange?         : OnParametersChange,
    updatedParametersStates?    : IndexedParametersNoOrder;
}

export enum ParametersDefinitionStyle {
    groups  = "groups",
    grid    = "grid",
    none    = "none"
}
export interface ParametersState {
    definitionStyle     : ParametersDefinitionStyle;
    indexedParameters   : IndexedParameters;
    definition          : ParametersDefinition;
    loadingDefinition   : boolean;
    error               : string;
}

const ParametersContext    = React.createContext({
    onParameterValueInput           : (parameterCode: string, value             : any)              => null,
    onParameterValidationChange     : (parameterCode: string, validationResult  : ValidationResult) => null,
    indexedParameters               : new Map()
});

export default class Parameters extends React.Component<ParametersProps, ParametersState> {

    onParameterValueInputTimeout = null;

    state = {
        loadingDefinition       : typeof this.props.definition === "function",
        definition              : typeof this.props.definition === "function" ? null : this.props.definition,
        definitionStyle         : ParametersDefinitionStyle.none,
        indexedParameters       : new Map(),
        error                   : ""
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.definitionStyle !== nextState.definitionStyle
        || this.state.indexedParameters !== nextState.indexedParameters
        || this.props.updatedParametersStates !== nextProps.updatedParametersStates
        || this.state.loadingDefinition !== nextState.loadingDefinition
    }

    _getIndexedParameters = (parameters: IParameterComponent[]) => {

        const {indexedParameters}               = this.state;
        const {updatedParametersStates = {}}    = this.props;

        return new Map(parameters.map(parameter => ([
            parameter.code, {
                ...cloneDeep(parameter),
                ...(indexedParameters.has(parameter.code) ? indexedParameters.get(parameter.code) : {}),
                ...(updatedParametersStates[parameter.code] ? updatedParametersStates[parameter.code] : {})
            }
        ])));
    };

    async componentDidMount() {
        if(typeof this.props.definition === "function") {
            try {
                const definition = await this.props.definition();

                this.setState({
                    definition,
                    loadingDefinition : false
                }, () => {
                    this._updateParameters();
                })
            } catch(err) {
                console.log(err);
                this.setState({
                    error: err.message,
                    loadingDefinition : false
                })
            }
        } else {
            this._updateParameters();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.updatedParametersStates !== prevProps.updatedParametersStates) {
            this._updateParameters();
        }
    }

    _updateParameters = async () => {
        await this._setDefinitionStyle();
        this._onParametersChange(OnParametersChangeEventCode.PARAMS_VALUE_INPUT);
    };

    _setDefinitionStyle = () => {
        return new Promise((resolve, reject) => {
            const {definition} = this.state;

            let definitionStyle = ParametersDefinitionStyle.none;
            let parameters = [];

            if(Array.isArray(definition) && definition.length > 0) {
                definitionStyle = ParametersDefinitionStyle.groups;

                parameters = definition
                    .filter(group => Array.isArray(group.parameters) && group.parameters.length > 0)
                    .reduce((_, group) => {
                        _.push(...group.parameters);
                        return _;
                    }, []);

            } else if (definition && !Array.isArray(definition) && definition.parameters.length > 0) {

                definitionStyle = ParametersDefinitionStyle.grid;
                parameters      = definition.parameters;

            }

            this.setState({
                definitionStyle,
                indexedParameters : this._getIndexedParameters(parameters)
            }, () => resolve());
        })
    };

    _onParametersChange     = (eventCode: OnParametersChangeEventCode) => {
        if(typeof this.props.onParametersChange === "function") {
            const clonedParameters = new Map(this.state.indexedParameters);

            this.props.onParametersChange({
                eventCode           : eventCode,
                indexedParameters   : clonedParameters,
                hasErrors           : Array.from(clonedParameters.values())
                    .some(param => param.validationResult
                        && param.validationResult.validateStatus === ValidationStatus.error)
            });
        }
    };

    onParameterValueInput   = (parameterCode, value) => {
        const {indexedParameters} = this.state;
        if(indexedParameters.has(parameterCode)) {
            indexedParameters.get(parameterCode).value = value;

            clearTimeout(this.onParameterValueInputTimeout);
            this.onParameterValueInputTimeout = setTimeout(() => {
                this._onParametersChange(OnParametersChangeEventCode.PARAMS_VALUE_INPUT);
            }, 500);

        }
    };

    onParameterValidationChange  = (parameterCode: string, validationResult: ValidationResult) => {
        const {indexedParameters} = this.state;
        if(indexedParameters.has(parameterCode)) {
            indexedParameters.get(parameterCode).validationResult = validationResult;
            this._onParametersChange(OnParametersChangeEventCode.PARAMS_VALIDATION_CHANGE);
        }
    };

    render() {

        const {definitionStyle, indexedParameters, loadingDefinition, definition} = this.state;

        const _renderContent = () => {
            if(definitionStyle === ParametersDefinitionStyle.groups) {
                return <ParametersGroups
                    groups={(definition as IGroup[])}
                    indexedParameters={indexedParameters}
                />
            } else if(definitionStyle === ParametersDefinitionStyle.grid) {
                return <ParametersGrid
                    indexedParameters={indexedParameters}
                    rows={(definition as IGroup).rows}
                />
            } else {
                return null;
            }
        };

        return loadingDefinition ? (
            <Skeleton active />
        ) : (
            <ParametersContext.Provider value={{
                onParameterValueInput           : this.onParameterValueInput,
                onParameterValidationChange     : this.onParameterValidationChange,
                indexedParameters               : this.state.indexedParameters
            }}>
                {_renderContent()}
            </ParametersContext.Provider>
        )

    }
}

export {
    ParametersContext
}