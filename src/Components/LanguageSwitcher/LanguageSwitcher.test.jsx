import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { describe, it, beforeEach, vi, expect } from 'vitest';

// Mock the react-i18next library
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn()
}));

describe('LanguageSwitcher', () => {
  // Setup default mocks before each test
  let changeLanguageMock;
  
  beforeEach(() => {
    changeLanguageMock = vi.fn();
    
    // Mock the return values from useTranslation
    useTranslation.mockReturnValue({
      t: vi.fn(key => key), // Just return the key for simplicity
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
    
    const englishButton = screen.getByText(/🇺🇸/);
    fireEvent.click(englishButton);
    
    expect(changeLanguageMock).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage with "ar" when Arabic button is clicked', () => {
    render(<LanguageSwitcher />);
    
    const arabicButton = screen.getByText(/🇸🇦/);
    fireEvent.click(arabicButton);
    
    expect(changeLanguageMock).toHaveBeenCalledWith('ar');
  });

  it('sets document direction to rtl when switching to Arabic', () => {
    const originalDocumentElement = document.documentElement;
    const mockDocumentElement = { dir: 'ltr' };
    
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true
    });
    
    render(<LanguageSwitcher />);
    
    const arabicButton = screen.getByText(/🇸🇦/);
    fireEvent.click(arabicButton);
    
    expect(document.documentElement.dir).toBe('rtl');
    
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true
    });
  });

  it('sets document direction to ltr when switching to English', () => {
    const originalDocumentElement = document.documentElement;
    const mockDocumentElement = { dir: 'rtl' };
    
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true
    });
    
    render(<LanguageSwitcher />);
    
    const englishButton = screen.getByText(/🇺🇸/);
    fireEvent.click(englishButton);
    
    expect(document.documentElement.dir).toBe('ltr');
    
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true
    });
  });
});
