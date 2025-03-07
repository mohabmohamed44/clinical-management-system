import React from 'react';
import { render, screen } from '@testing-library/react';
import _ServiceCards from './_ServiceCards';
import '@testing-library/jest-dom';

describe('_ServiceCards Component', () => {
  test('renders header section with correct text', () => {
    render(<_ServiceCards />);
    
    // Check if SERVICES text is rendered
    expect(screen.getByText('SERVICES')).toBeInTheDocument();
    
    // Check if header title is rendered - using a more flexible approach
    const headerElement = screen.getByText(/Provides Our/i);
    expect(headerElement).toBeInTheDocument();
    
    const bestServicesElement = screen.getByText(/Best Services/i);
    expect(bestServicesElement).toBeInTheDocument();
    
    // Alternative approach using regex to match the entire text together
    // expect(screen.getByText(/Provides Our.*Best Services/s)).toBeInTheDocument();
  });

  test('renders correct number of cards', () => {
    render(<_ServiceCards />);
    
    // First row should have 2 cards as shown in the implementation
    const serviceCards = screen.getAllByText(/Diagnostic Testing|Rehabilitation Services|Mental Health Services|Health Monitoring|Preventive Care/);
    expect(serviceCards).toHaveLength(5);
  });

  test('renders all service titles', () => {
    render(<_ServiceCards />);
    
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
    const { container } = render(<_ServiceCards />);
    
    // Check main container classes
    const mainSection = container.querySelector('section');
    expect(mainSection).toHaveClass('w-full');
    expect(mainSection).toHaveClass('py-20');
    
    // Check grid layout classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('lg:grid-cols-3');
  });
});