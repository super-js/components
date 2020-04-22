import * as React from "react";
import cx                                                               from "classnames";
import { Input } from "antd";

import TextCss from "./Text.css";
import {InputComponentProps} from "../index";

export interface TextProps extends InputComponentProps {
    isPassword?         : boolean;
    isEmail?            : boolean;
    isTextArea?         : boolean;
}

const Text = (props: TextProps) => {
    const {onInput, onChange, hasError, value} = props;

    let InputComponent, addOnBefore;

    if(props.isPassword) {
        addOnBefore             = "#";
        InputComponent          = Input.Password;
    } else if(props.isTextArea) {
        InputComponent          = Input.TextArea;
    } else if(props.isEmail) {
        addOnBefore             = "@";
    }

    if(!InputComponent) InputComponent = Input;

    return <InputComponent
        allowClear
        addonBefore={addOnBefore}
        className={cx({
            [TextCss.error] : hasError
        })}
        onInput={ev => onInput(ev.target.value)}

        onBlur={onChange}
        value={value === "undefined" ? "" : value}
    />
};

Text.Password 	= props => <Text isPassword addonBefore="#" {...props}/>;
Text.Email		= props => <Text isEmail addonBefore="@" {...props}/>;
Text.TextArea   = props => <Text isTextArea {...props}/>;

export default Text;