import * as React from "react";

import {Divider, Form} from 'antd';

import BasicFormCss from './BasicForm.css';
import AppCard, {AppCardType} from "../../appcard";
import AppAlert from '../../appalert';
import Actions, {PrimaryActionProps, SecondaryActionProps} from "../actions";

export interface BasicFormProps {
    title?              : string,
    description?        : string,
    iconName?           : string,
    primaryActions?     : PrimaryActionProps[],
    parameters?         : any[],
    secondaryActions?   : SecondaryActionProps[],
    error?              : string,
    success?            : string,
    info?               : string,
    warning?            : string,
}

export default class BasicForm extends React.Component<BasicFormProps, {}> {

    state       = {
        submitting : false
    };

    onSubmit    = ev => {
        ev.preventDefault();

        this.setState({
            submitting: true
        })
    };

    render() {

        const {
            title, primaryActions, description, error, secondaryActions, iconName, success, info, warning
        } = this.props;

        const {submitting} = this.state;

        return (
            <AppCard
                title={title}
                description={description}
                iconName={iconName}
            >
                <Form layout="vertical" className={BasicFormCss.form} onSubmit={this.onSubmit}>
                    {error ? (
                        <AppAlert message={error} type="error" />
                    ) : null}
                    {success ? (
                        <AppAlert message={success} type="success" />
                    ) : null}
                    {info ? (
                        <AppAlert message={info} type="info" />
                    ) : null}
                    {warning ? (
                        <AppAlert message={warning} type="warning" />
                    ) : null}
                    {primaryActions.length > 0 ? <Divider /> : null}
                    <Actions
                        primaryActions={primaryActions}
                        secondaryActions={secondaryActions}
                        submitting={submitting}
                    />
                </Form>
            </AppCard>
        )
    }
}