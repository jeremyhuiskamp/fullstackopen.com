import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notification from './Notification';
import { setErrorNotification, setInfoNotification } from '../reducers/notificationReducer';

describe('Notification component', () => {
    test('no notification means empty render', () => {
        const store = createStore(reducer, {
            notification: {},
            aphorisms: [],
        });
        const component = render(<Provider store={store}><Notification /></Provider>);
        expect(component.queryByTestId('notification')).not.toBeInTheDocument();
    });

    test('render error notification', () => {
        const store = createStore(reducer, {
            notification: {},
            aphorisms: [],
        });
        store.dispatch(setErrorNotification('error!'));
        const component = render(<Provider store={store}><Notification /></Provider>);
        const notification = component.getByTestId('notification');
        expect(notification.textContent).toContain('error!');
        expect(notification.classList).toContain('error');
        expect(notification.classList).not.toContain('info');
    });

    test('render info notification', () => {
        const store = createStore(reducer, {
            notification: {},
            aphorisms: [],
        });
        store.dispatch(setInfoNotification('info!'));
        const component = render(<Provider store={store}><Notification /></Provider>);
        const notification = component.getByTestId('notification');
        expect(notification.textContent).toContain('info!');
        expect(notification.classList).toContain('info');
        expect(notification.classList).not.toContain('error');
    });
});