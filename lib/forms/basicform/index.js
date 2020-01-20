import * as React from "react";
import { Form, Divider } from 'antd';
import BasicFormCss from './BasicForm.css';
import AppCard from "../../appcard";
import AppAlert from '../../appalert';
import PrimaryAction from "../primaryaction";
export default class BasicForm extends React.Component {
    render() {
        const { title, primaryActions = [], description, error, secondaryActions, iconName, success, info, warning } = this.props;
        return (React.createElement(AppCard, { title: title, description: description, iconName: iconName },
            React.createElement(Form, { layout: "vertical", className: BasicFormCss.form },
                error ? (React.createElement(AppAlert, { message: error, type: "error" })) : null,
                success ? (React.createElement(AppAlert, { message: success, type: "success" })) : null,
                info ? (React.createElement(AppAlert, { message: info, type: "info" })) : null,
                warning ? (React.createElement(AppAlert, { message: warning, type: "warning" })) : null,
                primaryActions.length > 0 ? React.createElement(Divider, null) : null,
                React.createElement(Form.Item, { className: BasicFormCss.primaryActions }, primaryActions.map((primaryAction, ix) => (React.createElement(PrimaryAction, Object.assign({}, primaryAction, { key: primaryAction.code ? primaryAction.code : ix }))))))));
    }
}
//# sourceMappingURL=index.js.map