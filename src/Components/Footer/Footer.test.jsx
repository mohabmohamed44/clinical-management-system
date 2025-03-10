// We need to use jest.mock with an automock: false setting
jest.mock("react-router-dom", () => ({
    __esModule: true,
    Link: ({ children, to }) => <a href={to}>{children}</a>
  }), { virtual: true });
  
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import {jest, expect, test} from 
  import '@testing-library/jest-dom';
  import { I18nextProvider } from 'react-i18next';
  import i18n from 'i18next';
  import Footer from '../Footer';
  
  // Mock the assets
  jest.mock('../../assets/logo.webp', () => 'logo-mock.webp', { virtual: true });
  jest.mock('../../assets/Frame.webp', () => 'frame-mock.webp', { virtual: true });
  
  // Mock react-icons
  jest.mock('react-icons/fa6', () => ({
    FaFacebook: () => <div data-testid="facebook-icon" />,
    FaLinkedinIn: () => <div data-testid="linkedin-icon" />,
    FaXTwitter: () => <div data-testid="twitter-icon" />
  }), { virtual: true });
  
  // Mock lucide-react
  jest.mock('lucide-react', () => ({
    MapPin: () => <div data-testid="map-pin-icon" />,
    Phone: () => <div data-testid="phone-icon" />,
    Mail: () => <div data-testid="mail-icon" />,
    Shield: () => <div data-testid="shield-icon" />,
    MoveRight: () => <div data-testid="move-right-icon" />,
    MoveLeft: () => <div data-testid="move-left-icon" />
  }), { virtual: true });
  
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
  
  // For correct path resolution based on your error
  const actualFooterPath = '../Footer';
  
  describe('Footer Component', () => {
    beforeEach(() => {
      // Reset i18n direction to LTR before each test
      i18n.dir = jest.fn().mockReturnValue('ltr');
      
      render(
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      );
    });
  
    test('renders logo and company name', () => {
      const logo = screen.getByAltText('logo-img');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'logo-mock.webp');
      expect(screen.getByText('Delma')).toBeInTheDocument();
    });
  
    test('renders shield logo in the decorative circle', () => {
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
    });
  
    test('renders contact information', () => {
      expect(screen.getByText('123 Anywhere St., Any City 12345')).toBeInTheDocument();
      expect(screen.getByText('123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('hellocallcenter@gmail.com')).toBeInTheDocument();
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
      expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });
  
    test('renders first column navigation links', () => {
      const firstColumnLinks = [
        { text: 'About Us', href: '#' },
        { text: 'Departments', href: '/departments' },
        { text: 'Doctors', href: '/doctors' },
        { text: 'Timetable', href: '#' },
        { text: 'Appointments', href: '/appointments' },
        { text: 'Testimonials', href: '#' }
      ];
      
      firstColumnLinks.forEach(link => {
        const linkElement = screen.getByText(link.text);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
      });
    });
  
    test('renders second column navigation links', () => {
      const secondColumnLinks = [
        { text: 'Blog', href: '/blog' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'FAQ', href: '#' },
        { text: 'Privacy Policy', href: '#' },
        { text: 'Terms and Conditions', href: '#' },
        { text: 'About', href: '/about' }
      ];
      
      secondColumnLinks.forEach(link => {
        const linkElement = screen.getByText(link.text);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
      });
    });
  
    test('renders subscription section', () => {
      expect(screen.getByText('Subscription')).toBeInTheDocument();
      expect(screen.getByText('Get advice from our experts')).toBeInTheDocument();
      
      const emailInput = screen.getByPlaceholderText('example@email.com');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      
      const submitButton = screen.getByText('Submit');
      expect(submitButton).toBeInTheDocument();
      expect(screen.getByTestId('move-right-icon')).toBeInTheDocument();
    });
  
    test('renders social media section', () => {
      expect(screen.getByText('Follow Us')).toBeInTheDocument();
      
      const socialIcons = [
        { testId: 'facebook-icon', platform: 'Facebook' },
        { testId: 'linkedin-icon', platform: 'LinkedIn' },
        { testId: 'twitter-icon', platform: 'Twitter' }
      ];
      
      socialIcons.forEach(icon => {
        expect(screen.getByTestId(icon.testId)).toBeInTheDocument();
        // Check that the icon is wrapped in an anchor tag
        const iconElement = screen.getByTestId(icon.testId);
        expect(iconElement.closest('a')).toHaveAttribute('href', '#');
      });
    });
  
    test('renders copyright text', () => {
      expect(screen.getByText('© 2024 All Rights Reserved')).toBeInTheDocument();
    });
  
    test('renders background image', () => {
      const backgroundImage = screen.getByAltText('background');
      expect(backgroundImage).toBeInTheDocument();
      expect(backgroundImage).toHaveAttribute('src', 'frame-mock.webp');
      expect(backgroundImage).toHaveClass('w-full', 'h-full', 'object-cover', 'object-top', 'block');
    });
  
    test('email input can be typed into', () => {
      const emailInput = screen.getByPlaceholderText('example@email.com');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');
    });
  });
  
  // Test for RTL direction
  describe('Footer Component in RTL mode', () => {
    beforeEach(() => {
      // Change language to Arabic and direction to RTL
      i18n.changeLanguage('ar');
      i18n.dir = jest.fn().mockReturnValue('rtl');
      
      render(
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      );
    });
  
    test('renders MoveLeft icon in RTL mode', () => {
      expect(screen.getByTestId('move-left-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('move-right-icon')).not.toBeInTheDocument();
    });
  
    test('renders Arabic translations correctly', () => {
      expect(screen.getByText('دلما')).toBeInTheDocument();
      expect(screen.getByText('معلومات عنا')).toBeInTheDocument();
      expect(screen.getByText('الأقسام')).toBeInTheDocument();
      expect(screen.getByText('إرسال')).toBeInTheDocument();
      expect(screen.getByText('تابعنا')).toBeInTheDocument();
      // Make sure we're using the correct translation key
      const copyrightText = i18n.t('CopyRights');
      expect(screen.getByText(copyrightText)).toBeInTheDocument();
    });
  
    test('has RTL-specific styling applied', () => {
      // Check for RTL specific classes on relevant elements
      const links = screen.getAllByRole('listitem');
      links.forEach(link => {
        expect(link.closest('ul')).toHaveClass('space-y-2');
      });
      
      // For the first column specifically (which has RTL-specific classes)
      const arabicLinks = screen.getByText('معلومات عنا').closest('ul');
      expect(arabicLinks).toHaveClass('rtl:font-medium', 'rtl:text-lg');
    });
  });
  
  // Test for responsive behavior
  describe('Footer Component Responsive Behavior', () => {
    beforeEach(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      );
    });
  
    test('uses responsive grid layout', () => {
      const footerGrid = screen.getByText('Delma').closest('div').parentElement;
      expect(footerGrid).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-4',
        'gap-8'
      );
    });
  
    test('bottom bar has responsive layout', () => {
      const bottomBar = screen.getByText('Follow Us').closest('div').parentElement;
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