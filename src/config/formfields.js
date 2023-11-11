import { BsTrash } from "react-icons/bs";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { GiMoneyStack, GiPayMoney } from "react-icons/gi";
import { HiCash } from "react-icons/hi";
import { IoCard } from "react-icons/io5";
import { TbReportMoney } from "react-icons/tb";

export const loginInitialValues = {
  companyId: "UA-189878",
  email: "",
  password: "",
};

export const loginFormFields = [
  {
    field: "textField",
    id: "companyId",
    label: "Company Number",
    name: "companyId",
    type: "companyId",
  },
  {
    field: "textField",
    id: "email",
    isRequired: true,
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    field: "textField",
    id: "password",
    isRequired: true,
    label: "Password",
    name: "password",
    type: "password",
  },
  {
    field: "link",
    id: "link",
    path: "/forgot-password",
    label: "Forgot password",
    name: "password",
    type: "text",
  },
  {
    field: "button",
    variant: "primary",
    id: "login",
    type: "submit",
    label: "Sign in",
    size: "sm",
  },
];

export const signUpInitialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  employmentType: "",
  department: "",
  manager: "",
  dateOfJoining: "",
  phoneNumber: "",
  streetNumber: "",
  city: "",
  postalCode: "",
  state: "",
  country: "",
};
export const signUpFormFields = [
  {
    field: "textField",
    id: "firstName",
    isRequired: true,
    label: "First Name",
    name: "firstName",
    type: "text",
  },
  {
    field: "textField",
    id: "middleName",
    label: "Middle Name",
    name: "middleName",
    type: "text",
  },
  {
    field: "textField",
    id: "lastName",
    isRequired: true,
    label: "Last Name",
    name: "lastName",
    type: "text",
  },
  {
    field: "textField",
    id: "email",
    isRequired: true,
    label: "Email Address",
    name: "email",
    type: "email",
  },
  {
    field: "textField",
    id: "password",
    isRequired: true,
    label: "Password",
    name: "password",
    type: "password",
  },
  {
    field: "select",
    id: "role",
    isRequired: true,
    label: "Role",
    placeholder: "Select role",
    name: "role",
    type: "text",
    options: [],
  },
  {
    field: "select",
    id: "department",
    isRequired: true,
    placeholder: "Select Department",
    label: "Department",
    name: "department",
    type: "text",
    options: [],
  },
  {
    field: "select",
    id: "empType",
    isRequired: true,
    placeholder: "Select Type of Employment",
    label: "Department",
    name: "employmentType",
    type: "text",
    options: [],
  },
  {
    field: "select",
    id: "approver",
    isRequired: true,
    placeholder: "Select Manager",
    label: "Manager",
    name: "manager",
    type: "text",
    options: [],
  },
  {
    field: "date",
    id: "dateOfJoining",
    isRequired: true,
    label: "Date of Joining",
    name: "dateOfJoining",
    type: "date",
  },
  {
    field: "textField",
    id: "phoneNumber",
    isRequired: true,
    label: "Phone Number",
    name: "phoneNumber",
    type: "tel",
  },
  {
    field: "country",
    id: "country",
    isRequired: true,
    label: "Country",
    name: "country",
    type: "text",
  },
  {
    field: "state",
    id: "state",
    label: "State",
    name: "state",
    type: "text",
  },
  {
    field: "city",
    id: "city",
    isRequired: true,
    label: "City",
    name: "city",
    type: "text",
  },
  {
    field: "textField",
    id: "streetNumber",
    isRequired: true,
    label: "Street Number",
    name: "streetNumber",
    type: "text",
  },
  {
    field: "textField",
    id: "postalCode",
    isRequired: true,
    label: "Postal Code",
    name: "postalCode",
    type: "text",
  },
  {
    field: "button",
    variant: "primary",
    id: "register",
    fullWidth: "100%",
    type: "submit",
    label: "Create account",
  },
];

export const resetPasswordInitialValues = {
  email: "",
};
export const resetPasswordFormFields = [
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "email",
    size: "medium",
    label: "",
    name: "email",
    type: "email",
    variant: "outlined",
    color: "primary",
    placeholder: "Enter your email",
  },
  {
    field: "button",
    variant: "primary",
    id: "login",
    fullWidth: "100%",
    type: "submit",
    size: "md",
    label: "Continue with email",
  },
];

export const userPaymentInitialValues = {
  annualSalary: "",
};
export const userPaymentFormFields = [
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "annualSalary",
    label: "Annual Salary  ",
    size: "medium",
    name: "annualSalary",
    type: "number",
    variant: "solid",
    color: "primary",
  },
  {
    field: "button",
    variant: "solid",
    color: "#383ab6",
    id: "login",
    type: "submit",
    size: "lg",
    label: "Add",
  },
];
export const otpPasswordFormFields = [
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "firstChar",
    size: "medium",
    name: "firstChar",
    type: "text",
    variant: "outlined",
    color: "primary",
  },
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "secondChar",
    size: "medium",
    name: "secondChar",
    type: "text",
    variant: "outlined",
    color: "primary",
  },
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "thirdChar",
    size: "medium",
    name: "thirdChar",
    type: "text",
    variant: "outlined",
    color: "primary",
  },
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "fourthChar",
    size: "medium",
    name: "fourthChar",
    type: "text",
    variant: "outlined",
    color: "primary",
  },
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "fifthChar",
    size: "medium",
    name: "fifthChar",
    type: "text",
    variant: "outlined",
    color: "primary",
  },
  {
    field: "textField",
    margin: "dense",
    fullWidth: true,
    id: "sixthChar",
    size: "medium",
    name: "sixthChar",
    type: "text",
    variant: "outlined",
    color: "primary",
  },
  {
    field: "button",
    variant: "contained",
    color: "primary",
    id: "verify",
    fullWidth: true,
    type: "submit",
    size: "large",
    label: "Verify Email",
    style: { mt: 1, mb: "2em" },
  },
];
export const getPaymentIcons = (name, content) => {
  if (name === "Payment Method") {
    content.map((item) => {
      item.icon =
        item.name === "Direct Deposit"
          ? GiPayMoney
          : item.name === "Physical Check"
          ? FaMoneyCheckAlt
          : item.name === "Pay Card (Prepaid Debit Card)"
          ? IoCard
          : item.name === "Cash"
          ? GiMoneyStack
          : item.name === "Salary Advance"
          ? HiCash
          : item.name === "Bonuses and Commissions"
          ? TbReportMoney
          : BsTrash;
      return item;
    });
  }
};
