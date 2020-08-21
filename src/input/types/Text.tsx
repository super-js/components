import * as React from "react";
import cx from "classnames";
import { Input } from "antd";

import TextCss from "./Text.css";

import {InputComponentProps} from "../index";
import {Icon} from "../../icon";

export interface TextProps extends InputComponentProps {
    isPassword?         : boolean;
    isEmail?            : boolean;
    isTextArea?         : boolean;
    isPhone?            : boolean;
}

const Text = (props: TextProps) => {
    const {onInput, onChange, hasError, value} = props;

    let InputComponent, addOnBefore;

    if(props.isPassword) {
        addOnBefore             = <Icon iconName="key-skeleton" />;
        InputComponent          = Input.Password;
    } else if(props.isTextArea) {
        InputComponent          = Input.TextArea;
    } else if(props.isEmail) {
        addOnBefore             = <Icon iconName="at" />;
    } else if(props.isPhone) {
        addOnBefore             = <Icon iconName="phone" />;
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

Text.Password 	= props => <Text isPassword{...props}/>;
Text.Email		= props => <Text isEmail {...props}/>;
Text.TextArea   = props => <Text isTextArea {...props}/>;
Text.Phone		= props => <Text isPhone {...props}/>;

export default Text;