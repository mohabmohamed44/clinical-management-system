import { render, screen } from '@testing-library/react'
import Details from './_ServiceCards'

describe('_ServiceCards Component', () => {
  const expectedTitles = [
    'DiagnosticTesting',
    'RehabilitationServices',
    'MentalHealthServices',
    'HealthMonitoring',
    'PreventiveCare'
  ]

  it('renders all service titles', () => {
    render(<Details />)

    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map(h => h.textContent)
    
    expectedTitles.forEach(title => {
      expect(headingTexts).toContain(title)
    })
  })

  it('renders all service icons', () => {
    render(<Details />)
    
    // Find all divs that contain the SVG icons by their distinctive background color class
    const icons = Array.from(document.querySelectorAll('div')).filter(div => 
      div.className.includes('bg-[#307bc4]/10')
    )
    
    expect(icons.length).toBe(5)
  })
})