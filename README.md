
# FlixFlex

FlixFlex is a backend service designed to offer an extensive catalog of movies and series, allowing users to interact with this data through various functionalities such as registration, login, favorites management, and detailed searches. This service is built using **NestJS**, **TypeScript**, and **MongoDB**, leveraging the TMDB API for fetching movies and series data.

## API Documentation

I have documented all the endpoints using Swagger, which provides a clear and interactive interface for exploring the available endpoints. You can test the API directly through the Swagger UI:

- **Swagger API Documentation:** `/api-docs`

## Features

- User Authentication (SignUp/Login)
- Fetching movie and series details
- Managing favorites list
- Searching for movies and series
- Fetching movies and series in pages of 10
- Custom caching mechanism for efficient API usage

## Running the Project

To run the project locally, follow these steps:

1. Create a `.env` file in the root directory, following the structure of `.env copy`, but remove the word "copy" from the filename.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run start:dev
   ```

Now, the service should be running locally!
