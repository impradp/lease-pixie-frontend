# Lease Pixie

_Empowering seamless management for modern leasing solutions._

![TypeScript](https://img.shields.io/badge/typescript-99.2%25-blue)
![License](https://img.shields.io/badge/license-proprietary-blue)
![Languages](https://img.shields.io/badge/languages-2-orange)

## Overview

Lease Pixie is a centralized platform designed to streamline the management of real estate portfolios. It provides comprehensive tools for managing tenants, portfolio users, property users, and account users across multiple properties. The platform handles the entire property management lifecycle from leasing to maintenance, payment processing, vendor assignment, and more.

## Key Features

- **Centralized Portfolio Management**: Manage multiple portfolios and their properties under one unified platform
- **User Role Management**: Comprehensive system for managing tenants, portfolio users, property users, and account users
- **Complete Property Lifecycle**: Tools for leasing, maintenance, payment processing, and vendor management
- **AI-Powered Workflows**: Integration with OpenAI assistants for generating leasing and tenant processes
- **Financial Integration**: Plaid integration for secure banking connections and payment processing
- **Vendor Management**: Tools for assigning and managing vendors across properties
- **Role-Based Access Control**: Granular permissions management for different user roles
- **Responsive UI**: Modern interface built with React, Material UI, and Tailwind CSS

## Tech Stack

Built with the tools and technologies:

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![MUI](https://img.shields.io/badge/-MUI-007FFF?style=flat&logo=mui&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat&logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![Lodash](https://img.shields.io/badge/-Lodash-3492FF?style=flat&logo=lodash&logoColor=white)
![Plaid](https://img.shields.io/badge/-Plaid-008CDD?style=flat&logo=plaid&logoColor=white)
![RxJS](https://img.shields.io/badge/-RxJS-B7178C?style=flat&logo=reactivex&logoColor=white)
![Radar](https://img.shields.io/badge/-Radar-7248B5?style=flat&logo=radar&logoColor=white)
![Azure](https://img.shields.io/badge/-Azure-0078D4?style=flat&logo=microsoftazure&logoColor=white)

## Prerequisites

- Node.js v20.18.1 or later
- npm (comes with Node.js)
- Access to Lease Pixie API credentials

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Sai-Capital/Pixie-FE.git
   cd Pixie-FE
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_RADAR_API_KEY=your_radar_api_key
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. Run the `Pixie-BE` backend server locally.
   Make sure you see the message in backend server running terminal as:
   `Application Started`

5. Now, start the development server for your lease pixie frontend:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code issues
- `npm run lint:fix` - Automatically fixes ESLint issues when possible
- `npm run test` - Runs Jest tests
- `npm run test:watch` - Runs Jest in watch mode
- `npm run prepare` - Sets up Husky for Git hooks

The project uses Husky to enforce code quality with pre-commit and pre-push hooks:

- **Pre-commit**: Runs ESLint on staged files via lint-staged
- **Pre-push**: Ensures code quality before pushing to the repository

## Deployment

The project is set up for automatic deployment to Azure Web App using GitHub Actions. The workflow is triggered on:

- Pushes to the master branch
- Manual workflow dispatch

The deployment process includes:

1. Building the Next.js application
2. Packaging the necessary files
3. Deploying to Azure Web App

## Backend Integration

This frontend application connects to a microservices-based Spring Boot backend architecture that provides:

- Authentication and authorization services
- RESTful API endpoints for property management
- OpenAI chat assistants for workflow generation
- Plaid API integration for financial connections
- User and role management
- Portfolio and property management services
- Email services
- Vendor management

Each microservice has a corresponding service wrapper in the frontend application that handles the API communication.

## Browser Compatibility

The application has been tested and works well in:

- Google Chrome
- Safari

## Project Structure

```
Pixie-FE/
├── .github/                # GitHub Actions workflows
│   └── workflows/          # CI/CD workflows
├── .husky/                 # Git hooks for code quality
├── public/                 # Static files
│   └── icons/              # Application icons
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── account/        # Account management pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── login/          # Authentication pages
│   │   ├── portfolio/      # Portfolio management pages
│   │   ├── property/       # Property management pages
│   │   ├── settings/       # System settings pages
│   │   ├── vendors/        # Vendor management pages
│   │   └── workflows/      # Workflow pages
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── account/        # Account-related components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── login/          # Authentication components
│   │   ├── plaid/          # Plaid integration components
│   │   ├── portfolio/      # Portfolio components
│   │   ├── property/       # Property components
│   │   └── workflows/      # Workflow components
│   ├── config/             # Configuration files
│   ├── data/               # Mock/sample data
│   ├── fonts/              # Custom fonts
│   ├── lib/                # Utilities and helpers
│   │   ├── constants/      # Application constants
│   │   ├── func/           # Common functions
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── locales/            # Internationalization
│   └── types/              # TypeScript type definitions
├── eslint.config.mjs       # ESLint configuration
├── jest.config.ts          # Jest configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## License

This is proprietary software. All rights reserved.

---

© Lease Pixie, 2025
