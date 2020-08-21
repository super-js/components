import * as React from "react";
import {Location} from "history";
import {RouteComponentProps} from "react-router-dom";
import {IconName} from "@fortawesome/fontawesome-svg-core";

import {IBreadcrumbItem, PageWrapperContext} from "./PageWrapper";

type TRouteResolver = (record?: any) => string;

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

export interface IPageRouteProps<P, D = any> extends RouteComponentProps<P> {
    currentRoute: IPageRoute;
    pageData: D;
    routes: IPageRoute[];
}

export interface IPageRouteToComponentMap {
    [routeCode: string] : React.ComponentClass<IPageRouteProps<any, any>> | React.FunctionComponent<IPageRouteProps<any, any>>;
}

export interface PageRouteToComponentMapProps {
    pageRouteToComponentMap: IPageRouteToComponentMap;
    actionRouteToComponentMap?: IPageRouteToComponentMap;
    pageData?: any;
}

export const addBreadcrumbItems = (breadcrumbItems: IBreadcrumbItem[]) => {

    const {addBreadcrumbItems, removeBreadcrumbItems} = React.useContext(PageWrapperContext);

    if(typeof addBreadcrumbItems === "function" && typeof removeBreadcrumbItems === "function") {

        const willMount = React.useRef(true);
        if (willMount.current) {
            addBreadcrumbItems(breadcrumbItems)
            willMount.current = false;
        }

        React.useEffect(() => () => {
            removeBreadcrumbItems(breadcrumbItems)
        }, []);
    }
};

export const getAddBreadcrumbItems = () => {

    const {addBreadcrumbItems, removeBreadcrumbItems} = React.useContext(PageWrapperContext);

    if(typeof addBreadcrumbItems === "function" && typeof removeBreadcrumbItems === "function") {

        const willMount = React.useRef(null);

        React.useEffect(() => {
            return () => removeBreadcrumbItems(willMount.current);
        }, []);

        return (breadcrumbItems: IBreadcrumbItem[]) => {
            if (!Array.isArray(willMount.current)) {
                addBreadcrumbItems(breadcrumbItems);
                willMount.current = breadcrumbItems;
            }
        }
    } else {
        return () => null;
    }


}


export interface IPageDataLoader {
    location?: Location;
    loader: () => Promise<any>;
    reloadPathname?: string | string[];
    afterLoaded?: (pageData) => void;
}
export const usePageDataLoader = <T extends any>(options: IPageDataLoader): {pageData: T; loadingPageData: boolean} => {

    const {location, loader, reloadPathname} = options;

    const reloadPathnames = Array.isArray(reloadPathname) ? reloadPathname : [reloadPathname];

    const [pageData, setPageData] = React.useState<T>([] as any);
    const [loadingPageData, setPageLoading] = React.useState(true);
    const [isFirstLoad, setIsFirstLoad] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            if(!location || reloadPathnames.indexOf(location.pathname) > -1 || isFirstLoad) {

                setPageLoading(true);

                const _pageData = await loader();

                if(typeof options.afterLoaded === "function") {
                    options.afterLoaded(_pageData)
                }

                setPageData(_pageData);
                setPageLoading(false);
                setIsFirstLoad(false);
            }
        })();
    }, !location ? [] : [location.pathname]);

    return {
        pageData, loadingPageData
    }
};

export abstract class PageWrapperContextClass<T, S> extends React.Component<T, S>{
    static contextType = PageWrapperContext
}

export const useCurrentSiteMapCode = () => {
    const {currentSiteMapCodes} = React.useContext(PageWrapperContext);
    return currentSiteMapCodes;
}

export const resolveToAndLabel = (input, data?: any) => typeof input === "function" ? input(data ? data : {}) : input;