// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { HTTPQueryBuilder } from '../../../../../issue-filing/common/http-query-builder';
import { IssueDetailsBuilder } from '../../../../../issue-filing/common/issue-details-builder';
import { createGitHubIssueFilingUrlProvider } from '../../../../../issue-filing/github/create-github-issue-filing-url';
import { UrlRectifier } from '../../../../../issue-filing/github/github-url-rectifier';
import { IssueFilingUrlProvider } from '../../../../../issue-filing/types/issue-filing-service';
import { EnvironmentInfo } from './../../../../../common/environment-info-provider';
import { IssueUrlCreationUtils } from './../../../../../issue-filing/common/issue-filing-url-string-utils';
import { GitHubIssueFilingSettings } from './../../../../../issue-filing/github/github-issue-filing-service';

const buildedUrl = 'https://builded-url';
describe('createGitHubIssueFilingUrlTest', () => {
    let environmentInfo: EnvironmentInfo;
    let sampleIssueDetailsData;
    let settingsData: GitHubIssueFilingSettings;
    let stringUtilsMock: IMock<IssueUrlCreationUtils>;
    let issueDetailsGetter: IMock<IssueDetailsBuilder>;
    let testObject: IssueFilingUrlProvider<GitHubIssueFilingSettings>;
    let queryBuilderMock: IMock<HTTPQueryBuilder>;
    let rectifyMock: IMock<UrlRectifier>;

    beforeEach(() => {
        environmentInfo = {
            extensionVersion: '1.1.1',
            axeCoreVersion: '2.2.2',
            browserSpec: 'test spec',
        };
        sampleIssueDetailsData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
                failureSummary: 'RR-failureSummary',
                guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
                help: 'RR-help',
                html: 'RR-html',
                ruleId: 'RR-rule-id',
                helpUrl: 'RR-help-url',
                selector: 'RR-selector<x>',
                snippet: 'RR-snippet   space',
            } as any,
        };
        settingsData = {
            repository: 'test repo',
        };

        stringUtilsMock = Mock.ofType<IssueUrlCreationUtils>();

        const testTitle = 'test title';
        stringUtilsMock.setup(utils => utils.getTitle(sampleIssueDetailsData)).returns(() => testTitle);

        issueDetailsGetter = Mock.ofType<IssueDetailsBuilder>();
        const testIssueDetails = 'test issue details';
        issueDetailsGetter.setup(getter => getter(environmentInfo, sampleIssueDetailsData)).returns(() => testIssueDetails);

        const rectifiedUrl = 'rectified-url';
        rectifyMock = Mock.ofType<UrlRectifier>();
        rectifyMock.setup(rectifier => rectifier(settingsData.repository)).returns(() => rectifiedUrl);

        queryBuilderMock = Mock.ofType<HTTPQueryBuilder>();

        queryBuilderMock.setup(builder => builder.withBaseUrl(`${rectifiedUrl}/new`)).returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.withParam('title', testTitle)).returns(() => queryBuilderMock.object);
        queryBuilderMock.setup(builder => builder.withParam('body', testIssueDetails)).returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.build()).returns(() => buildedUrl);

        testObject = createGitHubIssueFilingUrlProvider(
            stringUtilsMock.object,
            issueDetailsGetter.object,
            () => queryBuilderMock.object,
            rectifyMock.object,
        );
    });

    it('creates url', () => {
        const result = testObject(settingsData, sampleIssueDetailsData, environmentInfo);

        expect(result).toEqual(buildedUrl);
    });
});
