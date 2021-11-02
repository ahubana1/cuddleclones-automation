/// <reference types="cypress" />

context('list products', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl + '/collections/all')
    })
  
    // check number of products - always 24
    it('list products in featured order', () => {
        cy.get('.collection-matrix')
            .find('.product__thumbnail')
            .should('have.length', 24);

        // default value is manual (featured)
        cy.get('.sort_by')
            .should('have.value', 'manual');    
    });

    it('list products alphabetically asc', () => {            
        // verify title-ascending is selected
        cy.get('.sort_by')
            .select('title-ascending')
            .should('have.value', 'title-ascending');

        // check number of products - always 24
        cy.get('.collection-matrix')
            .find('.product__thumbnail')
            .should('have.length', 24);

        // check alphabetical order of products
        cy.get('.sort_by')
            .select('title-ascending').wait(3000)
                .then(() => {
                cy.get('.product-thumbnail > a').then($elements => {
                    var strings = [...$elements].map(el => el.innerText);
                    expect(strings).to.deep.equal([...strings].sort());
            });
        });
    });

    it('list products alphabetically desc', () => {
            // verify title-ascending is selected
            cy.get('.sort_by')
                .select('title-descending')
                .should('have.value', 'title-descending');
    
            // check number of products - always 24
            cy.get('.collection-matrix')
                .find('.product__thumbnail')
                .should('have.length', 24);

            // check alphabetical order of products - desc
            cy.get('.sort_by')
            .select('title-descending').wait(3000)
                .then(() => {
                cy.get('.product-thumbnail > a').then($elements => {
                    var strings = [...$elements].map(el => el.innerText);
                    expect(strings).to.deep.equal([...strings].sort((a,b) => a<b));
            });
        });
    });
})
  
context('search for products', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)
    })
  
    it('search - finds no results', () => {
        var text = "im searching, no results";
        cy.get('#search').click({force: true});
        cy.get('.control > #q:last')
            .type(text)
            .should('have.value', text);

        cy.get('.no-results')
            .contains('No results found.');
    });

    it('search - finds results', () => {   
            var text = "original";
            cy.get('#search').click({force: true});
            cy.get('.control > #q:last')
                .type(text)
                .should('have.value', text);
            
            // two search results and 'see all results li'
            cy.get('.search__results > li')
                .should('have.length', 3);

            // Original plush cuddle clone as a first search result
            cy.get('.description > strong:first')
                .should('have.html', 'Original Plush Cuddle Clone');

            // assert img source
            cy.get('a > .thumbnail > img')
                .should('have.attr', 'src')
                .and('contain', 'https://cdn.shopify.com/s/files/1/0528/6176/3740/products/custom-stuffed-animal-1_333df00b-0c04-440c-9938-60fd30d48797_300x.jpg?v=1623246108');
    });
})
