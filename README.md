# CineScope 🎬

> A full-stack movie discovery application built as part of the **Trackzio Full-Stack Developer Intern Screening Assignment**.

CineScope is a responsive movie discovery web application that allows users to discover movies without searching, search by title, explore movies by genre and other attributes, change result ordering, navigate through large result sets, view detailed movie information, and maintain a persistent wishlist.

The application follows a **frontend → backend → external API/database** architecture. The React frontend communicates only with the Node.js backend, while the backend handles TMDB integration, data normalization, caching, validation, error handling, and MongoDB persistence.

---

## 🔗 Live Demo & Repository

### Live Application

**Frontend:**
https://cine-scope-seven-sepia.vercel.app/

### Backend API

**Backend:**
https://cinescope-backend-1h9d.onrender.com/

### GitHub Repository

https://github.com/abhiyamini22/CineScope

---

# 📌 Trackzio Assignment Objective

The assignment required building a movie discovery experience where users can:

* Browse movies without performing a search
* Search movies by title
* Explore movies using categories and attributes
* Change result ordering
* Continue exploring large result sets
* Open detailed movie information
* Add and remove movies from a wishlist
* Persist wishlist data across page refreshes and browser sessions
* Navigate between pages without losing context
* Receive clear loading, empty, and error feedback
* Experience the application responsively across different screen sizes

A key architectural requirement was that the frontend should **not communicate directly with the external movie API**.

CineScope addresses this by routing all movie-related requests through a Node.js/Express backend.

---

# ✨ Features

## Movie Discovery

* Browse popular and trending movies
* Discover movies without searching
* Explore movies by genre
* Filter movies by year
* Filter by rating
* Sort movies using different ordering options
* Pagination for large result sets

## Search

* Search movies by title
* Debounced search input
* Pagination for search results
* Loading state while searching
* Empty state when no movies are found
* Error handling for failed requests

## Movie Details

* Movie title
* Overview
* Poster
* Backdrop
* Release date
* Rating
* Popularity
* Genres
* Runtime
* Wishlist action

## Wishlist

* Add movies to wishlist
* Remove movies from wishlist
* Persistent wishlist storage
* MongoDB-backed persistence
* Duplicate prevention
* Wishlist state synchronized with the frontend
* Anonymous device identification using a generated localStorage ID

## Responsive UI

* Desktop layout
* Tablet layout
* Mobile layout
* Responsive movie grids
* Responsive movie detail pages
* Adaptive navigation
* Optimized poster and backdrop presentation

## Reliability & Performance

* Backend API abstraction
* TMDB response normalization
* In-memory caching
* Debounced search
* Pagination
* Lazy-loaded images
* Centralized validation
* Centralized error handling
* API rate limiting
* CORS protection
* Security headers using Helmet

---

# 🏗️ Architecture

CineScope follows a layered full-stack architecture:

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│  UI • Routing • Search       │
│  Filters • Wishlist State    │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│      Node.js + Express       │
│                              │
│ Validation                   │
│ Controllers                  │
│ Services                     │
│ TMDB Integration             │
│ Data Normalization           │
│ Cache                        │
│ Error Handling               │
│ Security                     │
└──────────────┬───────────────┘
               │
        ┌──────┴───────────┐
        │                  │
        ▼                  ▼
┌──────────────┐    ┌──────────────┐
│     TMDB     │    │   MongoDB    │
│              │    │              │
│ Movie Data   │    │  Wishlist    │
└──────────────┘    └──────────────┘
```

### Important architectural decision

The frontend **never calls TMDB directly**.

Instead:

```text
React
  ↓
CineScope Backend
  ↓
TMDB
```

This keeps the TMDB API key server-side and allows the backend to control:

* API integration
* Data normalization
* Caching
* Validation
* Error handling
* Rate limiting
* External API failures

---

# 🔄 Application Flow

### Movie Discovery Flow

```text
User opens CineScope
        ↓
Frontend requests movie data
        ↓
Backend receives request
        ↓
Backend checks cache
        ↓
If cache is available
        ↓
Return cached response

If cache is unavailable
        ↓
Backend requests data from TMDB
        ↓
TMDB response is normalized
        ↓
Response stored in cache
        ↓
Normalized data returned to frontend
        ↓
Movie cards displayed
```

### Wishlist Flow

```text
User clicks "Add to Wishlist"
        ↓
Frontend sends movie information
        ↓
Backend validates request
        ↓
