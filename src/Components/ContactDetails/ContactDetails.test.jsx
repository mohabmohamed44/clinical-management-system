import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import ContactDetails from './ContactDetails';

// Mock the react-i18next hook
vi.mock('react-i18next', () => ({
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
  beforeEach(() => {
    render(<ContactDetails />);
  });

  describe('Content Rendering', () => {
    test('should render main title', () => {
      expect(screen.getByText('Find Us Here')).toBeInTheDocument();
    });

    test('should render all three contact cards', () => {
      const cards = screen.getAllByRole('heading', { level: 3 });
      expect(cards).toHaveLength(3);
    });

    test('should display correct contact information', () => {
      const expectedContacts = [
        '123-456-7890',
        'hellocallcenter@gmail.com',
        '123 Anywhere St., Any City, 12345'
      ];

      expectedContacts.forEach(contact => {
        expect(screen.getByText(contact)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should render all icons with correct aria-labels', () => {
      const expectedLabels = ['phone', 'email', 'location'];
      
      expectedLabels.forEach(label => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      });
    });

    test('should render google maps iframe with title', () => {
      const iframe = screen.getByTitle('Google Map');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveProperty('tagName', 'IFRAME');
    });
  });

  describe('Translations', () => {
    test('should render translated content correctly', () => {
      const translatedTexts = ['Phone', 'Email', 'Location'];
      
      translatedTexts.forEach(text => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
  });

  describe('Layout', () => {
    test('should apply correct layout classes', () => {
      const { container } = render(<ContactDetails />);
      
      expect(container.firstChild).toHaveClass('container', 'mx-auto', 'p-4');
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-3', 'gap-4');
      
      const mapContainer = container.querySelector('.w-full');
      expect(mapContainer).toBeInTheDocument();
    });
  });
});