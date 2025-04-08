import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import Footer from './Footer';

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock the assets
vi.mock('../../assets/logo.webp', () => ({
  default: 'logo-mock.webp'
}));

vi.mock('../../assets/Frame.webp', () => ({
  default: 'frame-mock.webp'
}));

// Mock react-icons
vi.mock('react-icons/fa6', () => ({
  FaFacebook: () => <div data-testid="facebook-icon" />,
  FaLinkedinIn: () => <div data-testid="linkedin-icon" />,
  FaXTwitter: () => <div data-testid="twitter-icon" />
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  MoveRight: () => <div data-testid="move-right-icon" />,
  MoveLeft: () => <div data-testid="move-left-icon" />
}));

// Mock i18next configuration
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        Delma: 'Delma',
        AboutUs: 'About Us',
        Departments: 'Departments',
        Doctors: 'Doctors',
        Timetable: 'Timetable',
        Appointments: 'Appointments',
        Testimonials: 'Testimonials',
        Blog: 'Blog',
        ContactUs: 'Contact Us',
        FAQ: 'FAQ',
        PrivacyPolicy: 'Privacy Policy',
        TermsAndConditions: 'Terms and Conditions',
        About: 'About',
        Subscription: 'Subscription',
        GetAdviceFromOurExperts: 'Get advice from our experts',
        Submit: 'Submit',
        FollowUs: 'Follow Us',
        CopyRights: '© 2024 All Rights Reserved'
      }
    },
    ar: {
      translation: {
        Delma: 'دلما',
        AboutUs: 'معلومات عنا',
        Departments: 'الأقسام',
        Doctors: 'الأطباء',
        Timetable: 'الجدول الزمني',
        Appointments: 'المواعيد',
        Testimonials: 'الشهادات',
        Blog: 'المدونة',
        ContactUs: 'اتصل بنا',
        FAQ: 'الأسئلة الشائعة',
        PrivacyPolicy: 'سياسة الخصوصية',
        TermsAndConditions: 'الشروط والأحكام',
        About: 'حول',
        Subscription: 'الاشتراك',
        GetAdviceFromOurExperts: 'احصل على نصائح من خبرائنا',
        Submit: 'إرسال',
        FollowUs: 'تابعنا',
        CopyRights: '© 2024 جميع الحقوق محفوظة'
      }
    }
  },
  interpolation: {
    escapeValue: false
  }
});

describe('Footer Component', () => {
  beforeEach(() => {
    i18n.dir = vi.fn().mockReturnValue('ltr');
    i18n.language = 'en';
    
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );
  });

  it('renders copyright text', () => {
    // Find the copyright container element
    const copyrightContainer = screen.getByText(/© 2024/).closest('p');
    expect(copyrightContainer).toBeInTheDocument();
    
    // Check that the container includes the copyright text
    expect(copyrightContainer).toHaveTextContent('© 2024 All Rights Reserved');
  });

  // ... other tests remain unchanged ...
});

describe('Footer Component in RTL mode', () => {
  beforeEach(() => {
    i18n.changeLanguage('ar');
    i18n.dir = vi.fn().mockReturnValue('rtl');
    
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );
  });

  it('renders Arabic translations correctly', () => {
    expect(screen.getByText('دلما')).toBeInTheDocument();
    expect(screen.getByText('معلومات عنا')).toBeInTheDocument();
    expect(screen.getByText('الأقسام')).toBeInTheDocument();
    expect(screen.getByText('إرسال')).toBeInTheDocument();
    expect(screen.getByText('تابعنا')).toBeInTheDocument();
    
    // Find the Arabic copyright container element
    const copyrightContainer = screen.getByText(/© 2024/).closest('p');
    expect(copyrightContainer).toBeInTheDocument();
    
    // Check that the container includes the Arabic copyright text
    expect(copyrightContainer).toHaveTextContent('© 2024 جميع الحقوق محفوظة');
  });

// ... rest of the test file remains the same ...

  it('has RTL-specific styling applied', () => {
    const links = screen.getAllByRole('listitem');
    links.forEach(link => {
      expect(link.closest('ul')).toHaveClass('space-y-2');
    });
    
    const arabicLinks = screen.getByText('معلومات عنا').closest('ul');
    expect(arabicLinks).toHaveClass('rtl:font-medium', 'rtl:text-lg');
  });
});

describe('Footer Component Responsive Behavior', () => {
  beforeEach(() => {
    i18n.language = 'ar';
    i18n.dir = vi.fn().mockReturnValue('rtl');
    
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );
  });

  it('uses responsive grid layout', () => {
    const footerGrid = screen.getByText('دلما').closest('div').parentElement;
    expect(footerGrid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-4',
      'gap-8'
    );
  });

  it('bottom bar has responsive layout', () => {
    const bottomBar = screen.getByText('تابعنا').closest('div').parentElement;
    expect(bottomBar).toHaveClass(
      'flex',
      'flex-col',
      'md:flex-row',
      'justify-between',
      'items-center',
      'gap-4'
    );
  });
});