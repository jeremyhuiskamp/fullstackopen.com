import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { getByLabelText, getByRole, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
    const newApp = () => {
        const history = createMemoryHistory();
        return [
            render(
                <Router history={history}>
                    <App />
                </Router>),
            history,
        ];
    };

    test('header links rendered by default', () => {
        const [component] = newApp();
        component.getByTestId('link-aphorisms');
        component.getByTestId('link-create');
        component.getByTestId('link-about');
    });

    test('footer rendered by default', () => {
        const [component] = newApp();
        component.getByTestId('footer');
    });

    test('aphorisms shown by default', () => {
        const [component] = newApp();
        const aphorisms = component.getByTestId('aphorisms');
        within(aphorisms).getByText('Aphorisms');
        within(aphorisms).getByText(/^If it hurts,/);
        within(aphorisms).getByText(/^Premature optimization/);
    });

    describe('create new aphorism', () => {
        test('navigating to /create', () => {
            const [component, history] = newApp();
            history.push('/create');

            expect(component.queryByTestId('aphorisms')).toBeNull();
            component.getByTestId('create-aphorism');
        });

        test('clicking header link', () => {
            const [component, history] = newApp();
            component.getByTestId('link-create').click();

            expect(history.location.pathname).toEqual('/create');
            expect(component.queryByTestId('aphorisms')).toBeNull();
            component.getByTestId('create-aphorism');
        });

        test('add aphorism', () => {
            const [component] = newApp();
            component.getByTestId('link-create').click();

            const form = component.getByTestId('create-aphorism');
            userEvent.type(getByLabelText(form, 'content:'), 'wisdom!');
            getByRole(form, 'button').click();
            component.getByTestId('link-aphorisms').click();

            component.getByText('wisdom!');
        });
    });

    describe('about app', () => {
        test('clicking header link', () => {
            const [component, history] = newApp();
            component.getByTestId('link-about').click();

            expect(history.location.pathname).toEqual('/about');
            expect(component.queryByTestId('aphorisms')).toBeNull();
            expect(component.queryByTestId('create-aphorism')).toBeNull();
            component.getByTestId('about');
        });

        test('navigating to /about', () => {
            const [component, history] = newApp();
            history.push('/about');

            expect(component.queryByTestId('aphorisms')).toBeNull();
            expect(component.queryByTestId('create-aphorism')).toBeNull();
            component.getByTestId('about');
        });
    });
});