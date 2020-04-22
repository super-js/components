import * as React from "react";

export interface MainContentProps {
    children?       : JSX.Element | JSX.Element[] | string
}

function MainContent(props: MainContentProps) {
    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
}
export default MainContent;