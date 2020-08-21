import * as React from "react";

import PageGroup, {PageGroupProps} from "./PageGroup";
import {IPageRouteProps} from "./utils";

export interface CrudPagesProps extends PageGroupProps {
    rootPage?: React.ComponentElement<IPageRouteProps<any>, any>
}

export const CrudPages = (props: CrudPagesProps) => {

    const {rootPage, ...pageGroupProps} = props;

    return (
        <React.Fragment>
            {rootPage ? rootPage : null}
            <PageGroup{...pageGroupProps}/>
        </React.Fragment>
    )
};