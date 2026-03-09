# Third-Party Licenses

This document lists the third-party dependencies used in the LocalSteals project,
along with their license information.

---

## Production Dependencies

### Next.js
- **Version:** 16.1.6
- **License:** MIT
- **Copyright:** Copyright (c) 2024 Vercel, Inc.
- **URL:** https://github.com/vercel/next.js
- **Purpose:** React framework for server-side rendering, routing, and full-stack web application development.

### React
- **Version:** 19.2.3
- **License:** MIT
- **Copyright:** Copyright (c) Meta Platforms, Inc. and affiliates.
- **URL:** https://github.com/facebook/react
- **Purpose:** UI component library for building interactive user interfaces.

### React DOM
- **Version:** 19.2.3
- **License:** MIT
- **Copyright:** Copyright (c) Meta Platforms, Inc. and affiliates.
- **URL:** https://github.com/facebook/react
- **Purpose:** React renderer for the browser DOM.

### Drizzle ORM
- **Version:** 0.45.1
- **License:** Apache-2.0
- **Copyright:** Copyright (c) 2022-2024 Drizzle Team
- **URL:** https://github.com/drizzle-team/drizzle-orm
- **Purpose:** TypeScript ORM for SQL databases; used for SQLite database access and schema management.

### better-sqlite3
- **Version:** 12.6.2
- **License:** MIT
- **Copyright:** Copyright (c) 2017 Joshua Wise
- **URL:** https://github.com/WiseLibs/better-sqlite3
- **Purpose:** Fast, synchronous SQLite3 driver for Node.js; provides the database engine.

### Firebase (Client SDK)
- **Version:** 12.9.0
- **License:** Apache-2.0
- **Copyright:** Copyright (c) 2017 Google LLC
- **URL:** https://github.com/firebase/firebase-js-sdk
- **Purpose:** Firebase client SDK for push notifications via Firebase Cloud Messaging (FCM).

### Firebase Admin SDK
- **Version:** 13.6.1
- **License:** Apache-2.0
- **Copyright:** Copyright (c) 2017 Google LLC
- **URL:** https://github.com/firebase/firebase-admin-node
- **Purpose:** Firebase server-side SDK for sending push notifications from the backend.

### @serwist/next
- **Version:** 9.5.6
- **License:** MIT
- **Copyright:** Copyright (c) 2023 Serwist
- **URL:** https://github.com/serwist/serwist
- **Purpose:** Next.js integration for Serwist (service worker toolbox); enables PWA support.

### node-cron
- **Version:** 4.2.1
- **License:** ISC
- **Copyright:** Copyright (c) 2016 Lucas Merencia
- **URL:** https://github.com/node-cron/node-cron
- **Purpose:** Cron-based task scheduler for Node.js; schedules periodic deal fetching.

### rss-parser
- **Version:** 3.13.0
- **License:** MIT
- **Copyright:** Copyright (c) 2016 Bobby Brennan
- **URL:** https://github.com/rbren/rss-parser
- **Purpose:** RSS/Atom feed parser; used to fetch and parse deal feeds from external sources.

---

## Development Dependencies

### TypeScript
- **Version:** 5.9.3
- **License:** Apache-2.0
- **Copyright:** Copyright (c) Microsoft Corporation.
- **URL:** https://github.com/microsoft/TypeScript
- **Purpose:** Typed superset of JavaScript used for all source code in this project.

### Tailwind CSS
- **Version:** 4.2.1
- **License:** MIT
- **Copyright:** Copyright (c) Tailwind Labs, Inc.
- **URL:** https://github.com/tailwindlabs/tailwindcss
- **Purpose:** Utility-first CSS framework for styling the application.

### @tailwindcss/postcss
- **Version:** 4.2.1
- **License:** MIT
- **Copyright:** Copyright (c) Tailwind Labs, Inc.
- **URL:** https://github.com/tailwindlabs/tailwindcss
- **Purpose:** PostCSS plugin for processing Tailwind CSS directives.

