export const ROUTES = {
  // 🌊 Root
  SPLASH: "Splash",

  // 🔐 Auth Stack
  AUTH_STACK: "AuthStack",
  LOGIN: "Login",
  FORGOT_PASSWORD: "ForgotPassword",

  // 🧾 Registration Stack
  SIGNUP: {
    STACK: "SignUpNavigator", // <-- this names the navigator
    SELECT_PLAN: "SelectPlan",
    INSERT_INFO: "InsertInfo",
    PAYMENT: "Payment",
    THANK_YOU: "OnboardingThankYou",
  },

  // 🧭 App Tabs
  APP_TABS: "AppTabs",
  HOME: "Home",
  PROFILE: "Profile",
  LOCATION: "Location",
  HELP: "Help",

  // 🧼 Wash Stack
  WASH: {
    STACK: "WashStack",
    SELECT: "SelectWash",
    SUMMARY: "WashSummary",
    IN_PROGRESS: "WashInProgress",
    FEEDBACK: "WashFeedback",
    FEEDBACK_DETAILS: "FeedbackDetails",
    THANK_YOU: "WashThankYou",
  },
};
