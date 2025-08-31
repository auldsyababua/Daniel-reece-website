# Development

## Local Development Environment

To run the website locally, you need to have Node.js and Hugo installed.

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm start
    ```
    This will start the Hugo server with hot reloading and run the Tailwind CSS compiler in watch mode.

## Building for Production

To build the website for production, run:

```bash
npm run build
```

This will create a `public` directory with the optimized static assets.
