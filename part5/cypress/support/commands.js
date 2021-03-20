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

Cypress.Commands.add('login', (username, password) => {
    cy.request('POST', 'http://localhost:3001/api/login', { username, password })
        .then(rsp => {
            localStorage.setItem('loggedInUser', JSON.stringify(rsp.body));
            cy.visit('http://localhost:3000');
            cy.contains('Here are my blogs');
        });
});

Cypress.Commands.add('createUser', (name, username, password) => {
    cy.request('POST', 'http://localhost:3001/api/users', {
        name,
        username,
        password,
    });
});