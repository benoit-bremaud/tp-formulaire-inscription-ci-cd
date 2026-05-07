import './App.css';

import { isAdult, isValidEmail, isValidName, isValidPostalCode } from './validators';

import { useState } from 'react';

function App() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    ville: '',
    codePostal: '',
  });
  const [errors, setErrors] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [registrants, setRegistrants] = useState(() => {
    const saved = localStorage.getItem('registrants');
    return saved ? JSON.parse(saved) : [];
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!isValidName(form.nom)) {
      newErrors.nom = 'Nom invalide';
    }
    if (!isValidName(form.prenom)) {
      newErrors.prenom = 'Prénom invalide';
    }
    if (!isValidEmail(form.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!form.dateNaissance || !isAdult(new Date(form.dateNaissance))) {
      newErrors.dateNaissance = 'Vous devez avoir au moins 18 ans';
    }
    if (!isValidName(form.ville)) {
      newErrors.ville = 'Ville invalide';
    }
    if (!isValidPostalCode(form.codePostal)) {
      newErrors.codePostal = 'Code postal invalide (5 chiffres attendus)';
    }

    if (Object.keys(newErrors).length === 0) {
      // formulaire valide
      const updated = [...registrants, form];
      setRegistrants(updated);
      localStorage.setItem('registrants', JSON.stringify(updated));

      setForm({
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        ville: '',
        codePostal: '',
      });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }


    setErrors(newErrors);
  };

  return (
    <div className="App">
      <h1>Inscription</h1>

      {toastVisible && (
        <div role="alert" className="toast">
          Inscription réussie !
        </div>
      )}

      <form onSubmit={handleSubmit}>

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

        <button type="submit" disabled={Object.values(form).some(value => !value)}>S'inscrire</button>
      </form>

      <h2>Liste des inscrits</h2>
        {registrants.length === 0 ? (
          <p>Aucun inscrit pour le moment.</p>
        ) : (
          <ul>
            {registrants.map((r, index) => (
              <li key={index}>
                {r.prenom} {r.nom} — {r.email} ({r.ville}, {r.codePostal})
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default App;
