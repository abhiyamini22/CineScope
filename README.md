# CineScope

## Project title
CineScope

## Project description
CineScope is a movie discovery web application built for a Trackzio screening assignment. Users can browse popular and trending movies, search by title, filter by genre and year, sort results, view movie details, and maintain a persistent wishlist.

## Features
- Discover page with polished dark cinematic layout
- Debounced search experience
- Genre, sort, year, and rating filters
- Pagination for large result sets
- Detailed movie view with metadata and wishlist actions
- Persistent wishlist stored in MongoDB
- Backend TMDB integration with normalization and caching
- Responsive layout for desktop and mobile
- Centralized validation and error handling

## Tech stack
### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API
- Lucide React

### Backend
- Node.js
- Express.js
- TypeScript
- Axios
- Mongoose
- MongoDB
- Zod
- Helmet
- CORS
- express-rate-limit

## Architecture
The app follows a clean layered design:

- Frontend: UI, routing, search, filters, and wishlist UX
- Backend: validation, TMDB integration, normalization, cache, and security
- MongoDB: persistent wishlist storage
- TMDB: external API used only through backend service calls

The frontend never calls TMDB directly.

## Application flow
1. User opens the home page and requests discover results.
2. Frontend calls the backend API.
3. Backend checks the in-memory cache before reaching TMDB.
4. TMDB result is normalized into a stable app-facing structure.
5. User can search, filter, sort, paginate, and open a detail page.
6. Wishlist actions are sent to MongoDB-backed endpoints and persisted using a generated local storage user ID.

## Folder structure

```text
cinescope/
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
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

## API endpoints
### Movie endpoints
- GET /api/movies/popular
- GET /api/movies/trending
- GET /api/movies/search?query=
- GET /api/movies/discover
- GET /api/movies/:id
- GET /api/movies/genres

### Wishlist endpoints
- GET /api/wishlist
- POST /api/wishlist
- DELETE /api/wishlist/:movieId
- GET /api/wishlist/:movieId

## Database schema
Wishlist entries store only the minimal fields required:

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

A unique compound index on `userId` and `movieId` prevents duplicates.

## Caching strategy
The backend uses a lightweight in-memory cache keyed by endpoint and query values. Movie list responses expire after a TTL so repeated requests do not repeatedly hit TMDB.

## Error handling strategy
The backend centralizes error handling and returns consistent JSON responses such as:

```json
{
  "success": false,
  "message": "Unable to fetch movies at the moment."
}
```

This covers validation errors, TMDB failures, MongoDB issues, rate limits, and missing movie data.

## Performance considerations
- Debounced frontend search
- Backend caching for frequent requests
- Pagination instead of loading all results at once
- Reusable UI components
- Lazy-loaded images
- Local wishlist state managed through Context API

## Setup instructions
### 1. Install backend dependencies
```bash
cd backend
npm install
```

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

### 3. Configure environment files
Create real local `.env` files based on the examples in the repo and supply your own TMDB key.

## Environment variables
### Backend
- TMDB_API_KEY
- TMDB_BASE_URL
- MONGODB_URI
- PORT
- CLIENT_URL
- NODE_ENV

### Frontend
- VITE_API_BASE_URL

## Running frontend
```bash
cd frontend
npm run dev
```

## Running backend
```bash
cd backend
npm run dev
```

## Demo flow
1. Open `http://localhost:5173`.
2. Show the Discover page and explain that the frontend calls the backend, not TMDB directly.
3. Change the genre, year, rating, and sort controls to demonstrate server-side discovery parameters.
4. Open a movie details page and add the movie to the wishlist.
5. Open Wishlist and refresh the page to demonstrate persistence through MongoDB.
6. Use Search to demonstrate debounced title lookup and pagination.

## Deployment notes
- Deploy the frontend as a Vite static site on Vercel. Set the Vercel project root directory to `frontend` and add `VITE_API_BASE_URL` with the deployed backend URL.
- The frontend includes `frontend/vercel.json` so React Router routes resolve correctly on direct navigation.
- Deploy the backend as a Node.js service and provide all backend environment variables through the hosting provider's secret configuration.
- Use a managed MongoDB deployment for production instead of a local database.
- Restrict `CLIENT_URL` to the deployed frontend origin and keep `TMDB_API_KEY` server-side.
- Replace the in-memory cache with Redis when running multiple backend instances.

For a local demo, MongoDB must be running before starting the backend. Start the backend and frontend in separate terminals, then open `http://localhost:5173`.

## Testing
The project includes backend tests for validation and normalization logic.

```bash
cd backend
npm test
```

## Screenshots
Add screenshots here after running the app locally.

## Assumptions
- This is an anonymous, no-auth demo app.
- The frontend uses a generated localStorage user ID for persistent wishlist behavior.
- TMDB may rate-limit or occasionally fail, so the app handles these gracefully.

## Known limitations
- No real authentication or multi-user account model.
- The cache is in-memory and local to a single server process.
- Wishlist persistence is tied to the anonymous device ID.

## Future improvements
- Add real authentication and multi-user wishlist support
- Move cache to Redis for scaling
- Add cast, crew, and provider data
- Add more advanced recommendations and filtering

## AI usage disclosure
AI tools were used as development support to understand API documentation, generate initial boilerplate, investigate errors, and review implementation ideas. Architectural decisions, application behavior, and final implementation were reviewed and understood by me.
