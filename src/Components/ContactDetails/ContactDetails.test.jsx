import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import ContactDetails from './ContactDetails';

// Mock the react-i18next hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'findUsHere': 'Find Us Here',
        'Phone': 'Phone',
        'Email': 'Email',
        'Location': 'Location'
      };
      return translations[key];
    }
  })
}));

describe('ContactDetails Component', () => {
  test('renders main title', () => {
    render(<ContactDetails />);
    expect(screen.getByText('Find Us Here')).toBeInTheDocument();
  });

  test('renders all three contact cards', () => {
    render(<ContactDetails />);
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(3);
  });

  test('displays correct contact information', () => {
    render(<ContactDetails />);
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('hellocallcenter@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('123 Anywhere St., Any City, 12345')).toBeInTheDocument();
  });

  test('renders all icons with correct aria-labels', () => {
    render(<ContactDetails />);
    expect(screen.getByLabelText('phone')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('location')).toBeInTheDocument();
  });

  test('renders google maps iframe', () => {
    render(<ContactDetails />);
    const iframe = screen.getByTitle('Google Map');
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName.toLowerCase()).toBe('iframe');
  });

  test('renders translated content', () => {
    render(<ContactDetails />);
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  test('applies correct layout classes', () => {
    const { container } = render(<ContactDetails />);
    
    // Check container classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('container', 'mx-auto', 'p-4');

    // Check grid layout
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-3', 'gap-4');

    // Check map container
    const mapContainer = container.querySelector('.w-full.h-\\[500px\\]');
    expect(mapContainer).toBeInTheDocument();
  });
});