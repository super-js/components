import * as React   from "react";
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

    const afterClose                    = () => {
        clearTimeout(disappearInTimeout);
        setVisibility(false);
    };

    if(props.disappearIn) {
        disappearInTimeout = setTimeout(() => {
            setVisibility(false);
        }, props.disappearIn);
    }

    return isVisible ? (
        <Alert
            message={props.message}
            type={props.type}
            showIcon
            className={AppAlertCss.appAlert}
            closable
            banner
            afterClose={afterClose}
        />
    ) : null;
}

export default AppAlert;