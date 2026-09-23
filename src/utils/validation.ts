export type RegistrationErrors = {
  fullName?: string;
  email?: string;
  college?: string;
  phone?: string;
  eventId?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s\-()]{7,14}$/;

export function validateRegistration(input: {
  fullName: string;
  email: string;
  college: string;
  phone: string;
  eventId: string;
}): RegistrationErrors {
  const errors: RegistrationErrors = {};

  const fullName = input.fullName.trim();
  if (!fullName) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length < 3) {
    errors.fullName = 'Please enter your full name (min 3 characters).';
  }

  const email = input.email.trim();
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address (e.g. name@college.edu).';
  }

  if (!input.college.trim()) {
    errors.college = 'College / institution is required.';
  }

  const phone = input.phone.trim();
  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = 'Enter a valid phone number (7–15 digits).';
  }

  if (!input.eventId) {
    errors.eventId = 'Please select an event.';
  }

  return errors;
}

export function hasErrors(errors: RegistrationErrors): boolean {
  return Object.keys(errors).length > 0;
}