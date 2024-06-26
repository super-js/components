import * as React from "react";
import type {History} from "history";
import { Table, Divider, Select, Typography} from "antd";
import {IconName} from "@fortawesome/fontawesome-svg-core";

import {AppCard} from "../appcard";

import AppTableCss from "./AppTable.css";
import {getNestedObjectValueByArray} from "../utils";
import {AppButton} from "../appbutton";
import {Icon} from "../icon";


type TRenderColumnItem<R> =(text: any, record: R, index: number) => React.ReactNode;

export interface IColumn<R> {
    code: string | string[];
    label: string;
    linkTo?: (record: R) => string | null;
    render?: TRenderColumnItem<R>;
    sortable?: boolean;
    width?: string;
}

export interface ITableAction<R> {
    to?: string;
    onClick?: (record?: R) => void;
    label: string;
    iconName?: IconName;
}

export interface ITableColumnAction<R> extends Omit<ITableAction<R>, 'to' | 'label'> {
    to?: (record: R) => string;
    label?: string;
    shouldRender?: (record: R) => boolean;
}

export interface AppTableProps<R> {
    expandAll?: boolean;
    hideRowsFilter?: boolean;
    hidePagination?: boolean;
    fullHeight?: boolean;
    title?: string;
    columns: IColumn<R>[];
    data?:R[];
    onError?: (error: Error) => void;
    keyPropertyName: string;
    history?: History;
    actions?: ITableAction<R>[];
    columnActions?: ITableColumnAction<R>[];
    loading?: boolean;
}

export interface AppTableState<R> {
    loading: boolean;
    data:R[];
    hasError?: boolean;
    pageSize: number;
    expandedRowsKeys: React.Key[];
}

interface IGetColumnRendererOptions {
    history?: History;
}

export interface AppTableConfigProps {
    pageSize: number;
    onPageSizeChange: (value: any) => void;
}

export interface AppTableRecordType {
    children?: AppTableRecordType[];
}

function getColumnRenderer<R>(column: IColumn<R>, options: IGetColumnRendererOptions = {}): TRenderColumnItem<R> {
    if(typeof column.linkTo === "function" && options.history) {
        return (text, record, index) => {

            const pathName = column.linkTo(record);

            return pathName && typeof pathName === "string" ? (
                <a key={text} onClick={() => options.history.push({
                    pathname: column.linkTo(record),
                    state: record
                })}>
                    {text}
                </a>
            ) : text
        }
    } else if(typeof column.render === "function") {
        return column.render;
    }
}

function getActionColumnRenderer<R>(actions: ITableColumnAction<R>[], {history}) {
    return (text, record: R) => {

        const onClick = action => {
            if(typeof action.to === "function") {
                history.push(action.to(record))
            } else if(typeof action.onClick === "function") {
                action.onClick(record);
            }
        }

        return (
            <div className={AppTableCss.columnActions}>
                {actions
                    .filter(action => typeof action.shouldRender !== "function" || action.shouldRender(record))
                    .map(action => (
                        <a key={action.label || action.iconName} onClick={() => onClick(action)}>
                            {action.iconName ? <Icon iconName={action.iconName} /> : null}
                            {action.label ? <span>{action.label}</span> : null}
                        </a>
                    ))
                }
            </div>
        )
    }
}

const AppTableConfig = (props: AppTableConfigProps) => (
    <div className={AppTableCss.tableConfig}>
        <div className={AppTableCss.noOfItemsPerPage}>
            <Select value={props.pageSize} onChange={props.onPageSizeChange}>
                <Select.Option value={10}>10</Select.Option>
                <Select.Option value={50}>50</Select.Option>
                <Select.Option value={100}>100</Select.Option>
            </Select>
            <Typography.Text type="secondary">per page</Typography.Text>
        </div>
    </div>
);


export class AppTable<R extends AppTableRecordType | object = any> extends React.Component<AppTableProps<R>, AppTableState<R>>{

    state = {
        loading             : this.props.loading,
        data                : Array.isArray(this.props.data) ? this.props.data : [],
        hasError            : false,
        pageSize            : 50,
        expandedRowsKeys    : [],
    };