MongoDB stores wishlist entry
        ↓
Frontend updates wishlist state
```

A generated anonymous user ID is stored in localStorage so the same browser/device can retrieve its wishlist later.

---

# 🧩 Tech Stack

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **Axios**
* **Context API**
* **Lucide React**

## Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **Axios**
* **Mongoose**
* **Zod**
* **Helmet**
* **CORS**
* **express-rate-limit**

## Database

* **MongoDB**

## External API

* **The Movie Database (TMDB) API**

## Deployment

* **Vercel** — Frontend
* **Render** — Backend
* **MongoDB Atlas** — Database

---

# 📁 Project Structure

```text
CineScope/
│
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

> Actual `.env` files are intentionally excluded from version control.

---

# 🌐 API Endpoints

## Movie Endpoints

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | `/api/movies/popular`       | Get popular movies           |
| GET    | `/api/movies/trending`      | Get trending movies          |
| GET    | `/api/movies/search?query=` | Search movies                |
| GET    | `/api/movies/discover`      | Discover movies with filters |
| GET    | `/api/movies/:id`           | Get movie details            |
| GET    | `/api/genres`               | Get available genres         |

## Wishlist Endpoints

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/api/wishlist`          | Get wishlist          |
| POST   | `/api/wishlist`          | Add movie to wishlist |
| DELETE | `/api/wishlist/:movieId` | Remove movie          |
| GET    | `/api/wishlist/:movieId` | Check wishlist status |

## Health Check

```text
GET /api/health
```

Used to verify that the backend service is running.

---

# 🗄️ Database Design

MongoDB is used to persist wishlist information.

A wishlist document contains only the fields required by the application:

```ts
{
  userId: string,
  movieId: number,
  title: string,
  posterPath?: string,
  releaseDate?: string,
  rating?: number,
  createdAt: Date
}
```

### Duplicate Prevention

A unique compound index is created using:

```text
userId + movieId
```

This prevents the same movie from being added multiple times for the same anonymous user.

---

# 👤 Anonymous Wishlist Identification

CineScope does not require account registration for the assignment.

Instead, the frontend generates a unique anonymous identifier and stores it in localStorage.

```text
Browser
   ↓
Generated User ID
   ↓
localStorage
   ↓
Wishlist API
   ↓
MongoDB
```

This allows wishlist data to remain available after:

* Page refresh
* Route changes
* Browser close and reopen

### Limitation

Because there is no authentication system, the wishlist is tied to the anonymous browser/device identifier rather than a real user account.

---

# ⚡ Caching Strategy

The backend uses a lightweight **in-memory cache**.

Cache keys are generated based on the requested endpoint and relevant query parameters.

For example:

```text
discover?page=1&genre=28&sort=popularity.desc
```

Repeated requests can therefore return cached data instead of repeatedly requesting TMDB.

### Benefits

* Reduces unnecessary external API calls
* Improves response time for repeated requests
* Helps reduce pressure on TMDB
* Simple to implement for a single backend instance

### Production improvement

For multiple backend instances, the in-memory cache should be replaced with a shared cache such as Redis.

---

# 🔎 Search & Filtering

The application supports multiple discovery controls:

* Search by title
* Genre
* Year
* Minimum rating
* Sorting
* Pagination

### Debounced Search

Search requests are debounced so that the backend is not called for every keystroke.

Example:

```text
User types:
m → mo → mov → movie

Instead of sending 5 requests,
CineScope waits briefly and sends
the final search request.
```

This reduces unnecessary API calls and improves the search experience.

---

# 📄 Pagination

Large result sets are handled using pagination rather than loading every movie at once.

Example:

```text
Page 1
   ↓
Page 2
   ↓
Page 3
   ↓
Page 4
   ↓
...
```

This improves:

* Initial loading time
* Memory usage
* Rendering performance
* User experience with large datasets

---

# 🛡️ Error Handling

CineScope uses centralized error handling to provide consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Unable to fetch movies at the moment."
}
```

The application handles scenarios including:

* Invalid requests
* Missing parameters
* TMDB failures
* Slow external API responses
* MongoDB failures
* Rate limits
* Missing movie information
* Unexpected external API data
* Empty search results
* Network errors

The frontend provides appropriate:

* Loading states
* Empty states
* Error states
* Retry/navigation options

---

# 🔐 Security Considerations

Several basic security practices are implemented:

### API Key Protection

The TMDB API key is stored only on the backend.

