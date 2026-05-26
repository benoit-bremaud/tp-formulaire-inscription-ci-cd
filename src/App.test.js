import { act, fireEvent, render, screen } from '@testing-library/react';

import { App, validateForm } from './App';

afterEach(() => {
  localStorage.clear();
  jest.useRealTimers();
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

    test('exposes a link to the documentation', () => {
      render(<App />);

      const docLink = screen.getByRole('link', { name: /documentation/i });
      expect(docLink).toBeInTheDocument();
      // PUBLIC_URL is '' in the test environment, so the href resolves to the
      // exact docs path — this also guards against an `undefined/docs/...` value.
      expect(docLink).toHaveAttribute('href', '/docs/index.html');
    });

    test('submit button becomes enabled once every field is filled', () => {
      render(<App />);
      fillFormWithValidValues();

      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeEnabled();
    });

    test('hides the success toast after the configured duration', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-05-07T00:00:00Z'));

      render(<App />);
      fillFormWithValidValues();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      // Toast is visible right after a successful submit.
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Advance the fake timers past the toast duration. act(...) is required
      // because the timeout callback triggers a setState call inside the
      // component; without act React would warn that the update was not
      // flushed before our next assertion.
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Toast must have been hidden (and the useEffect cleanup must have
      // been invoked along the way to clear the no-longer-needed timer).
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('submitting a valid form shows toast, clears fields, lists the registrant, and persists to localStorage', () => {
      // Freeze time so the isAdult check inside validateForm is deterministic.
      jest.useFakeTimers().setSystemTime(new Date('2026-05-07T00:00:00Z'));

      render(<App />);
      fillFormWithValidValues();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      // 1) Toast is visible with the success message.
      expect(screen.getByRole('alert')).toHaveTextContent(/inscription réussie/i);

      // 2) Form fields are reset to empty.
      expect(screen.getByLabelText('Nom')).toHaveValue('');
      expect(screen.getByLabelText('Prénom')).toHaveValue('');
      expect(screen.getByLabelText('Email')).toHaveValue('');
      expect(screen.getByLabelText('Date de naissance')).toHaveValue('');
      expect(screen.getByLabelText('Ville')).toHaveValue('');
      expect(screen.getByLabelText('Code postal')).toHaveValue('');

      // 3) The registrant is rendered in the list.
      expect(screen.getByText(/Benoit Bremaud/)).toBeInTheDocument();
      expect(screen.getByText(/benoit@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/Grasse/)).toBeInTheDocument();
      expect(screen.getByText(/06130/)).toBeInTheDocument();

      // 4) localStorage holds the persisted registrant with a generated id.
      const stored = JSON.parse(localStorage.getItem('registrants'));
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        nom: 'Bremaud',
        prenom: 'Benoit',
        email: 'benoit@example.com',
        dateNaissance: '1981-05-22',
        ville: 'Grasse',
        codePostal: '06130',
      });
      expect(stored[0].id).toMatch(/^reg_/);
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

    test('shows an error toast on invalid submit and hides it after the duration', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-05-07T00:00:00Z'));

      render(<App />);
      fillFormWithInvalidValues();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      // An error toast is shown (in red) alongside the per-field errors.
      const toast = screen.getByRole('alert');
      expect(toast).toHaveTextContent(/le formulaire contient des erreurs/i);
      expect(toast).toHaveClass('toast--error');
      expect(screen.getByText('Nom invalide')).toHaveClass('error');

      // The error toast auto-hides after the configured duration.
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
  describe('App component', () => {
    test('loads existing registrants from localStorage on mount', () => {
      const existing = [
        {
          id: 'reg_seed_1',
          nom: 'Dupont',
          prenom: 'Alice',
          email: 'alice@example.com',
          dateNaissance: '1990-01-01',
          ville: 'Lyon',
          codePostal: '69001',
        },
        {
          id: 'reg_seed_2',
          nom: 'Martin',
          prenom: 'Bob',
          email: 'bob@example.com',
          dateNaissance: '1985-06-15',
          ville: 'Marseille',
          codePostal: '13001',
        },
      ];
      localStorage.setItem('registrants', JSON.stringify(existing));

      render(<App />);

      expect(screen.getByText(/Alice Dupont/)).toBeInTheDocument();
      expect(screen.getByText(/Bob Martin/)).toBeInTheDocument();
    });

    test('tolerates corrupted localStorage data and starts with an empty list', () => {
      // Persist a payload that JSON.parse cannot handle, simulating a
      // corrupted entry from another tab, a misbehaving extension, or
      // a partial write. loadRegistrants should swallow the parse error
      // and fall back to an empty list rather than crashing the App.
      localStorage.setItem('registrants', 'not valid json {{{');

      render(<App />);

      expect(screen.getByText(/aucun inscrit pour le moment/i)).toBeInTheDocument();
    });

    test('backfills missing ids when loading legacy registrants from a previous version', () => {
      // Freeze time so the new submission below is deterministic.
      jest.useFakeTimers().setSystemTime(new Date('2026-05-07T00:00:00Z'));

      // Legacy registrant: no id field, simulating data persisted before
      // generateId was introduced in App.js.
      const legacy = [
        {
          nom: 'Dupont',
          prenom: 'Alice',
          email: 'alice@example.com',
          dateNaissance: '1990-01-01',
          ville: 'Lyon',
          codePostal: '69001',
        },
      ];
      localStorage.setItem('registrants', JSON.stringify(legacy));

      render(<App />);

      // Legacy registrant is still rendered correctly.
      expect(screen.getByText(/Alice Dupont/)).toBeInTheDocument();

      // Trigger a save by submitting a new valid registrant. After save,
      // localStorage should hold both the legacy entry (with a backfilled
      // id) and the newly created entry.
      fillFormWithValidValues();
      fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

      const stored = JSON.parse(localStorage.getItem('registrants'));
      expect(stored).toHaveLength(2);
      expect(stored[0].id).toMatch(/^reg_/);
      expect(stored[1].id).toMatch(/^reg_/);
    });
  });
});
