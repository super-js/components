import * as React from 'react';
import cx from 'classnames';
import { Card, Icon, Typography } from 'antd';
import appCardCss from './AppCard.css';
export var AppCardType;
(function (AppCardType) {
    AppCardType["default"] = "default";
    AppCardType["success"] = "success";
    AppCardType["error"] = "error";
    AppCardType["warning"] = "warning";
})(AppCardType || (AppCardType = {}));
const AppCardTitle = (props) => props.title ? (React.createElement("div", { className: appCardCss.appCardTitle },
    React.createElement("h4", { className: cx({
            [appCardCss.error]: props.type === AppCardType.error,
            [appCardCss.success]: props.type === AppCardType.success,
            [appCardCss.warning]: props.type === AppCardType.warning
        }) }, props.title))) : null;
const AppCardExtra = (props) => (React.createElement("div", { className: appCardCss.appCardExtra },
    props.description ? React.createElement(Typography.Text, { type: "secondary" }, props.description) : null,
    props.iconName ? React.createElement(Icon, { type: props.iconName }) : null));
const AppCard = (props) => {
    const { title, description, iconName, type, children, small, ...otherProps } = props;
    return (React.createElement(Card, { className: cx(appCardCss.appCard, {
            [appCardCss.small]: small,
            [appCardCss.appCardError]: props.type === AppCardType.error,
            [appCardCss.appCardSuccess]: props.type === AppCardType.success,
            [appCardCss.appCardWarning]: props.type === AppCardType.warning
        }), title: title ? React.createElement(AppCardTitle, { title: title, type: type }) : null, extra: iconName || description ? React.createElement(AppCardExtra, { iconName: iconName, description: description }) : null }, children));
};
export default AppCard;
//# sourceMappingURL=index.js.map