```text
Frontend ❌ → TMDB

Frontend → Backend → TMDB ✅
```

The key is never exposed through frontend source code.

### Environment Variables

Secrets are stored in `.env` files and deployment environment variables.

Actual `.env` files are excluded from Git using `.gitignore`.

### Helmet

Helmet is used to add common HTTP security headers.

### CORS

CORS is configured to allow requests only from the configured frontend origin.

### Rate Limiting

The backend uses `express-rate-limit` to reduce excessive API requests.

### Input Validation

Zod is used to validate incoming request data.

---

# 🚀 Performance Considerations

CineScope includes several performance-oriented decisions:

* Debounced search
* Backend caching
* Pagination
* Lazy-loaded images
* Reusable components
* Centralized state management
* Minimal wishlist data storage
* Normalized API responses
* Avoiding direct frontend-to-TMDB communication

These choices help keep the application responsive while working with potentially large movie datasets.

---

# 🎨 Responsive Design

The UI is designed to work across different viewport sizes.

Supported layouts include:

```text
Desktop
   ↓
Tablet
   ↓
Mobile
```

The design considers:

* Different screen widths
* Responsive movie grids
* Poster aspect ratios
* Long movie titles
* Movie detail layouts
* Search controls
* Navigation
* Large result sets

---

# 🧠 Key Technical Decisions

## Why React?

React provides a component-based architecture suitable for building reusable movie cards, filters, navigation, wishlist controls, and detail views.

## Why TypeScript?

TypeScript provides static typing for:

* API responses
* Movie objects
* Component props
* State
* Backend request/response structures

This reduces runtime errors and makes the code easier to maintain.

## Why Node.js + Express?

The assignment required the frontend to communicate through a backend abstraction layer.

Node.js and Express provide a lightweight REST API layer for:

* TMDB integration
* Validation
* Caching
* Wishlist APIs
* Error handling

## Why MongoDB?

Wishlist data is document-oriented and relatively simple, making MongoDB a suitable choice for storing movie metadata and anonymous user identifiers.

## Why Context API?

The wishlist state is shared across multiple frontend components and routes. Context API provides a simple solution without introducing unnecessary state-management complexity for this project.

## Why In-Memory Cache?

The assignment does not require a distributed infrastructure. An in-memory TTL cache provides a lightweight solution while keeping the architecture simple.

For a production multi-instance system, Redis would be a better choice.

---

# ⚙️ Local Setup

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/abhiyamini22/CineScope.git
cd CineScope
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🔑 Environment Configuration

Create local `.env` files using the provided `.env.example` files.

## Backend `.env`

