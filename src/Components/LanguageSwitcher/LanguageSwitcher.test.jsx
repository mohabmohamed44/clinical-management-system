import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// Mock the react-i18next library
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));

describe('LanguageSwitcher', () => {
  // Setup default mocks before each test
  let changeLanguageMock;
  
  beforeEach(() => {
    changeLanguageMock = jest.fn();
    
    // Mock the return values from useTranslation
    useTranslation.mockReturnValue({
      t: jest.fn(key => key), // Just return the key for simplicity
      i18n: {
        changeLanguage: changeLanguageMock
      }
    });
  });

  it('renders both language buttons', () => {
    render(<LanguageSwitcher />);
    
    // Check if both buttons are rendered
    const englishButton = screen.getByText(/🇺🇸/);
    const arabicButton = screen.getByText(/🇸🇦/);
    
    expect(englishButton).toBeInTheDocument();
    expect(arabicButton).toBeInTheDocument();
  });

  it('calls changeLanguage with "en" when English button is clicked', () => {
    render(<LanguageSwitcher />);
    
    // Find and click the English button
    const englishButton = screen.getByText(/🇺🇸/);
    fireEvent.click(englishButton);
    
    // Verify changeLanguage was called with 'en'
    expect(changeLanguageMock).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage with "ar" when Arabic button is clicked', () => {
    render(<LanguageSwitcher />);
    
    // Find and click the Arabic button
    const arabicButton = screen.getByText(/🇸🇦/);
    fireEvent.click(arabicButton);
    
    // Verify changeLanguage was called with 'ar'
    expect(changeLanguageMock).toHaveBeenCalledWith('ar');
  });

  it('sets document direction to rtl when switching to Arabic', () => {
    // Save the original document.documentElement
    const originalDocumentElement = document.documentElement;
    
    // Create a mock documentElement
    const mockDocumentElement = { dir: 'ltr' };
    
    // Replace document.documentElement with the mock
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true
    });
    
    render(<LanguageSwitcher />);
    
    // Find and click the Arabic button
    const arabicButton = screen.getByText(/🇸🇦/);
    fireEvent.click(arabicButton);
    
    // Verify the direction was set to 'rtl'
    expect(document.documentElement.dir).toBe('rtl');
    
    // Restore the original document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true
    });
  });

  it('sets document direction to ltr when switching to English', () => {
    // Save the original document.documentElement
    const originalDocumentElement = document.documentElement;
    
    // Create a mock documentElement and set it to rtl initially
    const mockDocumentElement = { dir: 'rtl' };
    
    // Replace document.documentElement with the mock
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true
    });
    
    render(<LanguageSwitcher />);
    
    // Find and click the English button
    const englishButton = screen.getByText(/🇺🇸/);
    fireEvent.click(englishButton);
    
    // Verify the direction was set to 'ltr'
    expect(document.documentElement.dir).toBe('ltr');
    
    // Restore the original document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true
    });
  });
});