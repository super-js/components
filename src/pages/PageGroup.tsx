import * as React from "react";
import {Skeleton} from "antd";
import {RouteProps, SwitchProps} from "react-router-dom";
import {History, Location} from "history";

import {IPageRoute, PageRouteToComponentMapProps} from "./utils";


export interface PageGroupProps extends PageRouteToComponentMapProps {
    redirectToFirstOn?: string[];
    ReactRoute: React.ComponentClass<RouteProps>;
    ReactSwitch?: React.ComponentClass<SwitchProps>;
    routes: IPageRoute[];
    history?: History;
    NotFound?: React.ComponentElement<any, any>;
    loading?: boolean;
}

export default class PageGroup extends React.Component<PageGroupProps, any>{

    _removeLocationListener = null;

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.loading !== this.props.loading
        || nextProps.pageData !== this.props.pageData;
    }

    componentDidMount() {

        const {history, redirectToFirstOn, routes} = this.props;

        if(history && Array.isArray(redirectToFirstOn) && redirectToFirstOn.length > 0 && routes.length > 0) {
            this._removeLocationListener = history.listen(this._redirectToFirstOn.bind(this));
            this._redirectToFirstOn(history.location);
        }
    }

    componentWillUnmount() {
        if(typeof this._removeLocationListener === "function") this._removeLocationListener();
    }

    _redirectToFirstOn(location: Location) {
        const {history, redirectToFirstOn, routes} = this.props;
        if(redirectToFirstOn.indexOf(location.pathname) > -1) {
            history.push(typeof routes[0].to === "function" ? routes[0].to() : routes[0].to);
        }
    }

    render() {
        const {
            ReactRoute, ReactSwitch, routes, pageRouteToComponentMap, pageData = {}, NotFound, loading
        } = this.props;

        const _renderRoutes = () => routes
            .filter(route => pageRouteToComponentMap[route.code])
            .map((route ) => {
                const ReactComponent = pageRouteToComponentMap[route.code];
                return (
                    <ReactRoute
                        key={route.path}
                        exact={route.exact}
                        path={route.path}
                        render={routeProps => (
                            <ReactComponent
                                currentRoute={route}
                                routes={route.children}
                                {...routeProps}
                                pageData={pageData}
                            />
                        )}
                    />
                )
            });

        if(loading) return <Skeleton active paragraph={{rows: 10}}/>;

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