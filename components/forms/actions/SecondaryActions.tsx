import * as React                           from "react";

import SecondaryActionsCss from './SecondaryActions.css';

export interface SecondaryActionProps {
    label           : string
}

export interface SecondaryActionsProps {
    secondaryActions  : SecondaryActionProps[],
    submitting      : boolean
}

const SecondaryActions = (props: SecondaryActionsProps): JSX.Element => {
    return (
        <div className={SecondaryActionsCss.secondaryActions}>
            {props.secondaryActions
                .map((secondaryAction) => (
                    <a>{secondaryAction.label}</a>
                ))
            }
        </div>
    );
};

export default SecondaryActions;