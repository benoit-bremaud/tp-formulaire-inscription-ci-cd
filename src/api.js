import axios from 'axios';

// URL de l'API tierce, injectee via variable d'environnement (configuree pour
// les tests au slide 24, et via .env pour l'app). On centralise ici les appels
// reseau pour qu'ils soient isoles et testables (mock d'axios).
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Recupere la liste des inscrits depuis l'API.
 * @returns {Promise<object[]>} Le tableau des inscrits.
 */
export const fetchRegistrants = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Cree un inscrit via l'API.
 * @param {object} registrant - Les donnees de l'inscrit a creer.
 * @returns {Promise<object>} L'inscrit cree (renvoye par l'API).
 */
export const createRegistrant = async (registrant) => {
  try {
    const response = await axios.post(`${API_URL}/users`, registrant);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
