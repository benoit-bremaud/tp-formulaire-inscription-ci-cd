describe('Parcours inscription', () => {
  beforeEach(() => {
    // On part toujours d'un etat propre : la liste des inscrits est lue depuis
    // le localStorage, donc on le vide avant chaque test, puis on charge la page.
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('charge la page d\'accueil', () => {
    // Premier test e2e minimal (slide 16) : on verifie que l'app repond et
    // affiche son titre. Equivalent du "cy.contains(...)" du cours, adapte a
    // notre formulaire (le texte "X user(s) already registered" appartient a la
    // webapp du docker-compose, pas a cette app).
    cy.contains('Inscription');
  });

  it('inscrit un nouvel utilisateur quand le formulaire est valide', () => {
    // Au depart : aucun inscrit.
    cy.contains('Aucun inscrit pour le moment.');

    // On remplit les six champs avec des valeurs valides.
    cy.get('#nom').type('Bremaud');
    cy.get('#prenom').type('Benoit');
    cy.get('#email').type('benoit@example.com');
    cy.get('#dateNaissance').type('1990-01-01');
    cy.get('#ville').type('Paris');
    cy.get('#codePostal').type('75001');

    cy.contains("S'inscrire").click();

    // Toast de succes + un inscrit dans la liste.
    cy.get('.toast').contains('Inscription réussie !');
    cy.get('ul li').should('have.length', 1).and('contain', 'Bremaud');
    cy.contains('Aucun inscrit pour le moment.').should('not.exist');
  });

  it("n'ajoute pas d'inscrit quand le formulaire contient une erreur", () => {
    // Etat de depart : 1 utilisateur deja inscrit (on pre-remplit le localStorage,
    // puis on recharge pour que l'app le relise au montage via loadRegistrants()).
    const existant = [{
      id: 'reg_seed_1',
      nom: 'Curie', prenom: 'Marie', email: 'marie@example.com',
      dateNaissance: '1980-01-01', ville: 'Paris', codePostal: '75005',
    }];
    cy.window().then((win) => {
      win.localStorage.setItem('registrants', JSON.stringify(existant));
    });
    cy.reload();
    cy.get('ul li').should('have.length', 1); // 1 inscrit au depart

    // Page de formulaire : ajout d'un nouvel utilisateur AVEC erreur
    // (tous les champs remplis pour activer le bouton, mais code postal invalide).
    cy.get('#nom').type('Bremaud');
    cy.get('#prenom').type('Benoit');
    cy.get('#email').type('benoit@example.com');
    cy.get('#dateNaissance').type('1990-01-01');
    cy.get('#ville').type('Paris');
    cy.get('#codePostal').type('abc');
    cy.contains("S'inscrire").click();

    // Retour accueil : toast d'erreur + toujours 1 inscrit.
    cy.get('.toast--error').contains('Le formulaire contient des erreurs.');
    cy.get('ul li').should('have.length', 1);
  });
});
