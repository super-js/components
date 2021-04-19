import * as React from "react";
import {Tag, Timeline, Typography, Collapse, Divider, Form, Space, DatePicker, Select} from "antd";

import AppTimelineCss from "./AppTimeline.css";
import {AppCard} from "../appcard";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {Icon} from "../icon";
import {AppButton} from "../appbutton";

export type OnContentDetailClick = (timelineItem: ITimelineItem) => any;

export interface ITimelineItem {
    id: any;
    title: string;
    timestamp: string;
    content?: string;
    iconName?: IconName;
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
    newTimelineRecordOptions: INewTimelineRecordOptions;
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
    return (
        <div className={AppTimelineCss.label}>
            <Typography.Text type="secondary">{props.timelineItem.timestamp}</Typography.Text>
        </div>
    )
}

export function AppTimelineItemHeader(props: AppTimelineHeaderProps) {
    return (
        <div className={AppTimelineCss.header}>
            <Typography.Text>{props.timelineItem.title}</Typography.Text>
            <div className={AppTimelineCss.icons}>
                <Tag color="magenta">Test</Tag>
                <Tag color="volcano">Test 2</Tag>
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
            <iframe src={`data:text/html;${props.timelineItem.content}`} />
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
                                    dot={timelineItem.iconName ? <Icon iconName={timelineItem.iconName}/> : undefined}
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