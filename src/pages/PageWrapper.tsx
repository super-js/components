import * as React from "react";
import {History } from "history";
import {Breadcrumb, Typography, Divider} from "antd";

import PageWrapperCss from "./PageWrapper.css";

export type OnContextDataChange = (contextData: IPageWrapperContextData) => void;

export interface IBreadcrumbItem {
    label: string | React.ReactElement;
    to?: string;
}

export interface IPageWrapperContextData {
    breadcrumbItems?: IBreadcrumbItem[];
    data?: {[k: string]: any};
}

export interface PageWrapperState {
    breadcrumbItems: any[];
    data: {[k: string]: any};
}

export interface IPageWrapperContext {
    onContextDataChange: OnContextDataChange;
    data: {[k: string]: any};
}

export interface PageWrapperProps {
    history: History;
    children?: JSX.Element | JSX.Element[];
}

const PageWrapperContext = React.createContext<Partial<IPageWrapperContext>>({});

class PageWrapper extends React.Component<PageWrapperProps, PageWrapperState> {

    state = {
        breadcrumbItems : [],
        data            : {}
    };

    onContextDataChange = (contextData: IPageWrapperContextData) => {

        const {breadcrumbItems, data} = contextData;
        let contextState = {};

        if(breadcrumbItems) contextState['breadcrumbItems'] = contextData.breadcrumbItems;
        if(data) contextState['data'] = data;

        if(Object.keys(contextState).length > 0) this.setState(contextState)


    };

    onBreadcrumbClick = to => {
        this.props.history.push(to);
    };

    render() {

        const {breadcrumbItems, data} = this.state;

        return (
            <div className={PageWrapperCss.pageWrapper}>
                {breadcrumbItems.length > 0 ? (
                    <Breadcrumb>
                        {breadcrumbItems.map(breadcrumbItem => (
                            <Breadcrumb.Item key={breadcrumbItem.label}>
                                <span className={PageWrapperCss.breadCrumbItemContent}>
                                    {breadcrumbItem.to ? (
                                        <a onClick={() => this.onBreadcrumbClick(breadcrumbItem.to)}>{breadcrumbItem.label}</a>
                                    ) : <Typography.Text>{breadcrumbItem.label}</Typography.Text>}
                                </span>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                ) : null}
                {breadcrumbItems.length > 0 ? <Divider className={PageWrapperCss.divider} /> : null}
                <div className={PageWrapperCss.pageWrapperContent}>
                    <PageWrapperContext.Provider value={{
                        onContextDataChange: this.onContextDataChange,
                        data
                    }}>
                        {this.props.children}
                    </PageWrapperContext.Provider>
                </div>
            </div>
        )
    }
}

export {PageWrapper, PageWrapperContext};