import axios from 'axios';

import { createRegistrant, fetchRegistrants } from './api';

// Remplace tout le module axios par des fonctions simulees (jest.fn()).
jest.mock('axios');

const API_URL = 'https://jsonplaceholder.typicode.com';

describe('api', () => {
  // On masque les console.error attendus (les fonctions loguent avant de
  // relancer) pour garder une sortie de test propre, et on reset les mocks.
  let consoleErrorSpy;
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('fetchRegistrants', () => {
    it('retourne les inscrits en cas de succes', async () => {
      const registrants = [{ id: 1, nom: 'a', prenom: 'b', email: 'c@c.fr' }];
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: registrants }));

      await expect(fetchRegistrants()).resolves.toEqual(registrants);
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/users`);
    });

    it("propage l'erreur en cas d'echec", async () => {
      const errorMessage = 'Network Error';
      axios.get.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

      await expect(fetchRegistrants()).rejects.toThrow(errorMessage);
    });
  });

  describe('createRegistrant', () => {
    it("cree et retourne l'inscrit en cas de succes", async () => {
      const payload = { nom: 'Bremaud', prenom: 'Benoit', email: 'b@b.fr' };
      const created = { id: 11, ...payload };
      axios.post.mockImplementationOnce(() => Promise.resolve({ data: created }));

      await expect(createRegistrant(payload)).resolves.toEqual(created);
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/users`, payload);
    });

    it("propage l'erreur en cas d'echec", async () => {
      const errorMessage = 'Network Error';
      axios.post.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

      await expect(createRegistrant({})).rejects.toThrow(errorMessage);
    });
  });
});
