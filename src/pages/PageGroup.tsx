import * as React from "react";
import {RouteProps, SwitchProps} from "react-router-dom";

import {IPageRoute, PageRouteToComponentMapProps} from "./utils";

export interface PageGroupProps extends PageRouteToComponentMapProps {
    ReactRoute: React.ComponentClass<RouteProps>;
    ReactSwitch?: React.ComponentClass<SwitchProps>;
    routes: IPageRoute[];
}

export default class PageGroup extends React.Component<PageGroupProps, any>{

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {

        const {ReactRoute, ReactSwitch, routes, pageRouteToComponentMap, extraComponentProps = {}} = this.props;

        const _renderRoutes = () => routes
            .filter(route => pageRouteToComponentMap[route.code])
            .map(route => {
                const ReactComponent = pageRouteToComponentMap[route.code];
                return (
                    <ReactRoute
                        key={route.path}
                        exact={route.exact}
                        path={route.path}
                        render={routeProps => <ReactComponent currentRoute={route} routes={route.children} {...routeProps} {...extraComponentProps} />}
                    />
                )
            });

        return ReactSwitch ? (
            <ReactSwitch>
                {_renderRoutes()}
            </ReactSwitch>
        ) : (
            <React.Fragment>
                {_renderRoutes()}
            </React.Fragment>
        )
    }
}