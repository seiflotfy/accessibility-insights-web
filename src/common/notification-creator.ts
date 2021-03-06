// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { BrowserAdapter } from '../background/browser-adapter';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { VisualizationConfigurationFactory } from './configs/visualization-configuration-factory';

export class NotificationCreator {
    private chromeAdapter: BrowserAdapter;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;

    constructor(chromeAdapter: BrowserAdapter, visualizationConfigurationFactory: VisualizationConfigurationFactory) {
        this.chromeAdapter = chromeAdapter;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
    }

    public createNotification(message: string): void {
        if (message) {
            const manifest = this.chromeAdapter.getManifest();
            this.chromeAdapter.createNotification({
                message: message,
                title: manifest.name,
                iconUrl: '../' + manifest.icons[128],
            });
        }
    }

    public createNotificationByVisualizationKey(
        selectorMap: DictionaryStringTo<any>,
        key: string,
        visualizationType: VisualizationType,
    ): void {
        if (_.isEmpty(selectorMap)) {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(visualizationType);
            const notificationMessage = configuration.getNotificationMessage(selectorMap, key);
            if (notificationMessage != null) {
                this.createNotification(notificationMessage);
            }
        }
    }
}
