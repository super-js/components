import * as React from "react";
import {RouteProps, SwitchProps} from "react-router-dom";

import {IPageRoute, PageRouteToComponentMapProps} from "./utils";

export interface PageGroupProps extends PageRouteToComponentMapProps {
    ReactRoute: React.ComponentClass<RouteProps>;
    ReactSwitch?: React.ComponentClass<SwitchProps>;
    routes: IPageRoute[];
    NotFound?: React.ComponentElement<any, any>;
}

export default class PageGroup extends React.Component<PageGroupProps, any>{

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidMount() {
        console.log(this.props)
    }

    render() {

        const {ReactRoute, ReactSwitch, routes, pageRouteToComponentMap, extraComponentProps = {}, NotFound} = this.props;

        const _renderRoutes = () => routes
            .filter(route => pageRouteToComponentMap[route.code])
            .map((route ) => {
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
                {NotFound ? NotFound : null}
            </ReactSwitch>
        ) : (
            <React.Fragment>
                {_renderRoutes()}
                {NotFound ? NotFound : null}
            </React.Fragment>
        )
    }
}