    static expandIcon(props) {

        if(!Array.isArray(props.record.children) || props.record.children.length === 0) {
            return <span>&nbsp;&nbsp;</span>;
        }

        return <Icon
            clickable
            iconName={props.expanded ? 'chevron-double-down' : 'chevron-double-right'}
            onClick={ev => props.onExpand(props.record, ev)}
        />;
    }

    componentDidUpdate(prevProps, prevState) {

        let nextState = {};

        if(Array.isArray(this.props.data) && this.props.data !== prevProps.data) {
            nextState = {
                data : this.props.data
            };
        }

        if(prevProps.loading !== this.props.loading) {
            nextState['loading'] = this.props.loading;
        }

        if(Object.keys(nextState).length > 0) this.setState(nextState)

    }

    ///pagination, filters, sorter, extra
    onTableChange = (pagination, filters, sorting, extra) => {

        let {order, field} = sorting;

        if(!order && this.props.columns.length > 0) {
            field = this.props.columns[0].code;
            order = "ascend";
        }

        const fieldAsArray = Array.isArray(field) ? field: [field];
        const getNestedObjectOptions = {defaultValue: "", arrayOfKey: fieldAsArray};

        if(Array.isArray(this.state.data)) {
            const {data} = this.state;

            data.sort((first, second) => {

                const value1 = getNestedObjectValueByArray({rootObject: first, ...getNestedObjectOptions});
                const value2 = getNestedObjectValueByArray({rootObject: second, ...getNestedObjectOptions});

                if (value1 < value2) {
                    return order === "ascend" ? -1 : 1;
                } else if (value1 > value2) {
                    return order === "ascend" ? 1 : -1;
                }

                return 0;
            });

            this.setState({
                data
            })
        }
    };

    onPageSizeChange = (pageSize) => this.setState({pageSize});

    _onActionClick = (action: ITableAction<R>) => {
        if(typeof action.onClick === "function") {
            action.onClick();
        } else if(action.to) {
            this.props.history.push(action.to);
        }
    };

    render() {

        const {
            columns, history, actions, keyPropertyName, fullHeight, title, hidePagination, hideRowsFilter,
            columnActions = []
        } = this.props;
        const {loading, data, pageSize, expandedRowsKeys} = this.state;

        const hasActions = Array.isArray(actions) && actions.length > 0;

        return (
            <AppCard small fullHeight={fullHeight}>
                {title ? (
                    <Typography.Title level={5}>{title}</Typography.Title>
                ) : null}
                <div className={AppTableCss.table}>
                    {hasActions || !hideRowsFilter ? (
                        <React.Fragment>
                            <div className={AppTableCss.tableHeader}>
                                <div className={AppTableCss.actions}>
                                    {hasActions ? actions.map(action => (
                                        <AppButton
                                            key={action.label}
                                            onClick={() => this._onActionClick(action)}
                                            iconName={action.iconName}
                                            label={action.label}
                                        />
                                    )) : null}
                                </div>
                                {!hideRowsFilter ? (
                                    <AppTableConfig pageSize={pageSize} onPageSizeChange={this.onPageSizeChange} />
                                ) : null}
                            </div>
                            <Divider />
                        </React.Fragment>
                    ) : null }
                    <Table<R>
                        tableLayout="auto"
                        dataSource={data}
                        loading={loading}
                        rowKey={keyPropertyName}
                        onChange={this.onTableChange}
                        pagination={!hidePagination ? {
                            size : "small",
                            pageSize
                        } : false}
                        expandable={{
                            expandIcon: AppTable.expandIcon
                        }}
                    >
                        {columns.map((column, ix) => (
                            <Table.Column<R>
                                className={AppTableCss.column}
                                key={Array.isArray(column.code) ? column.code.join('_') : column.code}
                                title={column.label}
                                dataIndex={column.code}
                                render={getColumnRenderer<R>(column, {history})}
                                sorter={column.sortable}
                                width={column.width ? column.width: ""}
                            />
                        ))}
                        {columnActions.length > 0 ? (
                            <Table.Column<R>
                                className={AppTableCss.column}
                                render={getActionColumnRenderer<R>(columnActions, {history})}
                                sorter={false}
                            />
                        ) : null}
                    </Table>
                </div>
            </AppCard>
        )
    }

}