import * as React   from "react";
import * as ReactDOM     from "react-dom";

import {Alert}      from "antd";
import AppAlertCss  from "./AppAlert.css";

export interface AppAlertProps {
    message             : string,
    type                : 'success' | 'info' | 'warning' | 'error',
    disappearIn?        : number
}

function AppAlert(props: AppAlertProps): JSX.Element {

    const [isVisible, setVisibility]    = React.useState(true);
    let disappearInTimeout              = null;

    const hide = () => {
        setVisibility(false);
    };

    const afterClose                    = () => {
        clearTimeout(disappearInTimeout);
        hide();
    };

    if(props.disappearIn) {
        disappearInTimeout = setTimeout(() => {
            hide();
        }, props.disappearIn);
    }

    return (
        <div>
            {isVisible ? (
                <Alert
                    message={props.message}
                    type={props.type}
                    showIcon
                    className={AppAlertCss.appAlert}
                    banner
                    afterClose={afterClose}
                />
            ) : null}
        </div>
    );
}

export default AppAlert;