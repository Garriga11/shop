# Shop

A modern web application built with Next.js, TypeScript, and Prisma. 

 **Live Demo**: [https://shop-drab-ten.vercel.app](https://shop-drab-ten.vercel.app)

## Features


-  Authentication system with NextAuth. js
-  Database integration with Prisma ORM
-  Styled with Tailwind CSS
-  Responsive design
-  State management with Redux
-  Data visualization with Recharts


## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Database ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**:  Radix UI, Heroicons
- **State Management**:  Redux
- **Charts**: Recharts
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn
- A database (PostgreSQL, MySQL, or SQLite)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Garriga11/shop.git
cd shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (create a `.env` file in the root directory)

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database (optional):
```bash
npm run postinstall
```

### Development

Run the development server: 

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Project Structure

```
shop/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and libraries
├── prisma/          # Prisma schema and migrations
├── public/          # Static assets
├── types/           # TypeScript type definitions
├── invl/            # Additional modules
├── auth. ts          # Authentication configuration
├── middleware.ts    # Next.js middleware
└── package.json     # Project dependencies
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run postinstall` - Generate Prisma client

## License

This project is private and not licensed for public use.

Built with  using Next.js and TypeScript

This app does not contain any vulnerabilities including the most recet React exploit CVE-2025-55182. All packages have been updated. 

---

## Author

**Garriga**

