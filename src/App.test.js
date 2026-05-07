import { fireEvent, render, screen } from '@testing-library/react';

import { App, validateForm } from './App';

afterEach(() => {
  localStorage.clear();
});

/**
 * Fills every field of the form with valid values so we can isolate the
 * specific behaviour each test wants to assert (button enabling, toast,
 * persistence, etc.).
 */
function fillFormWithValidValues() {
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Bremaud' } });
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Benoit' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'benoit@example.com' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1981-05-22' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Grasse' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '06130' } });
}

describe('happy path', () => {
  describe('App component', () => {
    test('renders all form fields with their labels', () => {
      render(<App />);

      expect(screen.getByLabelText('Nom')).toBeInTheDocument();
      expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
      expect(screen.getByLabelText('Ville')).toBeInTheDocument();
      expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
    });

    test('submit button becomes enabled once every field is filled', () => {
      render(<App />);
      fillFormWithValidValues();

      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeEnabled();
    });
  });

  describe('validateForm', () => {
    test('returns an empty errors object when the form is valid', () => {
      const validForm = {
        nom: 'Bremaud',
        prenom: 'Benoit',
        email: 'benoit@example.com',
        dateNaissance: '1981-05-22',
        ville: 'Grasse',
        codePostal: '06130',
      };

      expect(validateForm(validForm)).toEqual({});
    });
  });
});

describe('sad path', () => {
  describe('App component', () => {
    test('submit button is disabled when the form is empty', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeDisabled();
    });
  });

  describe('validateForm', () => {
    test('returns errors for every field when the form is empty', () => {
      const emptyForm = {
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        ville: '',
        codePostal: '',
      };

      expect(validateForm(emptyForm)).toEqual({
        nom: 'Nom invalide',
        prenom: 'Prénom invalide',
        email: 'Email invalide',
        dateNaissance: 'Vous devez avoir au moins 18 ans',
        ville: 'Ville invalide',
        codePostal: 'Code postal invalide (5 chiffres attendus)',
      });
    });

    test('returns the dateNaissance error when the user is under 18', () => {
      const today = new Date();
      const seventeenYearsAgo = new Date(
        today.getFullYear() - 17,
        today.getMonth(),
        today.getDate(),
      );
      const isoDate = seventeenYearsAgo.toISOString().split('T')[0];

      const formWithMinor = {
        nom: 'Bremaud',
        prenom: 'Benoit',
        email: 'benoit@example.com',
        dateNaissance: isoDate,
        ville: 'Grasse',
        codePostal: '06130',
      };

      expect(validateForm(formWithMinor)).toEqual({
        dateNaissance: 'Vous devez avoir au moins 18 ans',
      });
    });
  });
});

describe('edge cases', () => {
  // Reserved for boundary scenarios such as legacy registrants in localStorage,
  // accent-heavy names, leap-year dates, etc. Filled in upcoming PRs.
});
