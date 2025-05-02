import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import AskQuestion from './AskQuestion';

// Mock the react-i18next hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'AskAQuestion': 'Ask a Question',
        'Ask a Question with an Expert': 'Ask a Question with an Expert',
        'Have questions about our labs or services or about Symptoms? Our experts are here to help! Get immediate assistance or schedule a consultation.': 'Have questions about our labs or services or about Symptoms? Our experts are here to help! Get immediate assistance or schedule a consultation.',
        'Ask a Question Now': 'Ask a Question Now'
      };
      return translations[key] || key;
    }
  })
}));

// Mock the SVG import
vi.mock('../../assets/patient.svg', () => ({
  default: 'mocked-svg-url'
}));

// Custom render function with Router wrapper
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AskQuestion Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    renderWithRouter(<AskQuestion />);
    
    // Check if the header text is present
    expect(screen.getByText('Ask a Question')).toBeInTheDocument();
    expect(screen.getByText('Ask a Question with an Expert')).toBeInTheDocument();
    
    // Check if the description text is present
    expect(screen.getByText(/Have questions about our labs or services/i)).toBeInTheDocument();
    
    // Check if the CTA button is present
    expect(screen.getByText('Ask a Question Now')).toBeInTheDocument();
    
    // Check if the image is rendered
    const image = screen.getByAltText('Ask a Question');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe('mocked-svg-url');
  });

  it('contains a link to the ask-question page', () => {
    renderWithRouter(<AskQuestion />);
    
    const link = screen.getByRole('link', { name: /Ask a Question Now/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/ask-question');
  });

  it('has the correct styling for the CTA button', () => {
    renderWithRouter(<AskQuestion />);
    
    const button = screen.getByRole('link', { name: /Ask a Question Now/i });
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('rounded-xl');
  });

  it('has the correct styling for the header', () => {
    renderWithRouter(<AskQuestion />);
    
    const header = screen.getByText('Ask a Question with an Expert');
    expect(header).toHaveClass('text-4xl');
    expect(header).toHaveClass('md:text-5xl');
    expect(header).toHaveClass('bg-gradient-to-r');
    expect(header).toHaveClass('text-transparent');
  });
});