// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { HelpLinks } from '../../../../../../DetailsView/components/overview-content/overview-help-links';
import { HelpLinkDeps, OverviewHelpProps } from '../../../../../../DetailsView/components/overview-content/overview-help-section';

describe('OverviewHelpLinks', () => {
    const deps = Mock.ofType<HelpLinkDeps>().object;

    test('linkInformation is shown properly', () => {
        const props: OverviewHelpProps = {
            linkDataSource: [
                {
                    href: 'https://www.test1.com',
                    text: 'test1',
                },
                {
                    href: 'https://www.test2.com',
                    text: 'test2',
                },
                {
                    href: 'https://www.test3.com',
                    text: 'test3',
                },
            ],
            deps,
        };

        const helpLinkSection = shallow(<HelpLinks linkInformation={props.linkDataSource} deps={props.deps} />);

        expect(helpLinkSection.exists()).toBe(true);

        const helpLinkDivs = helpLinkSection.find('.help-link');
        expect(helpLinkDivs.exists()).toBe(true);
        expect(helpLinkDivs.length).toBe(props.linkDataSource.length);
    });
});
