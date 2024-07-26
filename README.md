# WallPix

This is the WallPix API for a wallpaper application where users can upload, download, and manage wallpapers.

## Features

- User authentication (register, login)
- Wallpaper management (upload, download, favorite)
- Search and filter wallpapers
- Popular wallpapers listing
- Pagination and sorting

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Express Validator for input validation
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/wallpaper-app-api.git
cd wallpaper-app-api
```

2. Install dependencies:

```
npm install
```

3. Create a `config.env` file in the root directory and add the following environment variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:

```
npm run dev
```

The server should now be running on `http://localhost:5000`.

## API Documentation

Once the server is running, you can access the Swagger API documentation at `http://localhost:5000/api-docs`.

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Wallpapers

- GET `/api/wallpapers` - Get all wallpapers (with filtering and pagination)
- POST `/api/wallpapers` - Upload a new wallpaper (protected route)
- GET `/api/wallpapers/:id` - Get a single wallpaper
- POST `/api/wallpapers/:id/favorite` - Add wallpaper to favorites (protected route)
- GET `/api/wallpapers/:id/download` - Download a wallpaper
- GET `/api/wallpapers/popular` - Get popular wallpapers

## Error Handling

The API uses custom error handling middleware to provide consistent error responses across all endpoints.

## Security

- Helmet.js is used to set various HTTP headers for security
- Rate limiting is implemented to prevent abuse of the API
- Input validation is performed using Express Validator
- Passwords are hashed using bcrypt before storing in the database

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
