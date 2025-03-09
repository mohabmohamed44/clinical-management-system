import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect, test, describe } from '@jest/globals';
import BlogCard from './BlogCards'; // Import the correct component

describe('BlogCard Component', () => {
  const props = {
    image: 'https://example.com/image.jpg',
    title: 'Test Blog Title',
    description: 'Test Blog Description',
  };

  test('renders BlogCard with provided props', () => {
    render(<BlogCard {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByAltText(props.title)).toBeInTheDocument();
  });

  test('displays fallback image on image error', () => {
    render(<BlogCard {...props} />);
    const img = screen.getByAltText(props.title);
    fireEvent.error(img);
    // Check that the src has been changed to include unsplash with health keyword
    expect(img.src).toMatch(/https:\/\/source\.unsplash\.com\/800x600\/\?/);
  });

  test('renders social media icons', () => {
    render(<BlogCard {...props} />);
    // The social icons container doesn't have a role="list", so we need to use a different selector
    const socialIconsContainer = screen.getByText('Read more').parentElement.querySelector('.flex.gap-4');
    expect(socialIconsContainer).toBeInTheDocument();
    
    // Find all the links within the social icons container
    const icons = socialIconsContainer.querySelectorAll('a');
    expect(icons.length).toBe(3); // Should have 3 social media icons
  });

  test('renders "Read more" link', () => {
    render(<BlogCard {...props} />);
    const readMoreLink = screen.getByText(/read more/i);
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink.tagName.toLowerCase()).toBe('a');
    // Check if the arrow icon is present
    const arrowIcon = readMoreLink.querySelector('.ms-2');
    expect(arrowIcon).toBeInTheDocument();
  });
});