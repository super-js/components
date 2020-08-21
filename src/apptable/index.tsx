import * as React from "react";
import {History} from "history";
import {Button, Table, Divider, Select, Typography} from "antd";
import {IconName} from "@fortawesome/fontawesome-svg-core";

import {AppCard} from "../appcard";

import AppTableCss from "./AppTable.css";
import {getNestedObjectValueByArray} from "../utils";
import {AppButton} from "../appbutton";

// interface IDataRecordBase {
//     key: any;
// }

//type TDataRecordsState<R> = R & IDataRecordBase;
//type TDataRecords<R> = R[];
//type TData<R> = TDataRecords<R> | GetData<R>;

//export type GetData<R> = () => Promise<TDataRecords<R>>;

type TRenderColumnItem<R> =(text: any, record: R, index: number) => React.ReactNode;

export interface IColumn<R> {
    code: string | string[];
    label: string;
    linkTo?: (record: R) => string;
    render?: TRenderColumnItem<R>;
    sortable?: boolean;
    width?: string;
}

export interface ITableAction {
    to?: string;
    onClick?: () => void;
    label: string;
    iconName?: IconName;
}

export interface TablePageProps<R> {
    columns: IColumn<R>[];
    data?:R[];
    onError?: (error: Error) => void;
    keyPropertyName: string;
    history?: History;
    actions?: ITableAction[];
    loading?: boolean;
}

export interface TablePageState<R> {
    loading: boolean;
    data:R[];
    hasError?: boolean;
    pageSize: number;
}

interface IGetColumnRendererOptions {
    history?: History;
}

export interface AppTableConfigProps {
    pageSize: number;
    onPageSizeChange: (value: any) => void;
}

function getColumnRenderer<R>(column: IColumn<R>, options: IGetColumnRendererOptions = {}): TRenderColumnItem<R> {
    if(typeof column.linkTo === "function" && options.history) {
        return (text, record, index) => (
            <a onClick={() => options.history.push({
                pathname: column.linkTo(record),
                state: record
            })}>
                {text}
            </a>
        )
    } else if(typeof column.render === "function") {
        return column.render;
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


export class AppTable<R extends object = any[]> extends React.Component<TablePageProps<R>, TablePageState<R>>{

    // _transformData = (data: any): TDataRecordsState<R>[] => {
    //     return data.map(dataRecord => ({
    //         key: dataRecord[this.props.keyPropertyName],
    //         ...dataRecord,
    //         ...(Array.isArray(dataRecord.children) && dataRecord.children.length > 0 ?
    //             {children: this._transformData(dataRecord.children)} : {})
    //     }))
    // };

    state = {
        loading     : this.props.loading,
        data        : Array.isArray(this.props.data) ? this.props.data : [],
        hasError    : false,
        pageSize    : 50
    };

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

    _onActionClick = (action: ITableAction) => {
        if(typeof action.onClick === "function") {
            action.onClick();
        } else if(action.to) {
            this.props.history.push(action.to);
        }
    };

    render() {

        const {columns, history, actions, keyPropertyName} = this.props;
        const {loading, data, pageSize} = this.state;

        const hasActions = Array.isArray(actions) && actions.length > 0;

        return (
            <AppCard small fullHeight>
                <div className={AppTableCss.table}>
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
                        <AppTableConfig pageSize={pageSize} onPageSizeChange={this.onPageSizeChange} />
                    </div>
                    <Divider />
                    <Table<R>
                        tableLayout="auto"
                        dataSource={data}
                        loading={loading}
                        rowKey={keyPropertyName}
                        onChange={this.onTableChange}
                        pagination={{
                            size : "small",
                            pageSize
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
                    </Table>
                </div>
            </AppCard>
        )
    }

}