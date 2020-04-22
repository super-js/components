import * as React from "react";
import {RouteProps} from "react-router-dom";
import {History} from "history";

export interface IBreadcrumbsRoute {
    code: string;
    path: string;
    label: string;
    to: string;
    exact?: boolean;
    children        : IBreadcrumbsRoute[];
}

export interface BreadcrumbsProps {
    ReactRoute      : React.ComponentClass<RouteProps>;
    routes          : IBreadcrumbsRoute[];
    history         : History;
}

export interface BreadcrumbProps {
    ReactRoute      : React.ComponentClass<RouteProps>;
    routes          : IBreadcrumbsRoute[];
    history         : History;
}


const Breadcrumb = (props: BreadcrumbProps) => {

    const {routes, ...rest} = props;

    const onClick = to => rest.history.push(to);

    return (
        <React.Fragment>
            {routes.map(route => (
                <rest.ReactRoute key={route.code} exact={route.exact} path={route.path}>
                    <a onClick={() => onClick(route.to)}>
                        {route.label}
                    </a>
                    {route.children.length > 0 ? <Breadcrumb {...rest} routes={route.children} /> : null}
                </rest.ReactRoute>
            ))}
        </React.Fragment>
    )
};

export default (props: BreadcrumbsProps) => {

    const {routes, ...rest} = props;

    return (
        <div>
            <Breadcrumb {...rest} routes={routes} />
        </div>
    );
};