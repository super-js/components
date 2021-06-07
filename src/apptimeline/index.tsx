import * as React from "react";
import {
    Tag,
    Timeline,
    Typography,
    Collapse,
    Divider,
    Form,
    DatePicker,
    Select,
    Pagination,
    Input,
    Skeleton
} from "antd";
import * as moment from "moment";

import AppTimelineCss from "./AppTimeline.css";
import {AppCard} from "../appcard";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {Icon} from "../icon";
import {AppButton} from "../appbutton";

import type {LiteralUnion} from "antd/lib/_util/type";
import type {PresetColorType, PresetStatusColorType} from "antd/lib/_util/colors";
import {AppAlert} from "../appalert";
import {isDate, dateTimeToString} from "../utils";

export type OnOpenExternalDetailClick = (timelineItem: ITimelineItem) => void;

export interface ITimelineDetailAttribute {
    name: string;
    value: any;
}
export interface ITimelineItemDetail {
    attributes?: ITimelineDetailAttribute[];
    content?: string;
}
export type LoadTimelineItemDetail = (timelineItem: ITimelineItem) => Promise<ITimelineItemDetail>

export interface ITimelineTag {
    label: string;
    color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
    width?: string;
}

export interface ITimelineItem {
    id: any;
    title: string;
    timestamp: Date;
    iconName?: IconName;
    tags?: ITimelineTag[];
    hasFiles?: boolean;
    spinIcon?: boolean;
}

export interface OnTimelineItemsLoadOptions {
    start: number;
    noOfRecords: number;
    fromDate?: string;
    toDate?: string;
    fullText?: string;
}

export interface ITimelineItemsLoadedResponse {
    timelineItems: ITimelineItem[];
    totalNoOfItems: number;
}
export type OnTimelineItemsLoad = (options: OnTimelineItemsLoadOptions) => Promise<ITimelineItemsLoadedResponse>;

export type TDateRange = [moment.Moment, moment.Moment];
export interface IOnFilterChangeOptions {
    dateRange: TDateRange;
    noOfRecords: number;
    fullText: string;
}
export type OnFilterChange = (onChange: IOnFilterChangeOptions) => any;

export interface INewTimelineRecordOptions {
    label?: string;
    onClick?: () => any;
    iconName?: IconName;
}

export interface NoOfRecordsOptions {
    label?: string;
    defaultNoOfRecords?: 50 | 100 | 200 | 500;
}

export interface AppTimelineHeaderProps {
    noOfRecords?: NoOfRecordsOptions;
    dateFilterLabel?: string;
    onFilterChange: OnFilterChange;
    loading: boolean;
}

export interface AppTimelineProps extends Omit<AppTimelineHeaderProps, 'onFilterChange' | 'loading'> {
    onTimelineItemsLoad: OnTimelineItemsLoad;
    newTimelineRecordOptions?: INewTimelineRecordOptions;
    onOpenExternalDetailClick?: OnOpenExternalDetailClick;
    totalNoOfItems?: number;
    loadTimelineItemDetail?: LoadTimelineItemDetail;
}

export interface AppTimelineItemLabelProps {
    timelineItem: ITimelineItem;
}

export interface AppTimelineItemHeaderProps extends AppTimelineItemLabelProps {}
export interface AppTimelineItemContentProps extends AppTimelineItemLabelProps {
    onOpenExternalDetailClick?: OnOpenExternalDetailClick;
    loadTimelineItemDetail?: LoadTimelineItemDetail;
}

export interface AppTimelineFooterProps {
    totalNoOfItems: number;
    pageSize: number;
    onPaginationChange: (pageNo: number) => void;
    loading: boolean;
}

export function AppTimelineItemLabel(props: AppTimelineItemLabelProps) {

    const timeStamp = moment(props.timelineItem.timestamp).format('DD/MM/YY HH:mm');

    return (
        <div className={AppTimelineCss.label}>
            <Typography.Text type="secondary">{timeStamp}</Typography.Text>
        </div>
    )
}

export function AppTimelineItemHeader(props: AppTimelineItemHeaderProps) {

    const {timelineItem} = props;
    const {title, tags = [], hasFiles} = timelineItem;

    return (
        <div className={AppTimelineCss.header}>
            <Typography.Text>{title}</Typography.Text>
            <div className={AppTimelineCss.icons}>
                {Array.isArray(tags) && tags.length > 0 ? (
                    <React.Fragment>
                        {tags.map(tag => (
                            <Tag
                                key={tag.label}
                                color={tag.color}
                                style={{width: tag.width ? tag.width : ''}}
                                className={AppTimelineCss.tag}>
                                {tag.label}
                            </Tag>
                        ))}
                    </React.Fragment>
                ) : null}
                {hasFiles ? (
                    <Icon iconName="paperclip" />
                ) : null}
            </div>
        </div>

    )
}

