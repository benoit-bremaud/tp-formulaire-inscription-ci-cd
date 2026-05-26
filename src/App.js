import './App.css';

import { useEffect, useState } from 'react';

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
const STORAGE_KEY = 'registrants';

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

function loadRegistrants() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // Backfill ids for records persisted before id was introduced so that
    // list keys remain unique and stable across renders.
    return parsed.map((registrant) =>
      registrant.id ? registrant : { ...registrant, id: generateId() }
    );
  } catch {
    return [];
  }
}

function saveRegistrants(registrants) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrants));
  } catch {
    // localStorage unavailable (quota, private mode); silently ignore
  }
}

function generateId() {
  return `reg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToastVisible, setErrorToastVisible] = useState(false);
  // Bumped on every invalid submit so the auto-hide timer restarts even when
  // the error toast is already visible (repeated invalid submits within 3s).
  const [errorToastNonce, setErrorToastNonce] = useState(0);
  const [registrants, setRegistrants] = useState(loadRegistrants);

  useEffect(() => {
    if (!toastVisible) return undefined;
    const timerId = setTimeout(() => setToastVisible(false), TOAST_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [toastVisible]);

  useEffect(() => {
    if (!errorToastVisible) return undefined;
    const timerId = setTimeout(() => setErrorToastVisible(false), TOAST_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [errorToastVisible, errorToastNonce]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const registrant = { ...form, id: generateId() };
      const updated = [...registrants, registrant];
      setRegistrants(updated);
      saveRegistrants(updated);
      setForm(EMPTY_FORM);
      setErrorToastVisible(false);
      setToastVisible(true);
    } else {
      setToastVisible(false);
      setErrorToastVisible(true);
      setErrorToastNonce((n) => n + 1);
    }
  };

  const isFormIncomplete = Object.values(form).some((value) => !value);

  return (
    <div className="App">
      <h1>Inscription</h1>

      {toastVisible && (
        <div role="alert" className="toast">
          Inscription réussie !
        </div>
      )}

      {errorToastVisible && (
        <div role="alert" className="toast toast--error">
          Le formulaire contient des erreurs.
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

      <h2>Liste des inscrits</h2>
      {registrants.length === 0 ? (
        <p>Aucun inscrit pour le moment.</p>
      ) : (
        <ul>
          {registrants.map((registrant) => (
            <li key={registrant.id}>
              {registrant.prenom} {registrant.nom}, {registrant.email} ({registrant.ville}, {registrant.codePostal})
            </li>
          ))}
        </ul>
      )}

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
