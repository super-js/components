import * as React from "react";

import {Forms} from '../../components';
import {EInputTypes} from "../../components/input";

export default class DevelopmentForms extends React.Component {
    render() {
        return (
            <div>
                <Forms.BasicForm
                    title="Basic Form Example"
                    description="Basic Form Description"
                    // error="Oh no!"
                    // success="Oh yes!"
                    // warning="Oh warning!"
                    // info="Oh info!"
                    primaryActions={[
                        {code: 'primaryAction_1', label: 'SAVE', isFormSubmit: true},
                        {code: 'primaryAction_2', label: 'CANCEL', type: "danger"}
                    ]}
                    secondaryActions={[
                        {label: "Forgotten Password?"}
                    ]}
                    parameters={[
                        {
                            label       : "Group #1",
                            parameters : [
                                {code: "P1", type: EInputTypes.money, label: "Test Parameter #1", isRequired: true, validValues: [
                                    {label: 'Test #1', value: 'Test #1'},
                                    {label: 'Test #2', value: 'Test #2'},
                                ]},
                                {code: "P2", type: EInputTypes.money, label: "Test Parameter #2"}
                            ],
                            // rows        : [
                            //     {columns : [
                            //         {parameterCode: "P1"}, {parameterCode: "P2"}
                            //     ]}
                            // ]
                        },
                        // {
                        //     label       : "Group #2",
                        //     parameters : [
                        //         {code: "P1", dataType: EInputTypes.text, label: "Test Parameter #1", isRequired: true},
                        //         {code: "P2", dataType: EInputTypes.text, label: "Test Parameter #2", isRequired: false}
                        //     ],
                        //     rows        : [
                        //         {columns : [
                        //                 {parameterCode: "P1"}, {parameterCode: "P2"}, {parameterCode: "P1"}, {parameterCode: "P2"}
                        //             ]},
                        //         {columns : [
                        //                 {parameterCode: "P1"}, {parameterCode: "P2"}
                        //             ]},
                        //         {columns : [
                        //                 {parameterCode: "P1"}, {parameterCode: "P2"}, {parameterCode: "P1"}
                        //             ]}
                        //     ]
                        // }
                    ]}
                />
            </div>
        )
    }
}