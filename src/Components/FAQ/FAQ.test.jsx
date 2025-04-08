import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import FAQSection from './FAQ';
import { CircleChevronDown, CircleChevronUp } from 'lucide-react';

// Mock the react-i18next module
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => {}
    }
  })
}));

// Mock the image import - fixed to return an object with default
vi.mock('../../assets/Group-112.png', () => ({
  default: 'mocked-image-path'
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  CircleChevronDown: () => <div data-testid="chevron-down" />,
  CircleChevronUp: () => <div data-testid="chevron-up" />
}));

describe('FAQSection Component', () => {
  beforeEach(() => {
    render(<FAQSection />);
  });

  it('renders FAQ section with title', () => {
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
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

  it('toggles FAQ answer visibility when clicking question', () => {
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

  it('only one FAQ can be open at a time', () => {
    const firstQuestion = screen.getByText('What services does Delma ProHealth offer?');
    const secondQuestion = screen.getByText('How do I schedule an appointment with ProHealth?');
    
    // Open first FAQ
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/Delma ProHealth offers a wide range/)).toBeInTheDocument();
    
    // Open second FAQ
    fireEvent.click(secondQuestion);
    // First FAQ should be closed
    expect(screen.queryByText(/Delma ProHealth offers a wide range/)).not.toBeInTheDocument();
    // Second FAQ should be open - use a more specific query
    const answerParagraphs = screen.getAllByText(/schedule an appointment with ProHealth/);
    expect(answerParagraphs[1]).toBeInTheDocument(); // Get the second occurrence (the answer)
  });

  it('renders FAQ image with correct attributes', () => {
    const image = screen.getByAltText('Group');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-image-path');
    
    // Check if image has the expected classes
    expect(image).toHaveClass('max-w-sm');
    expect(image).toHaveClass('md:max-w-md');
    expect(image).toHaveClass('lg:flex');
    expect(image).toHaveClass('hidden');
  });

  it('toggles chevron icons correctly', () => {
    const firstQuestion = screen.getByText('What services does Delma ProHealth offer?');
    
    // Initially should show chevron up (closed state)
    expect(screen.getAllByTestId('chevron-up').length).toBeGreaterThan(0);
    
    // Click to open FAQ
    fireEvent.click(firstQuestion);
    
    // Now should show chevron down (open state)
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });
});