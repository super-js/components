import * as React from "react";
import {Location} from "history";
import {RouteComponentProps} from "react-router-dom";
import {IconName} from "@fortawesome/fontawesome-svg-core";

import {IBreadcrumbItem, PageWrapperContext, PageWrapperProps} from "./PageWrapper";

type TRouteResolver = () => string;

export interface IPageRoute {
    code: string;
    path: string;
    exact?: boolean;
    label?: string | TRouteResolver;
    to?: string | TRouteResolver;
    isNavigationEntry?: boolean;
    iconName?: IconName;
    children: IPageRoute[];
}

export interface IPageRouteProps<P> extends RouteComponentProps<P> {
    currentRoute: IPageRoute;
    routes: IPageRoute[];
}

export interface IPageRouteToComponentMap {
    [routeCode: string] : React.ComponentClass<IPageRouteProps<any>> | React.FunctionComponent<IPageRouteProps<any>>;
}

export interface PageRouteToComponentMapProps {
    pageRouteToComponentMap: IPageRouteToComponentMap;
    extraComponentProps?: Object;
}

const setDefaultBreadcrumbs = (breadcrumbItems: IBreadcrumbItem[]) => {

    const {onContextDataChange} = React.useContext(PageWrapperContext);
    React.useEffect(() => {
        onContextDataChange({
            breadcrumbItems
        });
    }, []);
};


export interface IGetBreadcrumbsSetter {
    currentPathName?: string;
    defaultPathName?: string | string[];
    defaultBreadcrumbs?: IBreadcrumbItem[];
}
const getBreadcrumbsSetter = (options: IGetBreadcrumbsSetter = {}) => {

    const {defaultBreadcrumbs, defaultPathName, currentPathName} = options;

    const {onContextDataChange} = React.useContext(PageWrapperContext);
    const defaultTo = () =>             onContextDataChange({
        breadcrumbItems: defaultBreadcrumbs
    });

    if(defaultBreadcrumbs && Array.isArray(defaultBreadcrumbs)) {
        // React.useEffect(() => {
        //     defaultTo();
        // }, []);

        React.useEffect(() => {
            if(defaultPathName === currentPathName) {
                defaultTo();
            }
        }, [currentPathName])
    }

    return (breadcrumbItems: IBreadcrumbItem[]) => onContextDataChange({
        breadcrumbItems
    });
};


export interface IPageDataLoader {
    location: Location;
    loader: () => Promise<any>;
    loadOnlyOnce?: boolean;
    reloadPathname?: string | string[];
}
const usePageDataLoader = (options: IPageDataLoader) => {

    const {
        location, loader, loadOnlyOnce, reloadPathname
    } = options;

    const reloadPathnames = Array.isArray(reloadPathname) ? reloadPathname : [reloadPathname];

    const [pageData, setPageData] = React.useState([]);
    const [loadingPageData, setPageLoading] = React.useState(true);
    const [isFirstLoad, setIsFirstLoad] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            if(reloadPathnames.indexOf(location.pathname) > -1 || loadOnlyOnce || isFirstLoad) {

                setPageLoading(true);

                const _pageData = await loader();

                setPageData(_pageData);
                setPageLoading(false);
                setIsFirstLoad(false);
            }
        })();
    }, loadOnlyOnce ? [] : [location.pathname]);

    return {
        pageData, loadingPageData
    }
};

export const useCurrentSiteMapCode = () => {
    const {currentSiteMapCodes} = React.useContext(PageWrapperContext);
    return currentSiteMapCodes;
}

export {
    setDefaultBreadcrumbs, getBreadcrumbsSetter, usePageDataLoader
}