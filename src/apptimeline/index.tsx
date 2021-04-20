import * as React from "react";
import {Tag, Timeline, Typography, Collapse, Divider, Form, Space, DatePicker, Select} from "antd";
import moment from "moment";

import AppTimelineCss from "./AppTimeline.css";
import {AppCard} from "../appcard";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {Icon} from "../icon";
import {AppButton} from "../appbutton";

import type {LiteralUnion} from "antd/lib/_util/type";
import type {PresetColorType, PresetStatusColorType} from "antd/lib/_util/colors";

export type OnContentDetailClick = (timelineItem: ITimelineItem) => any;

export interface ITimelineTag {
    label: string;
    color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>
}

export interface ITimelineItem {
    id: any;
    title: string;
    timestamp: Date;
    content?: string;
    iconName?: IconName;
    tags?: ITimelineTag[];
    hasFiles?: boolean;
    spinIcon?: boolean;
}

export interface OnTimelineItemsLoadOptions {
    start: number;
    length: number;
}

export type OnTimelineItemsLoad = (options: OnTimelineItemsLoadOptions) => Promise<ITimelineItem[]>;

export interface INewTimelineRecordOptions {
    label?: string;
    onClick?: () => any;
    iconName?: IconName;
}

export interface NoOfRecordsOptions {
    label?: string;
    defaultNoOfRecords?: 50 | 100 | 200 | 500;
}

export interface AppTimelineProps {
    onTimelineItemsLoad: OnTimelineItemsLoad;
    newTimelineRecordOptions?: INewTimelineRecordOptions;
    onContentDetailClick?: OnContentDetailClick;
    noOfRecords?: NoOfRecordsOptions;
}

export interface AppTimelineLabelProps {
    timelineItem: ITimelineItem;
}

export interface AppTimelineHeaderProps extends AppTimelineLabelProps {}
export interface AppTimelineContentProps extends AppTimelineLabelProps {
    onContentDetailClick?: OnContentDetailClick;
}

export function AppTimelineItemLabel(props: AppTimelineLabelProps) {

    const timeStamp = moment(props.timelineItem.timestamp).format('DD/MM/YY HH:mm');

    return (
        <div className={AppTimelineCss.label}>
            <Typography.Text type="secondary">{timeStamp}</Typography.Text>
        </div>
    )
}

export function AppTimelineItemHeader(props: AppTimelineHeaderProps) {

    const {timelineItem} = props;
    const {title, tags = [], hasFiles} = timelineItem;

    return (
        <div className={AppTimelineCss.header}>
            <Typography.Text>{title}</Typography.Text>
            <div className={AppTimelineCss.icons}>
                {Array.isArray(tags) && tags.length > 0 ? (
                    <React.Fragment>
                        {tags.map(tag => (
                            <Tag key={tag.label} color={tag.color}>{tag.label}</Tag>
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

export function AppTimelineItemContent(props: AppTimelineContentProps) {

    const onContentDetailClick = () => {
        if(typeof props.onContentDetailClick === "function") {
            props.onContentDetailClick(props.timelineItem);
        }
    }

    return (
        <div className={AppTimelineCss.content}>
            <iframe src={`data:text/html;charset=UTF-8,${props.timelineItem.content}`} />
            <Divider />
            <div className={AppTimelineCss.contentFooter}>
                {typeof props.onContentDetailClick === "function" ? (
                    <AppButton link onClick={onContentDetailClick} iconName="external-link" label="Open Detail"/>
                ) : <div />}
            </div>
        </div>
    )
}

export function AppTimeline(props: AppTimelineProps) {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [timelineItems, setTimelineItems] = React.useState([] as ITimelineItem[]);

    const loadTimelineItems = async () => {

        setLoading(true);

        try {
            if(typeof props.onTimelineItemsLoad === "function") {
                const _timelineItems = await props.onTimelineItemsLoad({
                    start: 0, length: 100
                });
                setTimelineItems(_timelineItems);
            }
        } catch(err) {
            setError("Unable to load the timeline.");
        }

        setLoading(false);
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
                        <div className={AppTimelineCss.timelineHeader}>
                            <div className={AppTimelineCss.filters}>
                                <Form.Item label="Filter by Date">
                                    <Space>
                                        <DatePicker.RangePicker />
                                    </Space>
                                </Form.Item>
                            </div>
                            <div className={AppTimelineCss.options}>
                                <Form.Item label={props?.noOfRecords?.label || "# of Records"}>
                                    <Select
                                        className={AppTimelineCss.perPage}
                                        defaultValue={props?.noOfRecords?.defaultNoOfRecords || 100}
                                    >
                                        <Select.Option value={50}>50</Select.Option>
                                        <Select.Option value={100}>100</Select.Option>
                                        <Select.Option value={200}>200</Select.Option>
                                        <Select.Option value={500}>500</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <Divider />
                        <Timeline pending={loading} mode="left">
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
                                            <AppTimelineItemContent timelineItem={timelineItem} onContentDetailClick={props.onContentDetailClick}/>
                                        </Collapse.Panel>
                                    </Collapse>
                                </Timeline.Item>

                            ))}
                        </Timeline>
                    </div>
                )}
            </AppCard>
        </div>

    )
}

export type { LiteralUnion, PresetColorType, PresetStatusColorType };