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

/**
 * Fills every field of the form with non-empty but invalid values so the
 * submit button is enabled (no field is empty) but every validator rejects.
 * Used to exercise the error-display path of the form.
 */
function fillFormWithInvalidValues() {
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Jean123' } });
  fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Marie@' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'plop' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2020-01-01' } });
  fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris1' } });
  fireEvent.change(screen.getByLabelText('Code postal'), { target: { value: '1234' } });
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
    afterEach(() => {
      jest.useRealTimers();
    });

    test('submit button is disabled when the form is empty', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeDisabled();
    });

    test('displays an error message under each field when the form is submitted with invalid values', () => {
      // Freeze time so the under-18 birth date assertion is deterministic.
      jest.useFakeTimers().setSystemTime(new Date('2026-05-07T00:00:00Z'));

      render(<App />);
      fillFormWithInvalidValues();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      const expectedErrors = [
        'Nom invalide',
        'Prénom invalide',
        'Email invalide',
        'Vous devez avoir au moins 18 ans',
        'Ville invalide',
        'Code postal invalide (5 chiffres attendus)',
      ];

      for (const message of expectedErrors) {
        const errorElement = screen.getByText(message);
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass('error');
      }
    });
  });

  describe('validateForm', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

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
      // Freeze time so the assertion does not depend on the machine clock or
      // local timezone. The fixed birth date below is exactly 17 years before
      // the frozen system time, which guarantees the user is under 18.
      jest.useFakeTimers().setSystemTime(new Date('2026-05-07T00:00:00Z'));

      const formWithMinor = {
        nom: 'Bremaud',
        prenom: 'Benoit',
        email: 'benoit@example.com',
        dateNaissance: '2009-05-07',
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