export function AppTimelineItemContent(props: AppTimelineItemContentProps) {

    const [error, setError] = React.useState("");
    const [attributes, setAttributes] = React.useState([]);
    const [content, setContent] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const hasDetail = (Array.isArray(attributes) && attributes.length > 0) || content;

    const onContentDetailClick = () => {
        if(typeof props.onOpenExternalDetailClick === "function") {
            props.onOpenExternalDetailClick(props.timelineItem);
        }
    }

    React.useEffect(() => {
        if(typeof props.loadTimelineItemDetail === "function") {
            (async () => {

                setLoading(true);

                try {
                    const {content, attributes} = await props.loadTimelineItemDetail(props.timelineItem);
                    setContent(content);
                    setAttributes(attributes.map(attribute => {
                        if(isDate(attribute.value)) return {
                            ...attribute,
                            value : dateTimeToString(attribute.value)
                        };

                        return attribute
                    }));
                } catch (err) {
                    setError(`Unable to load the detail - ${err.message}`);
                }

                setLoading(false)
            })()
        }
    }, []);

    if(loading) return <Skeleton active paragraph={{rows: 5}} />;

    return (
        <div className={AppTimelineCss.detail}>
            {error ? (
                <AppAlert message={error} type="error" />
            ) : (
                <>
                    {hasDetail ? (
                        <>
                            <div className={AppTimelineCss.detailBody}>
                                {content ? (
                                    <iframe src={`data:text/html;charset=UTF-8,${content}`} />
                                ) : null}
                                {Array.isArray(attributes) && attributes.length > 0 ? (
                                    <div>
                                        {attributes.map(attribute => (
                                            <div className={AppTimelineCss.attribute}>
                                                <Typography.Text strong>{attribute.name}</Typography.Text>
                                                <Typography.Text type="secondary">{attribute.value}</Typography.Text>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            <Divider />
                        </>
                    ) : null}
                    <div className={AppTimelineCss.contentFooter}>
                        {typeof props.onOpenExternalDetailClick === "function" ? (
                            <AppButton link onClick={onContentDetailClick} iconName="external-link" label="Open Detail"/>
                        ) : <div />}
                    </div>
                </>
           )}
        </div>
    )
}

export function AppTimelineHeader(props: AppTimelineHeaderProps) {

    const [noOfRecords, setNoOfRecords] = React.useState(props?.noOfRecords?.defaultNoOfRecords || 100)
    const [dateRange, setDateRange] = React.useState([null, null] as TDateRange);
    const [fullText, setFullText] = React.useState('');

    const fullTextSearchTimeout = React.useMemo(() => ({
        timeout: null
    }), []);

    const onDateRangeChange = (_dateRange) => {
        setDateRange(_dateRange);
        props.onFilterChange({
            dateRange: _dateRange,
            noOfRecords, fullText
        });
    }

    const onNoOfRecordsChange = _noOfRecords => {
        setNoOfRecords(_noOfRecords);
        props.onFilterChange({
            dateRange, fullText,
            noOfRecords: _noOfRecords
        });
    }

    const onFullTextSearchChange = ({target}) => {
        setFullText(target.value);
        clearTimeout(fullTextSearchTimeout.timeout)
        fullTextSearchTimeout.timeout = setTimeout(() => {
            props.onFilterChange({
                dateRange,
                noOfRecords,
                fullText : target.value
            });
        }, 1000)
    }

    return (
        <div className={AppTimelineCss.timelineHeader}>
            <table className={AppTimelineCss.filters}>
                <tr>
                    <td>
                        <Typography>{props.dateFilterLabel ? props.dateFilterLabel : "Filter by Date"}</Typography>
                    </td>
                    <td>
                        <DatePicker.RangePicker
                            value={dateRange as any}
                            onChange={onDateRangeChange}
                            format="DD/MM/YYYY"
                            disabled={props.loading}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Typography>Fulltext search</Typography>
                    </td>
                    <td>
                        <Form.Item>
                            <Input
                                className={AppTimelineCss.fullTextSearch}
                                value={fullText}
                                onChange={onFullTextSearchChange}
                                disabled={props.loading}
                            />
                        </Form.Item>
                    </td>
                </tr>
            </table>
            <div className={AppTimelineCss.options}>
                <Form.Item label={props?.noOfRecords?.label || "# per Page"}>
                    <Select
                        className={AppTimelineCss.perPage}
                        value={noOfRecords}
                        onChange={onNoOfRecordsChange}
                        disabled={props.loading}
                    >
                        <Select.Option value={50}>50</Select.Option>
                        <Select.Option value={100}>100</Select.Option>
                        <Select.Option value={200}>200</Select.Option>
                        <Select.Option value={500}>500</Select.Option>
                        <Select.Option value={1000}>1000</Select.Option>
                    </Select>
                </Form.Item>
            </div>
        </div>
    )
}

export function AppTimelineFooter(props: AppTimelineFooterProps) {

    const [currentPage, setCurrentPage] = React.useState(1);

    const onPageChange = pageNo => {
        setCurrentPage(pageNo);
        props.onPaginationChange(pageNo)
    }

    return (
        <Pagination
            current={currentPage}
            onChange={onPageChange}
            total={props.totalNoOfItems}
            showSizeChanger={false}
            pageSize={props.pageSize}
            hideOnSinglePage
            disabled={props.loading}
        />
    )
}

export function AppTimeline(props: AppTimelineProps) {

    const filterOptions = React.useMemo(() => ({
        fromDate: '',
        toDate: '',
        noOfRecords: 100,
        start: 0,
        fullText: ''
    }), [])

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [timelineItems, setTimelineItems] = React.useState([] as ITimelineItem[]);
    const [totalNoOfItems, setTotalNoOfItems] = React.useState(0);

    const loadTimelineItems = async () => {

        setLoading(true);

        try {
            if(typeof props.onTimelineItemsLoad === "function") {
                const timelineItemsResponse = await props.onTimelineItemsLoad(filterOptions);

                setTimelineItems(timelineItemsResponse.timelineItems);
                setTotalNoOfItems(timelineItemsResponse.totalNoOfItems);
            }
        } catch(err) {
            setError("Unable to load the timeline.");
        }

        setLoading(false);
    }

    const onFilterChange = (options: IOnFilterChangeOptions) => {
        filterOptions.noOfRecords = options.noOfRecords;
        filterOptions.fromDate = options.dateRange[0]?.format('DD/MM/YYYY') || '';
        filterOptions.toDate = options.dateRange[1]?.format('DD/MM/YYYY') || '';
        filterOptions.start = 0;
        filterOptions.fullText = options.fullText;
        loadTimelineItems();
    }

    const onPaginationChange = (pageNo: number) => {
        filterOptions.start = (pageNo - 1) * filterOptions.noOfRecords;
        loadTimelineItems();
    }

    React.useEffect(() => {
        loadTimelineItems();
    }, []);

    return (
        <div>
            {props.newTimelineRecordOptions ? (
                <AppCard small className={AppTimelineCss.newTimelineRecord}>
                    <AppButton
                        onClick={() => typeof props.newTimelineRecordOptions.onClick === "function" ?
                            props.newTimelineRecordOptions.onClick() : null}
                        iconName={props.newTimelineRecordOptions.iconName || 'plus-circle'}
                        label={props.newTimelineRecordOptions.label || 'New Record'}
                    />
                </AppCard>
            ) : null}
            <AppCard small className={AppTimelineCss.appTimeline}>
                {error ? (
                    <Typography.Text type="danger">
                        {error}
                    </Typography.Text>
                ) : (
                    <div>
                        <AppTimelineHeader
                            noOfRecords={props.noOfRecords}
                            dateFilterLabel={props.dateFilterLabel}
                            onFilterChange={onFilterChange}
                            loading={loading}
                        />
                        <div style={{position: 'relative'}} className={AppTimelineCss.appTimelineBody}>
                            <Divider />
                            {loading ? (
                                <div className={AppTimelineCss.loading}>
                                    <Icon iconName="spinner" spin size="4x" />
                                </div>
                            ) : null}
                            <Timeline mode="left">
                                {timelineItems.map(timelineItem => (
                                    <Timeline.Item
                                        className={AppTimelineCss.appTimelineItem}
                                        key={timelineItem.id}
                                        label={<AppTimelineItemLabel timelineItem={timelineItem}/>}
                                        position="left"
                                        dot={timelineItem.iconName ? <Icon iconName={timelineItem.iconName} spin={timelineItem.spinIcon}/> : undefined}
                                    >
                                        <Collapse ghost expandIconPosition="right" className={AppTimelineCss.collapse}>
                                            <Collapse.Panel
                                                key={1}
                                                header={<AppTimelineItemHeader timelineItem={timelineItem} />}
                                                className={AppTimelineCss.collapsePanel}
                                            >
                                                <AppTimelineItemContent
                                                    timelineItem={timelineItem}
                                                    onOpenExternalDetailClick={props.onOpenExternalDetailClick}
                                                    loadTimelineItemDetail={props.loadTimelineItemDetail}
                                                />
                                            </Collapse.Panel>
                                        </Collapse>
                                    </Timeline.Item>

                                ))}
                            </Timeline>
                        </div>
                    </div>
                )}
                <AppTimelineFooter
                    totalNoOfItems={props.totalNoOfItems || totalNoOfItems}
                    pageSize={filterOptions.noOfRecords}
                    onPaginationChange={onPaginationChange}
                    loading={loading}
                />
            </AppCard>
        </div>

    )
}

export type { LiteralUnion, PresetColorType, PresetStatusColorType };