import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, test, beforeEach, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import FAQSection from './FAQ';

// Mock the react-i18next module
jest.mock('react-i18next', () => ({
  // This mock function returns an object with t and i18n
  useTranslation: () => ({
    t: (key) => key, // Simply return the key as the translation
    i18n: {
      changeLanguage: () => {} // Empty function instead of jest.fn()
    }
  })
}));

// Mock the image import
jest.mock('../../assets/Group-112.png', () => 'mocked-image-path');

describe('FAQSection Component', () => {
  beforeEach(() => {
    render(<FAQSection />);
  });

  test('renders FAQ section with title', () => {
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  test('renders all FAQ questions', () => {
    const questions = [
      'What services does Delma ProHealth offer?',
      'How do I schedule an appointment with ProHealth?',
      'Do you accept insurance?',
      'What should I bring to my appointment?',
      'How do I request a prescription refill?'
    ];

    questions.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  test('toggles FAQ answer visibility when clicking question', () => {
    const firstQuestion = screen.getByText('What services does Delma ProHealth offer?');
    
    // Initially answer should not be visible
    expect(screen.queryByText(/Delma ProHealth offers a wide range/)).not.toBeInTheDocument();
    
    // Click to show answer
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/Delma ProHealth offers a wide range/)).toBeInTheDocument();
    
    // Click again to hide answer
    fireEvent.click(firstQuestion);
    expect(screen.queryByText(/Delma ProHealth offers a wide range/)).not.toBeInTheDocument();
  });

  test('only one FAQ can be open at a time', () => {
    const firstQuestion = screen.getByText('What services does Delma ProHealth offer?');
    const secondQuestion = screen.getByText('How do I schedule an appointment with ProHealth?');
    
    // Open first FAQ
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/Delma ProHealth offers a wide range/)).toBeInTheDocument();
    
    // Open second FAQ
    fireEvent.click(secondQuestion);
    // First FAQ should be closed
    expect(screen.queryByText(/Delma ProHealth offers a wide range/)).not.toBeInTheDocument();
    // Second FAQ should be open
    expect(screen.getByText(/Do you accept insurance/)).toBeInTheDocument();
  });

  test('renders FAQ image', () => {
    // The image is hidden on mobile screens with "hidden" class but appears on lg screens
    const image = screen.getByAltText('Group');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-image-path');
    
    // Check the appropriate classes for responsive behavior
    expect(image).toHaveClass('hidden'); // It's hidden by default
    expect(image).toHaveClass('lg:flex'); // Shown on lg screens
    expect(image).toHaveClass('max-w-sm');
    expect(image).toHaveClass('md:max-w-md');
  });
});