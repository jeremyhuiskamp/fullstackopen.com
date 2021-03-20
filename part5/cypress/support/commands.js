Cypress.Commands.add('createBlog', (title, author, url) => {
    cy.request({
        url: 'http://localhost:3001/api/blogs',
        method: 'POST',
        body: { title, author, url },
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
        },
    });

    cy.visit('http://localhost:3000');
});