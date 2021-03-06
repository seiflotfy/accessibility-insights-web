// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { ExportDialog, ExportDialogProps } from '../../../../../DetailsView/components/export-dialog';

describe('ExportDialog', () => {
    const onCloseMock = Mock.ofInstance(() => {});
    const onDescriptionChangeMock = Mock.ofInstance((value: string) => {});
    const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
    const eventStub = 'event stub' as any;
    let props: ExportDialogProps;

    beforeEach(() => {
        onCloseMock.reset();
        onDescriptionChangeMock.reset();
        actionMessageCreatorMock.reset();

        const deps = {
            detailsViewActionMessageCreator: actionMessageCreatorMock.object,
        };

        props = {
            deps,
            isOpen: false,
            html: '<html><body>test-html</body></html>',
            fileName: 'THE REPORT FILE NAME',
            description: 'description',
            onClose: onCloseMock.object,
            onDescriptionChange: onDescriptionChangeMock.object,
            actionMessageCreator: actionMessageCreatorMock.object,
            exportResultsType: 'Assessment',
        };
    });

    describe('renders', () => {
        const isOpenOptions = [true, false];

        it.each(isOpenOptions)('with open %p', isOpen => {
            props.isOpen = isOpen;

            const wrapper = shallow(<ExportDialog {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('closes the dialog onDismiss', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(Dialog).prop('onDismiss')();

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
        });

        it('handles click on export button', () => {
            onCloseMock.setup(oc => oc()).verifiable(Times.once());

            actionMessageCreatorMock
                .setup(a => a.exportResultsClicked(props.exportResultsType, props.html, eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            wrapper.find(PrimaryButton).simulate('click', eventStub);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
        });

        it('handles text changes for the description', () => {
            props.isOpen = true;
            const changedDescription = 'changed-description';
            onDescriptionChangeMock.setup(handler => handler(It.isValue(changedDescription))).verifiable(Times.once());

            const wrapper = shallow(<ExportDialog {...props} />);

            const textField = wrapper.find(TextField);
            textField.simulate('change', eventStub, changedDescription);

            onCloseMock.verifyAll();
            onDescriptionChangeMock.verifyAll();
            actionMessageCreatorMock.verifyAll();
        });
    });
});
