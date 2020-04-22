import * as React               from "react";
import cx                       from "classnames";
import {Select, Icon }                from 'antd';
import SelectCss                from "./Select.css";
import {InputComponentProps}    from "../index";


export interface SelectProps extends InputComponentProps {
    multiple?   : boolean;
}

const NoOptionsFound = () => (
    <div className={SelectCss.notFound}>
        <Icon type="frown" />
        <div>No more options available or not matching your search criteria.</div>
    </div>
);

function InputSelect(props: SelectProps) {

    const {onInput, onChange, validValues = [], value, multiple} = props;

    let _filteredValidValues;

    if(multiple) {
        if(Array.isArray(value)
        && value.length > 0) {
            _filteredValidValues = validValues.filter(validValue =>
                !value.some(v => v === validValue.value)
            );
        }
    }

    if(!_filteredValidValues) _filteredValidValues = validValues;

    return (
        <Select
            mode={multiple ? "multiple" : "default"}
            allowClear
            showSearch
            onChange={async value => {
                await onInput(value);
                onChange();
            }}
            value={value}
            className={SelectCss.select}
            notFoundContent={<NoOptionsFound />}
        >
            {_filteredValidValues.map(validValue => (
                <Select.Option
                    className={SelectCss.option}
                    key={validValue.value}
                    value={validValue.value}>
                    {validValue.label ? validValue.label : validValue.value}
                </Select.Option>
            ))}
        </Select>
    )
};

InputSelect.Multiple   = props => <InputSelect multiple {...props}/>;

export default InputSelect;