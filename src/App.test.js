import { fireEvent, render, screen } from '@testing-library/react';

import { App } from './App';

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

describe('App initial render', () => {
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
});

describe('App submit button state', () => {
  test('is disabled when the form is empty', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeDisabled();
  });

  test('becomes enabled once every field is filled', () => {
    render(<App />);
    fillFormWithValidValues();

    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeEnabled();
  });
});