### ESLint
- **Version:** 9.39.3
- **License:** MIT
- **Copyright:** Copyright OpenJS Foundation and contributors.
- **URL:** https://github.com/eslint/eslint
- **Purpose:** JavaScript/TypeScript linter for enforcing code quality and style.

### eslint-config-next
- **Version:** 16.1.6
- **License:** MIT
- **Copyright:** Copyright (c) 2024 Vercel, Inc.
- **URL:** https://github.com/vercel/next.js
- **Purpose:** ESLint configuration preset for Next.js projects.

### Vitest
- **Version:** 4.0.18
- **License:** MIT
- **Copyright:** Copyright (c) 2021-2024 Vitest Team
- **URL:** https://github.com/vitest-dev/vitest
- **Purpose:** Unit testing framework; used to run all project tests.

### @testing-library/react
- **Version:** 16.3.2
- **License:** MIT
- **Copyright:** Copyright (c) 2017 Kent C. Dodds
- **URL:** https://github.com/testing-library/react-testing-library
- **Purpose:** React component testing utilities.

### @testing-library/jest-dom
- **Version:** 6.9.1
- **License:** MIT
- **Copyright:** Copyright (c) 2017 Kent C. Dodds
- **URL:** https://github.com/testing-library/jest-dom
- **Purpose:** Custom Jest/Vitest matchers for DOM assertions in tests.

### jsdom
- **Version:** 28.1.0
- **License:** MIT
- **Copyright:** Copyright (c) 2010 Elijah Insua
- **URL:** https://github.com/jsdom/jsdom
- **Purpose:** JavaScript DOM implementation; provides browser environment for tests.

### Serwist
- **Version:** 9.5.6
- **License:** MIT
- **Copyright:** Copyright (c) 2023 Serwist
- **URL:** https://github.com/serwist/serwist
- **Purpose:** Service worker toolbox for building progressive web apps.

### Sharp
- **Version:** 0.34.5
- **License:** Apache-2.0
- **Copyright:** Copyright (c) 2013 Lovell Fuller
- **URL:** https://github.com/lovell/sharp
- **Purpose:** High-performance image processing; used for generating PWA icons.

### tsx
- **Version:** 4.21.0
- **License:** MIT
- **Copyright:** Copyright (c) Hiroki Osame
- **URL:** https://github.com/privatenumber/tsx
- **Purpose:** TypeScript execution engine; used to run scripts like database seeding.

### Drizzle Kit
- **Version:** 0.31.9
- **License:** MIT
- **Copyright:** Copyright (c) 2022-2024 Drizzle Team
- **URL:** https://github.com/drizzle-team/drizzle-kit-mirror
- **Purpose:** CLI toolkit for Drizzle ORM; handles database migrations and schema generation.

### @types/better-sqlite3
- **Version:** 7.6.13
- **License:** MIT
- **Copyright:** Copyright (c) Microsoft Corporation.
- **URL:** https://github.com/DefinitelyTyped/DefinitelyTyped
- **Purpose:** TypeScript type definitions for better-sqlite3.

### @types/node
- **Version:** 20.19.34
- **License:** MIT
- **Copyright:** Copyright (c) Microsoft Corporation.
- **URL:** https://github.com/DefinitelyTyped/DefinitelyTyped
- **Purpose:** TypeScript type definitions for Node.js APIs.

### @types/node-cron
- **Version:** 3.0.11
- **License:** MIT
- **Copyright:** Copyright (c) Microsoft Corporation.
- **URL:** https://github.com/DefinitelyTyped/DefinitelyTyped
- **Purpose:** TypeScript type definitions for node-cron.

### @types/react
- **Version:** 19.2.14
- **License:** MIT
- **Copyright:** Copyright (c) Microsoft Corporation.
- **URL:** https://github.com/DefinitelyTyped/DefinitelyTyped
- **Purpose:** TypeScript type definitions for React.

### @types/react-dom
- **Version:** 19.2.3
- **License:** MIT
- **Copyright:** Copyright (c) Microsoft Corporation.
- **URL:** https://github.com/DefinitelyTyped/DefinitelyTyped
- **Purpose:** TypeScript type definitions for React DOM.
