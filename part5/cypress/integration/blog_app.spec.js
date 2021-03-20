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

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('root');
            cy.get('#password').type('sekret');
            cy.get('#login').click();
            cy.contains('Here are my blogs');
        });

        it('fails with wrong credentials', function () {
            cy.get('#username').type('root');
            cy.get('#password').type('not the sekret');
            cy.get('#login').click();
            cy.get('.notification')
                .should('contain', 'login failed: invalid username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)');
        });
    });

    describe('When logged in', function () {
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3001/api/login', {
                username: 'root',
                password: 'sekret',
            }).then(rsp => {
                localStorage.setItem('loggedInUser', JSON.stringify(rsp.body));
                cy.visit('http://localhost:3000');
                cy.contains('Here are my blogs');
            });
        });

        it('A blog can be created', function () {
            cy.contains('new blog').click();
            cy.get('#blogTitle').type('blog title');
            cy.get('#blogAuthor').type('blog author');
            cy.get('#blogUrl').type('blog.blog/blog');
            cy.contains('submit').click();

            cy.get('#blogs')
                .should('contain', 'blog title')
                .and('contain', 'blog author');
        });
    });
});
