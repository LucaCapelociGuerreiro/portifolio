# Luca Capeloci Guerreiro - Portfolio

Portfolio website showcasing my experience as a Solutions Architect specializing in DevOps and Cloud.

## Features

- Responsive design
- Dark/light mode
- Multi-language support (English and Portuguese)
- Skills and certifications showcase
- Professional experience timeline

## Technologies Used

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Internationalization with custom context

## Running Locally

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Deployment

### Building and Running with Docker

Build the Docker image:

```bash
docker build -t portfolio .
```

Run the container:

```bash
docker run -p 3000:3000 portfolio
```

### Using Docker Compose

The easiest way to run the application is with Docker Compose:

```bash
docker-compose up -d
```

This will build the image if it doesn't exist and start the container in detached mode.

To stop the container:

```bash
docker-compose down
```

## Environment Variables

No environment variables are required for basic functionality.

## License

This project is licensed under the MIT License.
