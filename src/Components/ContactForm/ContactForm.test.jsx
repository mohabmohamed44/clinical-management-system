import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from './ContactForm';

// Mock the react-i18n module
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'ContactUs': 'Contact Us',
        'Name': 'Name',
        'Email': 'Email',
        'Subject': 'Subject',
        'Message': 'Message',
        'SendMessage': 'Send Message'
      };
      return translations[key] || key;
    },
    i18n: {
      dir: () => 'ltr', // Default to left-to-right for tests
      language: 'en'
    }
  })
}));

describe('ContactForm Component', () => {
  test('renders form with all required fields', () => {
    render(<ContactForm />);
    
    // Check form heading
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    
    // Check form fields - using the htmlFor attribute to find labels
    const nameLabel = screen.getByText('Name');
    const emailLabel = screen.getByText('Email');
    const subjectLabel = screen.getByText('Subject');
    const messageLabel = screen.getByText('Message');
    
    expect(nameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(subjectLabel).toBeInTheDocument();
    expect(messageLabel).toBeInTheDocument();
    
    // Find inputs by their id (which matches the htmlFor attribute of labels)
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    
    // Check submit button
    const submitButton = screen.getByText('Send Message', { exact: false });
    expect(submitButton).toBeInTheDocument();
  });

  test('updates form data when user types in fields', () => {
    render(<ContactForm />);
    
    // Fill in form fields
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const subjectInput = screen.getByRole('textbox', { name: /subject/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message.' } });
    
    // Verify inputs have correct values
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(subjectInput.value).toBe('Test Subject');
    expect(messageInput.value).toBe('This is a test message.');
  });

  test('submits form with correct data', () => {
    // Mock console.log to verify form submission
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<ContactForm />);
    
    // Fill in form fields
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const subjectInput = screen.getByRole('textbox', { name: /subject/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message.' } });
    
    // Submit the form - find the form element and trigger submit
    const form = screen.getByText('Contact Us').closest('div').querySelector('form');
    fireEvent.submit(form);
    
    // Verify form submission
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message.'
    });
    
    consoleSpy.mockRestore();
  });

  test('fields are required', () => {
    render(<ContactForm />);
    
    // Check that the required attribute is present on all inputs
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const subjectInput = screen.getByRole('textbox', { name: /subject/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    
    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(subjectInput).toHaveAttribute('required');
    expect(messageInput).toHaveAttribute('required');
  });

  test('includes direction attributes from i18n', () => {
    render(<ContactForm />);
    
    // Check if the main container has direction attribute
    const containerDiv = screen.getByText('Contact Us').closest('div').parentElement;
    expect(containerDiv).toHaveAttribute('dir', 'ltr');
    
    // Check if inputs have direction attributes
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    expect(nameInput).toHaveAttribute('dir', 'ltr');
  });
});

// Test for empty form submission
describe('ContactForm Validation', () => {
  test('console logs empty values when form is submitted without input', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<ContactForm />);
    
    // Submit the form without filling it
    const form = screen.getByText('Contact Us').closest('div').querySelector('form');
    fireEvent.submit(form);
    
    // Check that empty values are logged
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    consoleSpy.mockRestore();
  });
});