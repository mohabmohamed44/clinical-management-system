import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from '@jest/globals';
import _ServiceCards from './_ServiceCards';
import '@testing-library/jest-dom';
import Details from './_ServiceCards';

describe('_ServiceCards Component', () => {
  test('renders header section with correct text', () => {
    render(<_ServiceCards />);

    // Ensure "Services" is translated correctly
    expect(screen.getByText('Services')).toBeInTheDocument();

    // Check for the main title
    expect(screen.getByText(/Provides Our/i)).toBeInTheDocument();
    expect(screen.getByText(/Best Services/i)).toBeInTheDocument();
  });

  test('renders correct number of cards', () => {
    render(<Details />);
    
    // Expect all 5 service cards to be rendered
    const serviceCards = screen.getAllByRole('heading', { level: 3 }); // Assuming h3 is used in Card titles
    expect(serviceCards).toHaveLength(5);
  });

  test('renders all service titles', () => {
    render(<Details />);

    const expectedTitles = [
      'Diagnostic Testing',
      'Rehabilitation Services',
      'Mental Health Services',
      'Health Monitoring',
      'Preventive Care'
    ];

    expectedTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders section with correct layout classes', () => {
    const { container } = render(<Details />);

    // Check main section class
    const mainSection = container.querySelector('section');
    expect(mainSection).toHaveClass('w-full', 'py-20');

    // Check grid layout
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
  });
});
