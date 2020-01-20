import * as React from "react";
import { Button, Icon } from 'antd';
const PrimaryAction = (props) => {
    return (React.createElement(Button, { disabled: props.processing, type: "link", loading: props.processing, htmlType: props.isFormSubmit ? "submit" : "button", onClick: props.onClick },
        props.processing ? React.createElement(Icon, { type: "loading" }) : null,
        props.label));
};
export default PrimaryAction;
//# sourceMappingURL=index.js.map