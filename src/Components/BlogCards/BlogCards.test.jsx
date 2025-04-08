import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import BlogCard from './BlogCards';

describe('BlogCard Component', () => {
  const props = {
    image: 'https://example.com/image.jpg',
    title: 'Test Blog Title',
    description: 'Test Blog Description',
  };

  it('renders BlogCard with provided props', () => {
    render(<BlogCard {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByAltText(props.title)).toBeInTheDocument();
  });

  it('displays fallback image on image error', () => {
    render(<BlogCard {...props} />);
    const img = screen.getByAltText(props.title);
    fireEvent.error(img);
    expect(img.src).toMatch(/https:\/\/source\.unsplash\.com\/800x600\/\?/);
  });

  it('renders social media icons', () => {
    render(<BlogCard {...props} />);
    const socialIconsContainer = screen.getByText('Read more').parentElement.querySelector('.flex.gap-4');
    expect(socialIconsContainer).toBeInTheDocument();
    
    const icons = socialIconsContainer.querySelectorAll('a');
    expect(icons.length).toBe(3);
  });

  it('renders "Read more" link', () => {
    render(<BlogCard {...props} />);
    const readMoreLink = screen.getByText(/read more/i);
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink.tagName.toLowerCase()).toBe('a');
    const arrowIcon = readMoreLink.querySelector('.ms-2');
    expect(arrowIcon).toBeInTheDocument();
  });
});
