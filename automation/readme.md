# Security App E2E Tests

End-to-end Playwright tests for the Security React application.

## Install Packages

Open the terminal in the `automation` folder and run the following command:

```bash
npm install
```

## Install Playwright

```bash
npm i -D @playwright/test
```

## Install Supported Browsers

```bash
npx playwright install
```

## Get Environment Files

Get environment files from LastPass automation env files folder.
Fill the data for `config/environments.ts`:

- `base_url` - The Security app base URL (default: https://globalsubmit.test.certara.net/Security/)
- `credentials.admin` - Admin user credentials
- `credentials.incorrect_user` - Invalid credentials for negative tests
- `credentials.noPermissionsUser` - User without Security app permissions
- `credentials.supportUser` - Support role user credentials

## Install and Build the Reporter

Get the reporter code from the repository:
https://github.com/certara/playwright-xray-report

Build the reporter by running the build command in the playwright-xray-report folder:

```bash
npm run build
```

Add the dependency and run npm install:

```bash
"xray-report": "file:../../playwright-xray-report/"
```

Or link the reporting:

```bash
npm link ..\..\playwright-xray-report\
```

## Run Tests

Run tests with headed or headless mode:

```bash
npx playwright test
```

or

```bash
npx playwright test --headed
```

## Debug Tests

```bash
npx playwright test --debug
```

## Run Specific Test File

```bash
npx playwright test features/login.spec.ts
```

## Run Tests with HTML Report

```bash
npm run test-headed
```

## Security App Test Environment Pre-requisites

1. Required build should be available at https://globalsubmit.test.certara.net/Security/
2. Test users should have appropriate roles configured:
   - Admin user with Support or Admin role
   - User without Security app permissions (for negative tests)
3. Test company/spaces should exist for CRUD operation tests

## Test Structure

Each automatic test should follow this structure:

```typescript
test.describe('<Required test suite name>', () => {
  <required test initializations>

  test("@<test number> test name", async ({}, testInfo) => {
    XrayHelper.addTestInfo(
      test.info(),
      '<test number like "SB-XXXX">',
      'required JIRA xray test name',
      'required JIRA xray test definition'
    );

    <required tests assertions etc...>

    // Note: test should contain at least one screenshot
    await XrayHelper.addScreenshot(test.info(), page, 'screenshot-name');

    <required tests assertions etc...>
  });
});
```

## Project Structure

```
automation/
├── config/
│   └── environments.ts          # Environment URLs and test credentials
├── features/                    # Test spec files
│   ├── login.spec.ts           # Authentication tests
│   ├── dashboard.spec.ts       # Dashboard functionality tests
│   ├── companyManagement.spec.ts # Company CRUD tests
│   ├── groups.spec.ts          # Group management tests
│   └── userRoles.spec.ts       # User roles management tests
├── lib/
│   ├── helpers/
│   │   ├── pageHelper.ts       # Utility functions
│   │   └── authHelper.ts       # Authentication helpers
│   └── pageObjects/
│       ├── basePage.po.ts      # Base page object class
│       ├── loginPage.po.ts     # Okta login page object
│       ├── dashboardPage.po.ts # Dashboard page object
│       ├── companyDialog.po.ts # Company dialogs
│       ├── groupsDialog.po.ts  # Groups dialog
│       └── userRolesDialog.po.ts # User roles dialog
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration
└── readme.md                   # This file
```

## Available Scripts

- `npm test` - Run all tests in headless mode
- `npm run test-headed` - Run tests in headed mode with HTML report
- `npm run test-debug` - Run tests in debug mode
- `npm run lint` - Run ESLint
- `npm run lint-and-fix` - Run ESLint with auto-fix
