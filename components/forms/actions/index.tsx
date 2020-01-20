import * as React from "react";

import PrimaryActions,      {PrimaryActionProps} from "./PrimaryActions";
import SecondaryActions,    {SecondaryActionProps} from "./SecondaryActions";

import ActionsCss from "./Actions.css";

export interface ActionsProps {
    primaryActions?     : PrimaryActionProps[],
    secondaryActions?   : SecondaryActionProps[],
    submitting          : boolean
}

const Actions = (props: ActionsProps): JSX.Element => {
    return props.primaryActions || props.secondaryActions ? (
        <div className={ActionsCss.actions}>
            {props.primaryActions ? <PrimaryActions primaryActions={props.primaryActions} submitting={props.submitting}/>        : null}
            {props.secondaryActions ? <SecondaryActions secondaryActions={props.secondaryActions} submitting={props.submitting}/>    : null}
        </div>
    ) : null;
};

export {PrimaryActionProps, SecondaryActionProps};
export default Actions;