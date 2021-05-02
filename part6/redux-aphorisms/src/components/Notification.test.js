import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notification from './Notification';
import { setExpiringErrorNotification, setExpiringInfoNotification } from '../reducers/notificationReducer';

describe('Notification component', () => {
    test('no notification means empty render', () => {
        const store = createStore(reducer, applyMiddleware(thunk));
        const component = render(<Provider store={store}><Notification /></Provider>);
        expect(component.queryByTestId('notification')).not.toBeInTheDocument();
    });

    test('render error notification', () => {
        const store = createStore(reducer, applyMiddleware(thunk));
        store.dispatch(setExpiringErrorNotification('error!'));
        const component = render(<Provider store={store}><Notification /></Provider>);
        const notification = component.getByTestId('notification');
        expect(notification.textContent).toContain('error!');
        expect(notification.classList).toContain('error');
        expect(notification.classList).not.toContain('info');
    });

    test('render info notification', () => {
        const store = createStore(reducer, applyMiddleware(thunk));
        store.dispatch(setExpiringInfoNotification('info!'));
        const component = render(<Provider store={store}><Notification /></Provider>);
        const notification = component.getByTestId('notification');
        expect(notification.textContent).toContain('info!');
        expect(notification.classList).toContain('info');
        expect(notification.classList).not.toContain('error');
    });
});