// We need to use jest.mock for the assets
jest.mock("../../assets/item-img.svg", () => "item-img-mock.svg", { virtual: true });

// Mock lucide-react
jest.mock("lucide-react", () => ({
  MoveRight: () => <div data-testid="move-right-icon" />
}), { virtual: true });

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PriceCards from './PriceCards';

describe('PriceCards Component', () => {
  beforeEach(() => {
    render(<PriceCards />);
  });

  it('renders the correct number of plan cards', () => {
    // There should be 3 plan cards based on the plans array
    const planCards = screen.getAllByRole('article');
    expect(planCards).toHaveLength(3);
  });

  it('displays the correct plan titles', () => {
    expect(screen.getByText('Dental Health Plan')).toBeInTheDocument();
    expect(screen.getByText('Sports & Fitness Plan')).toBeInTheDocument();
    expect(screen.getByText('Women\'s Health Plan')).toBeInTheDocument();
  });

  it('displays the correct plan prices', () => {
    const prices = screen.getAllByText(/\$\d+/);
    expect(prices).toHaveLength(3);
    expect(prices[0]).toHaveTextContent('$79');
    expect(prices[1]).toHaveTextContent('$119');
    expect(prices[2]).toHaveTextContent('$169');
  });

  it('displays the correct plan descriptions', () => {
    expect(screen.getByText(/Smile with confidence/)).toBeInTheDocument();
    expect(screen.getByText(/Optimized for athletes/)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive women's health services/)).toBeInTheDocument();
  });

  it('displays the correct features for each plan', () => {
    // Dental Health Plan features
    expect(screen.getByText('Dental Check-ups')).toBeInTheDocument();
    expect(screen.getByText('Procedure Discounts')).toBeInTheDocument();
    expect(screen.getByText('Emergency Coverage')).toBeInTheDocument();
    expect(screen.getByText('Oral Health Advice')).toBeInTheDocument();

    // Sports & Fitness Plan features
    expect(screen.getByText('Sports Injury Assessments')).toBeInTheDocument();
    expect(screen.getByText('Physiotherapy Sessions')).toBeInTheDocument();
    expect(screen.getByText('Sports Medicine Experts')).toBeInTheDocument();
    expect(screen.getByText('Fitness Support')).toBeInTheDocument();

    // Women's Health Plan features
    expect(screen.getByText('Women\'s Health Services')).toBeInTheDocument();
    expect(screen.getByText('Gynecological Care')).toBeInTheDocument();
    expect(screen.getByText('Fall Prevention Programs')).toBeInTheDocument();
    expect(screen.getByText('Family Planning')).toBeInTheDocument();
    expect(screen.getByText('Prenatal & Postnatal Support')).toBeInTheDocument();
  });

  it('renders the correct number of "Get Started" buttons', () => {
    const buttons = screen.getAllByText('Get Started');
    expect(buttons).toHaveLength(3);
  });

  it('renders the MoveRight icon for each button', () => {
    const icons = screen.getAllByTestId('move-right-icon');
    expect(icons).toHaveLength(3);
  });

  it('renders the item images for each feature', () => {
    // Count the total number of features across all plans
    const totalFeatures = 4 + 4 + 5; // Dental (4) + Sports (4) + Women's (5)
    
    // Use querySelector instead of getAllByRole since the images don't have proper role
    const itemImages = document.querySelectorAll('img[src="item-img-mock.svg"]');
    expect(itemImages.length).toBe(totalFeatures);
  });
});