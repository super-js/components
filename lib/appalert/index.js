import * as React from "react";
import { Alert } from "antd";
import AppAlertCss from "./AppAlert.css";
const AppAlert = (props) => {
    return React.createElement(Alert, { message: props.message, type: props.type, showIcon: true, className: AppAlertCss.appAlert });
};
export default AppAlert;
//# sourceMappingURL=index.js.map