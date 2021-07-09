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

        it('Invalid blog creation messages are displayed', function () {
            cy.contains('new blog').click();
            // no content -> should be rejected by backend
            cy.contains('submit').click();

            cy.get('.notification')
                .should('contain', 'Blog validation failed:');
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

        it('multiple blogs are ordered by likes', function () {
            cy.createBlog('title1', 'author1', 'url1').then(blog => {
                cy.likeBlog(blog.id, 7);
            });
            cy.createBlog('title2', 'author2', 'url2').then(blog => {
                cy.likeBlog(blog.id, 4);
            });
            cy.createBlog('title3', 'author3', 'url3').then(blog => {
                cy.likeBlog(blog.id, 10);
            });
            cy.createBlog('title4', 'author4', 'url4').then(blog => {
                cy.likeBlog(blog.id, 2);
            });

            cy.visit('http://localhost:3000');

            cy.get('#blogs').get('.blog').then(blogs => {
                const titles = blogs.map((_, blog) =>
                    Cypress.$(blog).find('a:first').text()).get();

                expect(titles).to.have.ordered.members([
                    'title3',
                    'title1',
                    'title2',
                    'title4',
                ]);
            });
        });
    });

    describe('users page', function () {
        it('can be viewed', function () {
            cy.createUser('Normal User', 'user', 'zekret');

            cy.login('root', 'sekret');
            cy.visit('http://localhost:3000/users');
            cy.get('h2').contains('Users');

            // TODO: create a blog for at least one user?

            // wait until table is populated:
            cy.get('table').contains('Normal User');

            // Learned this from:
            // https://github.com/roggerfe/cypress-get-table/blob/master/src/index.js
            cy.get('table tbody tr td').then(tds => {
                const content = [...tds].map(td => td.textContent);
                // is the order predictable here?
                expect(content).to.eql([
                    'root', '0',
                    'Normal User', '0',
                ]);
            });
        });
    });
});
