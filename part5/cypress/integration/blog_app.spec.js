describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset');
        cy.createUser('root', 'root', 'sekret');
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
            cy.login('root', 'sekret');
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

        describe('When a blog post exists', function () {
            beforeEach(function () {
                cy.createBlog('title1', 'author1', 'http://url1');
                cy.get('#blogs').contains('author1').parent('.blog').as('blog');
            });

            it('blog can be liked', function () {
                cy.get('@blog').click(); // expand details
                cy.get('@blog').contains('👍').click();
                cy.get('@blog').contains('1 👍');
            });

            it('blog can be deleted by creator', function () {
                cy.get('@blog').click(); // expand details
                cy.get('@blog').contains('remove').click();
                cy.get('#blogs').should('be.empty');
            });

            it('blog cannot be deleted by different user', function () {
                cy.createUser('the other admin', 'root2', 'zekret');
                cy.login('root2', 'zekret');

                cy.get('@blog').click(); // expand details
                cy.get('@blog').should('not.contain', 'remove');
            });
        });
    });
});
