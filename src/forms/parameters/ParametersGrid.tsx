import {Col, Row} from "antd";
import * as React from "react";

import Parameter, {OnParameterValidationChange} from "./Parameter";
import {IndexedParameters} from "./index";

import ParametersGridCss       from "./ParametersGridCss.css";

export interface IColumn {
    parameterCode?  : string;
}

export interface IRow {
    columns     : IColumn[]
}

export interface ParametersGridProps {
    rows?                           : IRow[];
    indexedParameters               : IndexedParameters;
    onParameterValidationChange?    : OnParameterValidationChange
}

const ParametersGrid    = (props: ParametersGridProps) => {

    const _renderParameter = parameter => (
        <Parameter
            key={parameter.code}
            onValidationChange={props.onParameterValidationChange}
            {...parameter}
        />
    );

    return Array.isArray(props.rows) && props.rows.length > 0 ? (
        <div>
            {props.rows.map((row, rowIx) => (
                <Row key={rowIx} justify="start" align="top" gutter={12}>
                    {row.columns.map((col, ix) => (
                        <Col key={ix} span={24 / row.columns.length}>
                            {props.indexedParameters.has(col.parameterCode) ?
                                _renderParameter(props.indexedParameters.get(col.parameterCode)) : null}
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    ) : (
        <div>
            {Array.from(props.indexedParameters.values()).map(parameter => _renderParameter(parameter))}
        </div>
    );
};

export default ParametersGrid;