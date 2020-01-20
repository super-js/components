import * as React from "react";
import { Input, Icon } from "antd";

import textCss from "./Text.css";

const Text = props => {
    const {
        onChange, attribute, type, Component = Input, processing, ...rest
    } = props;

    return (
        <Component
            {...rest}
            prefix={processing ? <Icon type="loading" /> : null}
            className={textCss.text}
            id={attribute.name}
            onChange={ev => onChange(ev.target.value)}
        />
    );
};

Text.Password 	= props => <Text Component={Input.Password} addonBefore="##" {...props}/>;
Text.Email		= props => <Text Component={Input} addonBefore="@" {...props}/>;


export default Text;