# tp_uade_back_appi

Backend API built with TypeScript and Express for UADE project.

## 🚀 Features

- **TypeScript**: Fully typed codebase for better development experience
- **Express**: Fast, unopinionated web framework
- **Sequelize**: ORM for PostgreSQL database
- **JWT Authentication**: Secure token-based authentication
- **Bcryptjs**: Password hashing for security
- **Nodemailer**: Email functionality for notifications
- **CORS**: Cross-Origin Resource Sharing enabled
- **NPM & PNPM Compatible**: Works with both package managers

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- npm or pnpm package manager

## 🔧 Installation

### Using NPM

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Using PNPM

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## 🗃️ Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE uade_db;
```

2. Update your `.env` file with the database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uade_db
DB_USER=your_username
DB_PASSWORD=your_password
```

## 🏃‍♂️ Running the Application

### Development Mode

**With NPM:**
```bash
npm run dev
```

**With PNPM:**
```bash
pnpm dev
```

### Production Mode

**Build the application:**
```bash
# With NPM
npm run build

# With PNPM
pnpm build
```

**Start the server:**
```bash
# With NPM
npm start

# With PNPM
pnpm start
```

## 🛠️ Available Scripts

- `npm run dev` / `pnpm dev` - Start development server with hot reload
- `npm run build` / `pnpm build` - Build the TypeScript code
- `npm start` / `pnpm start` - Start production server
- `npm run lint` / `pnpm lint` - Run ESLint
- `npm run lint:fix` / `pnpm lint:fix` - Fix ESLint issues

## 📁 Project Structure

```
tp_uade_back_appi/
├── src/
│   ├── config/          # Configuration files (database, email)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware (auth, etc.)
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions (JWT, etc.)
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

### Users (Protected Routes - Require Authentication)

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith"
  }
  ```
- `GET /api/users` - Get all users

### Authentication Header

For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🌍 Environment Variables

See `.env.example` for all available environment variables:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `DB_*`: Database configuration
- `JWT_*`: JWT configuration
- `SMTP_*`: Email configuration

## 📦 Main Dependencies

- **express**: ^4.18.2 - Web framework
- **sequelize**: ^6.35.2 - ORM for SQL databases
- **pg**: ^8.11.3 - PostgreSQL client
- **nodemailer**: ^6.9.7 - Email sending
- **bcryptjs**: ^2.4.3 - Password hashing
- **jsonwebtoken**: ^9.0.2 - JWT authentication
- **dotenv**: ^16.3.1 - Environment variables
- **cors**: ^2.8.5 - CORS middleware

## 🧪 Development

The project uses:
- **TypeScript** for type safety
- **ESLint** for code quality
- **ts-node-dev** for hot reload during development

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

Georges David