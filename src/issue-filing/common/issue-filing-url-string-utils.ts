// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export type IssueUrlCreationUtils = {
    getTitle: (data: CreateIssueDetailsTextData) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (data: CreateIssueDetailsTextData) => string[];
};

const getTitle = (data: CreateIssueDetailsTextData): string => {
    const standardTags = standardizeTags(data);
    let prefix = standardTags.join(',');
    if (prefix.length > 0) {
        prefix = prefix + ': ';
    }

    const selectorLastPart = getSelectorLastPart(data.ruleResult.selector);

    return `${prefix}${data.ruleResult.help} (${selectorLastPart})`;
};

const getSelectorLastPart = (selector: string): string => {
    let selectorLastPart = selector;
    if (selector.lastIndexOf(' > ') > 0) {
        selectorLastPart = selector.substr(selector.lastIndexOf(' > ') + 3);
    }
    return selectorLastPart;
};

const standardizeTags = (data: CreateIssueDetailsTextData): string[] => data.ruleResult.guidanceLinks.map(tag => tag.text.toUpperCase());

export const IssueFilingUrlStringUtils = {
    getTitle,
    getSelectorLastPart,
    standardizeTags,
};
