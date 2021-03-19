describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset');
        cy.request('POST', 'http://localhost:3001/api/users', {
            name: 'root',
            username: 'root',
            password: 'sekret',
        });
        cy.visit('http://localhost:3000');
    });

    it('login form is shown', function () {
        cy.contains('You must log in');
        cy.get('#login');
    });
});
