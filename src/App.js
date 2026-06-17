import './App.css';

import { useEffect, useState } from 'react';

import { createRegistrant, fetchRegistrants } from './api';
import { isAdult, isValidEmail, isValidName, isValidPostalCode } from './validators';

export const EMPTY_FORM = {
  nom: '',
  prenom: '',
  email: '',
  dateNaissance: '',
  ville: '',
  codePostal: '',
};

export const ERROR_MESSAGES = {
  nom: 'Nom invalide',
  prenom: 'Prénom invalide',
  email: 'Email invalide',
  dateNaissance: 'Vous devez avoir au moins 18 ans',
  ville: 'Ville invalide',
  codePostal: 'Code postal invalide (5 chiffres attendus)',
};

const TOAST_DURATION_MS = 3000;
const VALIDATION_ERROR = 'Le formulaire contient des erreurs.';
const NETWORK_ERROR = 'Erreur reseau, reessayez plus tard.';

/**
 * Validates a registration form and returns an errors object.
 * @param {object} form - Form values keyed by field name.
 * @returns {object} Errors keyed by field name; empty object means valid.
 */
export function validateForm(form) {
  const errors = {};
  if (!isValidName(form.nom)) {
    errors.nom = ERROR_MESSAGES.nom;
  }
  if (!isValidName(form.prenom)) {
    errors.prenom = ERROR_MESSAGES.prenom;
  }
  if (!isValidEmail(form.email)) {
    errors.email = ERROR_MESSAGES.email;
  }
  if (!form.dateNaissance || !isAdult(new Date(form.dateNaissance))) {
    errors.dateNaissance = ERROR_MESSAGES.dateNaissance;
  }
  if (!isValidName(form.ville)) {
    errors.ville = ERROR_MESSAGES.ville;
  }
  if (!isValidPostalCode(form.codePostal)) {
    errors.codePostal = ERROR_MESSAGES.codePostal;
  }
  return errors;
}

export function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [count, setCount] = useState(0);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // Bumped on every error so the auto-hide timer restarts even when the error
  // toast is already visible (repeated failing submits within the duration).
  const [errorNonce, setErrorNonce] = useState(0);

  // Charge le nombre d'inscrits depuis l'API au montage.
  useEffect(() => {
    fetchRegistrants()
      .then((registrants) => setCount(registrants.length))
      .catch(() => {
        // Erreur reseau au chargement : on garde le compteur a 0.
      });
  }, []);

  useEffect(() => {
    if (!successVisible) return undefined;
    const timerId = setTimeout(() => setSuccessVisible(false), TOAST_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [successVisible]);

  useEffect(() => {
    if (!errorMessage) return undefined;
    const timerId = setTimeout(() => setErrorMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [errorMessage, errorNonce]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showError = (message) => {
    setSuccessVisible(false);
    setErrorMessage(message);
    setErrorNonce((n) => n + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showError(VALIDATION_ERROR);
      return;
    }

    try {
      await createRegistrant(form);
      setCount((current) => current + 1);
      setForm(EMPTY_FORM);
      setErrorMessage(null);
      setSuccessVisible(true);
    } catch {
      showError(NETWORK_ERROR);
    }
  };

  const isFormIncomplete = Object.values(form).some((value) => !value);

  return (
    <div className="App">
      <h1>Inscription</h1>

      {successVisible && (
        <div role="alert" className="toast">
          Inscription réussie !
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="toast toast--error">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange} />
          {errors.nom && <span className="error">{errors.nom}</span>}
        </div>

        <div>
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" type="text" value={form.prenom} onChange={handleChange} />
          {errors.prenom && <span className="error">{errors.prenom}</span>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="dateNaissance">Date de naissance</label>
          <input id="dateNaissance" name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} />
          {errors.dateNaissance && <span className="error">{errors.dateNaissance}</span>}
        </div>

        <div>
          <label htmlFor="ville">Ville</label>
          <input id="ville" name="ville" type="text" value={form.ville} onChange={handleChange} />
          {errors.ville && <span className="error">{errors.ville}</span>}
        </div>

        <div>
          <label htmlFor="codePostal">Code postal</label>
          <input id="codePostal" name="codePostal" type="text" value={form.codePostal} onChange={handleChange} />
          {errors.codePostal && <span className="error">{errors.codePostal}</span>}
        </div>

        <button type="submit" disabled={isFormIncomplete}>
          S'inscrire
        </button>
      </form>

      <p>{count} inscrit(s)</p>

      <footer className="app-footer">
        <a
          href={`${process.env.PUBLIC_URL}/docs/index.html`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </footer>
    </div>
  );
}
