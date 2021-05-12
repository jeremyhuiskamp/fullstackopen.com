import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
    let app, history;
    beforeEach(() => {
        history = createMemoryHistory();
        app = render(
            <Router history={history}>
                <App />
            </Router>
        );
    });

    test('header links rendered by default', () => {
        app.getByTestId('link-aphorisms');
        app.getByTestId('link-create');
        app.getByTestId('link-about');
    });

    test('footer rendered by default', () => {
        app.getByTestId('footer');
    });

    test('aphorisms shown by default', () => {
        const aphorisms = app.getByTestId('aphorisms');
        within(aphorisms).getByText('Aphorisms');
        within(aphorisms).getByText(/^If it hurts,/);
        within(aphorisms).getByText(/^Premature optimization/);
    });

    describe('create new aphorism', () => {
        test('navigating to /create', () => {
            history.push('/create');

            expect(app.queryByTestId('aphorisms')).toBeNull();
            app.getByTestId('create-aphorism');
        });

        test('clicking header link', () => {
            app.getByTestId('link-create').click();

            expect(history.location.pathname).toEqual('/create');
            expect(app.queryByTestId('aphorisms')).toBeNull();
            app.getByTestId('create-aphorism');
        });

        test('add aphorism', () => {
            app.getByTestId('link-create').click();

            const form = app.getByTestId('create-aphorism');
            userEvent.type(within(form).getByLabelText(/content/), 'wisdom!');
            within(form).getByRole('button').click();
            app.getByTestId('link-aphorisms').click();

            app.getByText('wisdom!');
        });
    });

    describe('about app', () => {
        test('clicking header link', () => {
            app.getByTestId('link-about').click();

            expect(history.location.pathname).toEqual('/about');
            expect(app.queryByTestId('aphorisms')).toBeNull();
            expect(app.queryByTestId('create-aphorism')).toBeNull();
            app.getByTestId('about');
        });

        test('navigating to /about', () => {
            history.push('/about');

            expect(app.queryByTestId('aphorisms')).toBeNull();
            expect(app.queryByTestId('create-aphorism')).toBeNull();
            app.getByTestId('about');
        });
    });

    describe('view single anecdote', () => {
        test('click and view', () => {
            app.getByText(/^If it hurts/).click();
            expect(app.queryByTestId('aphorisms')).toBeNull();

            const aphorism = app.getByTestId('aphorism');
            const heading = within(aphorism).getByRole('heading', { level: 2 });
            expect(heading.textContent).toContain('If it hurts');
            expect(heading.textContent).toContain('by Jez Humble');

            const linkParagraph = within(aphorism).getByText(/for more info/);
            const link = within(linkParagraph).getByRole('link');
            expect(link.href).toContain('martinfowler.com');
        });

        test('visit aphorism that doesn\'t exist', () => {
            history.push('/aphorisms/nopenopenope');
            const heading = app.getByRole('heading', { level: 2 });
            expect(heading.textContent).toEqual('No such aphorism!');
        });
    });
});