// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UAParser } from 'ua-parser-js';

import { ChromeAdapter } from '../background/browser-adapter';
import { initializeFabricIcons } from '../common/fabric-icons';
import { UrlParser } from '../common/url-parser';
import { UrlValidator } from '../common/url-validator';
import { PopupInitializer } from './popup-initializer';
import { TargetTabFinder } from './target-tab-finder';

initializeFabricIcons();
const browserAdapter = new ChromeAdapter();
const urlValidator = new UrlValidator();
const targetTabFinder = new TargetTabFinder(window, browserAdapter, urlValidator, new UrlParser());
const userAgentParser = new UAParser(window.navigator.userAgent);
const popupInitializer: PopupInitializer = new PopupInitializer(browserAdapter, targetTabFinder, userAgentParser.getBrowser());

// tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
popupInitializer.initialize();
