// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import {
    AssessmentTelemetryData,
    BaseTelemetryData,
    DetailsViewOpenedTelemetryData,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    DetailsViewTargetLinkClickTelemetryData,
    ExportResultsTelemetryData,
    FeatureFlagToggleTelemetryData,
    InspectTelemetryData,
    RuleAnalyzerScanTelemetryData,
    TelemetryEventSource,
    TestStepActionTelemetryData,
    TestStepSelectTelemetryData,
    ToggleTelemetryData,
    TriggeredByNotApplicable,
} from '../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { AxeAnalyzerResult } from '../../../../injected/analyzers/ianalyzer';
import { EventStubFactory } from './../../common/event-stub-factory';

describe('TelemetryDataFactoryTest', () => {
    const testObject: TelemetryDataFactory = new TelemetryDataFactory();
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = 1 as TelemetryEventSource;
    const mouseClickEvent = eventStubFactory.createMouseClickEvent() as any;
    const keypressEvent = eventStubFactory.createKeypressEvent() as any;

    test('forAddSelector', () => {
        const event = mouseClickEvent;

        const source = TelemetryEventSource.AdHocTools;
        const type = 'inputType';

        const result = testObject.forAddSelector(event, type, source);

        const expected = {
            triggeredBy: 'mouseclick',
            source: source,
            inputType: type,
        };

        expect(result).toEqual(expected);
    });

    test('forDeleteSelector', () => {
        const event = mouseClickEvent;

        const source = TelemetryEventSource.AdHocTools;
        const type = 'inputType';

        const result = testObject.forDeleteSelector(event, type, source);

        const expected = {
            triggeredBy: 'mouseclick',
            source: source,
            inputType: type,
        };

        expect(result).toEqual(expected);
    });

    test('forToggle by keypress', () => {
        const event = keypressEvent;
        const enabled = true;

        const result = testObject.forToggle(event, enabled, testSource);

        const expected = {
            triggeredBy: 'keypress',
            enabled,
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forToggle by mouseclick', () => {
        const event = mouseClickEvent;
        const enabled = true;

        const result = testObject.forToggle(event, enabled, testSource);

        const expected = {
            triggeredBy: 'mouseclick',
            enabled,
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forSelectDetailsView by keypress', () => {
        const event = keypressEvent;
        const type = VisualizationType.Color;
        const source = TelemetryEventSource.DetailsView;

        const result = testObject.forSelectDetailsView(event, type);

        const expected: DetailsViewOpenTelemetryData = {
            detailsView: VisualizationType[type],
            triggeredBy: 'keypress',
            source,
        };

        expect(result).toEqual(expected);
    });

    test('forSelectDetailsView by mouseclick', () => {
        const event = mouseClickEvent;
        const type = VisualizationType.Color;
        const source = TelemetryEventSource.DetailsView;

        const result = testObject.forSelectDetailsView(event, type);

        const expected: DetailsViewOpenTelemetryData = {
            detailsView: VisualizationType[type],
            triggeredBy: 'mouseclick',
            source,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewOpened', () => {
        const detailsViewPivotStub = -1;
        const result = testObject.forDetailsViewOpened(detailsViewPivotStub);
        const expected: DetailsViewOpenedTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedDetailsViewPivot: DetailsViewPivotType[detailsViewPivotStub],
        };

        expect(result).toEqual(expected);
    });

    test('forOpenDetailsView by keypress', () => {
        const type = VisualizationType.Headings;
        const event = keypressEvent;

        const result = testObject.forOpenDetailsView(event, type, testSource);

        const expected: DetailsViewOpenTelemetryData = {
            detailsView: VisualizationType[type],
            triggeredBy: 'keypress',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forOpenDetailsView by mouseclick', () => {
        const type = VisualizationType.Headings;
        const event = mouseClickEvent;

        const result = testObject.forOpenDetailsView(event, type, testSource);

        const expected: DetailsViewOpenTelemetryData = {
            detailsView: VisualizationType[type],
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewNavPivotActivated by keypress', () => {
        const event = {
            nativeEvent: {
                detail: 0,
            },
        } as any;


        const pivotKey = 'test item key';

        const result = testObject.forDetailsViewNavPivotActivated(event, pivotKey);

        const expected: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'keypress',
            pivotKey,
            source: TelemetryEventSource.DetailsView,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewNavPivotActivated by mouseclick', () => {
        const event = {
            nativeEvent: {
                detail: 1,
            },
        } as any;

        const pivotKey = 'test item key';

        const result = testObject.forDetailsViewNavPivotActivated(event, pivotKey);

        const expected: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'mouseclick',
            pivotKey,
            source: TelemetryEventSource.DetailsView,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewEventWithoutTrigger', () => {
        const result = testObject.fromDetailsViewNoTriggeredBy();
        const source = TelemetryEventSource.DetailsView;

        const expected: DetailsViewTargetLinkClickTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source,
        };

        expect(result).toEqual(expected);
    });

    test('forVisualizationToggleByCommand', () => {
        const toEnabled = true;
        const result = testObject.forVisualizationToggleByCommand(toEnabled);

        const expected: ToggleTelemetryData = {
            triggeredBy: 'shortcut',
            enabled: toEnabled,
            source: TelemetryEventSource.ShortcutCommand,
        };

        expect(result).toEqual(expected);
    });

    test('forOpenShortcutConfigureTab', () => {
        const event = keypressEvent;
        const result: BaseTelemetryData = testObject.fromHamburgetMenu(event);

        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.HamburgerMenu,
        };

        expect(result).toEqual(expected);
    });

    test('forOpenTutorial', () => {
        const event = keypressEvent;
        const result: BaseTelemetryData = testObject.fromLaunchPad(event);

        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.LaunchPad,
        };

        expect(result).toEqual(expected);
    });

    test('forInspectElement', () => {
        const event = keypressEvent;
        const target = ['#frame', 'div'];
        const result: InspectTelemetryData = testObject.forInspectElement(event, target);

        const expected: InspectTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.IssueDetailsDialog,
            target: target,
        };

        expect(result).toEqual(expected);
    });

    test('withTriggeredByAndSource', () => {
        const event = mouseClickEvent;
        const expected: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        const actual = testObject.withTriggeredByAndSource(event, testSource);

        expect(actual).toEqual(expected);
    });

    test('forSelectTestStep', () => {
        const event = mouseClickEvent;
        const expected: TestStepSelectTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
            selectedStep: 'step',
        };

        const actual: TestStepSelectTelemetryData = testObject.forSelectTestStep(event, VisualizationType.Headings, 'step');

        expect(actual).toEqual(expected);
    });

    test('forSelectDetailsView without event', () => {
        const event = null;
        const expected: TestStepSelectTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
            selectedStep: 'step',
        };

        const actual: TestStepSelectTelemetryData = testObject.forSelectTestStep(event, VisualizationType.Headings, 'step');

        expect(actual).toEqual(expected);
    });

    test('forAssessmentActionFromDetailsViewNoTriggeredBy', () => {
        const expected: AssessmentTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
        };

        const actual: AssessmentTelemetryData = testObject.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.Headings);

        expect(actual).toEqual(expected);
    });

    test('forAssessmentActionFromDetailsView', () => {
        const event = mouseClickEvent;
        const expected: AssessmentTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
        };

        const actual: AssessmentTelemetryData = testObject.forAssessmentActionFromDetailsView(VisualizationType.Headings, event);

        expect(actual).toEqual(expected);
    });

    test('forAddRemoveFailureInstanceFromDetailsView', () => {
        const event = mouseClickEvent;
        const expected: TestStepActionTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedStep: 'step',
            selectedTest: VisualizationType[-1],
        };

        const actual: TestStepActionTelemetryData = testObject.forTestStepFromDetailsView(-1, 'step');

        expect(actual).toEqual(expected);
    });

    test('fromCancelStartOver', () => {
        const test = VisualizationType.ColorSensoryAssessment;
        const step = 'step';
        const expected = {
            selectedStep: step,
            selectedTest: VisualizationType[test],
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
        };

        const actual = testObject.forCancelStartOver(mouseClickEvent, test, step);

        expect(actual).toEqual(expected);
    });

    test('fromDetailsView', () => {
        const event = eventStubFactory.createNativeKeypressEvent() as any;
        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.DetailsView,
        };

        const actual = testObject.fromDetailsView(event);

        expect(actual).toEqual(expected);
    });

    test('forFeatureFlagToggle', () => {
        const event = mouseClickEvent;
        const expected: FeatureFlagToggleTelemetryData = {
            triggeredBy: 'mouseclick',
            enabled: true,
            source: TelemetryEventSource.DetailsView,
            featureFlagId: 'id',
        };

        const actual: FeatureFlagToggleTelemetryData = testObject.forFeatureFlagToggle(event, true, TelemetryEventSource.DetailsView, 'id');

        expect(actual).toEqual(expected);
    });

    test('forAssessmentRequirementScan', () => {
        const testName = 'test';
        const requirementName = 'requirement';
        const analyzerResultStub = {
            include: [],
            exclude: [],
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forAssessmentRequirementScan(analyzerResultStub, elapsedTime, elementsScanned, testName, requirementName);
        const expected: RuleAnalyzerScanTelemetryData = {
            scanDuration: elapsedTime,
            NumberOfElementsScanned: elementsScanned,
            include: analyzerResultStub.include,
            exclude: analyzerResultStub.exclude,
            testName,
            requirementName,
        };

        expect(actual).toEqual(expected);
    });

    test('forTestScan', () => {
        const testName = 'test';
        const analyzerResultStub = {
            include: [],
            exclude: [],
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forTestScan(analyzerResultStub, elapsedTime, elementsScanned, testName);
        const expected: RuleAnalyzerScanTelemetryData = {
            scanDuration: elapsedTime,
            NumberOfElementsScanned: elementsScanned,
            include: analyzerResultStub.include,
            exclude: analyzerResultStub.exclude,
            testName,
        };

        expect(actual).toEqual(expected);
    });

    test('forIssuesAnalyzerScan', () => {
        const testName = 'test';
        const analyzerResultStub = {
            include: [],
            exclude: [],
            originalResult: {
                passes: [
                    {
                        id: 'test',
                        nodes: [{}, {}],
                    },
                ],
                violations: [
                    {
                        id: 'test',
                        nodes: [{}],
                    },
                    {
                        id: 'test-2',
                        nodes: [{}],
                    },
                ],
            },
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forIssuesAnalyzerScan(analyzerResultStub, elapsedTime, elementsScanned, testName);
        const passedRuleResultsStub = {
            test: 2,
        };
        const failedRuleResultsStub = {
            test: 1,
            'test-2': 1,
        };

        expect(actual.scanDuration).toBe(elapsedTime);
        expect(actual.NumberOfElementsScanned).toBe(elementsScanned);
        expect(actual.include).toBe(analyzerResultStub.include);
        expect(actual.exclude).toBe(analyzerResultStub.exclude);
        expect(JSON.parse(actual.passedRuleResults)).toEqual(passedRuleResultsStub);
    });

    test('forExportedHtml by keypress', () => {
        const exportedHtml = 'some html string';
        const event = keypressEvent;
        const exportResultsType = 'Assessment';

        const result = testObject.forExportedHtml(exportResultsType, exportedHtml, event, testSource);

        const expected: ExportResultsTelemetryData = {
            exportResultsType: exportResultsType,
            exportResultsData: exportedHtml.length,
            triggeredBy: 'keypress',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forExportedHtml by mouseclick', () => {
        const exportedHtml = 'some html string1';
        const event = mouseClickEvent;
        const exportResultsType = 'AutomatedChecks';

        const result = testObject.forExportedHtml(exportResultsType, exportedHtml, event, testSource);

        const expected: ExportResultsTelemetryData = {
            exportResultsType: exportResultsType,
            exportResultsData: exportedHtml.length,
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });
});