```env
PORT=5000
CLIENT_URL=http://localhost:5173
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Never commit real API keys, database passwords, or other secrets to GitHub.

---

# ▶️ Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🧪 Testing

Backend tests are included for validation and normalization-related logic.

Run:

```bash
cd backend
npm test
```

The application was also manually tested for:

* Movie discovery
* Search
* Genre filtering
* Sorting
* Pagination
* Movie details
* Wishlist creation
* Wishlist removal
* Wishlist persistence
* Page refresh
* Direct route navigation
* Empty results
* API errors
* Responsive layouts
* Production deployment

---

# 🌍 Deployment

## Frontend — Vercel

The React/Vite frontend is deployed using Vercel.

Production frontend:

https://cine-scope-seven-sepia.vercel.app/

The Vercel project uses the `frontend` directory as the project root.

The following environment variable is configured:

```text
VITE_API_BASE_URL
```

Production value:

```text
https://cinescope-backend-1h9d.onrender.com/api
```

A Vercel configuration is included to ensure React Router routes work correctly during direct navigation.

---

## Backend — Render

The Node.js/Express backend is deployed using Render.

Production backend:

https://cinescope-backend-1h9d.onrender.com/

The backend is configured with deployment environment variables for:

* TMDB API key
* TMDB base URL
* MongoDB connection
* Frontend origin
* Port
* Production environment

Secrets are stored through Render's environment configuration rather than committed to GitHub.

---

## Database — MongoDB Atlas

MongoDB Atlas is used as the managed production database.

The backend connects to Atlas using the MongoDB connection string stored in the backend environment configuration.

---

# 🎬 Demo Flow

A recommended demonstration flow for the Trackzio assignment is:

### 1. Discover

Open the application and show that movies are available immediately without searching.

### 2. Explain Architecture

Briefly explain:

```text
React → CineScope Backend → TMDB
```

The frontend does not call TMDB directly.

### 3. Explore

Demonstrate:

* Genre
* Year
* Rating
* Sorting
* Pagination

### 4. Movie Details

Open a movie and demonstrate:

* Movie information
* Rating
* Genres
* Release date
* Runtime
* Wishlist action

### 5. Wishlist

Add a movie to the wishlist.

Open the Wishlist page.

Refresh the browser and show that the movie remains saved.

### 6. Search

Use the search feature to demonstrate:

* Debounced input
* Search results
* Pagination
* Empty-result handling

### 7. Responsive UI

Resize the browser or use device emulation to demonstrate responsive layouts.

---

# 📸 Screenshots

Screenshots can be added here for the final submission.

Recommended screenshots:

### Discover Page

```text
Add screenshot here
```

### Search & Filters

```text
Add screenshot here
```

### Movie Details

```text
Add screenshot here
```

### Wishlist

```text
Add screenshot here
```

### Mobile Responsive View

```text
Add screenshot here
```

---

# 🤖 AI Usage Disclosure

AI tools were used as development support during the implementation of CineScope.

AI assistance was used for:

* Understanding API documentation
* Generating initial project boilerplate
* Exploring implementation approaches
* Debugging development and deployment issues
* Reviewing code structure
* Investigating errors
* Improving UI implementation ideas
* Preparing documentation

The final application architecture, functionality, configuration, testing, deployment, and implementation were reviewed and understood by me.

I am responsible for the final submitted implementation and can explain, debug, and extend the project.

---

# ⚠️ Assumptions

The following assumptions were made during development:

* This is an anonymous demo application.
* User authentication is not required for the assignment.
* A generated localStorage identifier is used to associate wishlist entries with a browser/device.
* TMDB is used as the external movie data provider.
* TMDB may occasionally experience rate limits or temporary failures.
* The backend acts as the abstraction layer between the frontend and TMDB.
* MongoDB Atlas is used for persistent wishlist storage in the deployed application.

---

# ⚠️ Known Limitations

### No Authentication

There is currently no real user registration or login system.

### Anonymous Wishlist

Wishlist data is associated with a generated browser/device identifier.

Clearing localStorage or switching devices will not provide access to the previous anonymous wishlist.

### In-Memory Cache

The cache exists only within a single backend process.

Restarting the server clears the cache.

### Single Backend Instance

The current architecture is suitable for the assignment and a small deployment but is not designed for large-scale multi-instance deployment.

---

# 🔮 Future Improvements

Possible future improvements include:

* Real user authentication
* Multi-user wishlist accounts
* OAuth login
* Redis-based distributed caching
* Advanced movie recommendations
* Personalized recommendation engine
* Cast and crew information
* Streaming provider information
* Watch history
* Ratings and reviews
* Infinite scrolling
* Advanced filtering
* Progressive Web App support
* Automated frontend and backend testing
* CI/CD pipeline
* Monitoring and centralized logging
* Horizontal backend scaling

---

# 📚 API Data Source

Movie information is provided through the **TMDB API**.

CineScope uses TMDB as an external data source while keeping API communication behind the application's backend service.

The frontend receives only the normalized application-facing data structure.

---

# 📦 Normalized Movie Model

The backend converts external TMDB movie responses into a stable application model:

```ts
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  rating: number;
  popularity: number;
  genres: string[];
  runtime: number | null;
}
```

This prevents the frontend from becoming tightly coupled to the exact structure of the external API.

---

# 🧱 Design Principles

CineScope was developed with the following principles:

* Separation of concerns
* Reusable components
* Typed API contracts
* Backend abstraction
* Secure environment configuration
* Minimal data storage
* Graceful error handling
* Responsive design
* Performance-aware API usage
* Maintainable project structure

---

# 👩‍💻 Developer

**Abhi Yamini**

BE Computer Science and Engineering
Artificial Intelligence & Machine Learning

GitHub:
https://github.com/abhiyamini22

---

# 📄 License

This project was developed as a technical screening assignment and portfolio project.

---

## ⭐ Project Summary

CineScope demonstrates a complete full-stack workflow:

```text
React + TypeScript
        ↓
REST API
        ↓
Node.js + Express
        ↓
TMDB + MongoDB
        ↓
Vercel + Render + MongoDB Atlas
```

The project focuses on building a practical movie discovery experience while addressing API abstraction, persistence, caching, validation, error handling, responsive design, and scalable architecture.
