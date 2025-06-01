// src/utils/validators.ts

//User details
export interface ProfileValues {
  name: string;
  lastname: string;
  mobile_num: string;
  email: string;
  password: string;
  confirm: string;
  carplate: string;
}

export interface ProfileErrors {
  name?: string;
  lastname?: string;
  mobile_num?: string;
  email?: string;
  password?: string;
  confirm?: string;
  carplate?: string;
}

/**
 * Validates profile fields. Returns an object where each invalid field
 * maps to its error message, or an empty object if all fields are valid.
 */
export const validateProfile = (
  values: ProfileValues
): ProfileErrors => {
  const errs: ProfileErrors = {};

  if (!values.name.trim()) {
    errs.name = "Insert name";
  }

  if (!values.lastname.trim()) {
    errs.lastname = "Insert surname";
  }

  if (!/^\+\d{2}\s?\d{6,}$/.test(values.mobile_num)) {
    errs.mobile_num = "Insert a valid phone number";
  }

  if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(values.email)) {
    errs.email = "Email not valid";
  }

  if (values.password.length < 6) {
    errs.password = "Choose at least 6 characters.";
  }

  if (values.confirm !== values.password) {
    errs.confirm = "Passwords don’t match";
  }

  if (!values.carplate.trim()) {
    errs.carplate = "Plate number cannot be empty";
  }

  return errs;
};

//Payment details
export interface PaymentValues {
  card_owner: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
}

export interface PaymentErrors {
  card_owner?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
}

/**
 * Validates payment fields. Returns an object where each invalid field
 * maps to its error message, or an empty object if all fields are valid.
 */
export const validatePayment = (
  values: PaymentValues
): PaymentErrors => {
  const errs: PaymentErrors = {};

  if (!values.card_owner.trim()) {
    errs.card_owner = "Insert a valid name";
  }

  if (!/^\d{16}$/.test(values.card_number)) {
    errs.card_number = "Use 16 digits";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry_date)) {
    errs.expiry_date = "Use MM/YY";
  } else {
    const [mmStr, yyStr] = values.expiry_date.split("/");
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    const expiryDate = new Date(2000 + yy, mm, 0, 23, 59, 59);
    if (expiryDate <= new Date()) {
      errs.expiry_date = "Card expired";
    }
  }

  if (!/^\d{3}$/.test(values.cvv)) {
    errs.cvv = "3 digit code";
  }

  return errs;
};
