# AnyCable Next.js/Vercel Example

This is an example of how to use [AnyCable](https://anycable.io) with [Next.js](https://nextjs.org) and [Vercel](https://vercel.com) to build real-time applications.

## Architecture overview

The Next.js app is deployed to Vercel. AnyCable-Go is deployed to [Fly.io](https://fly.io) and communicates with the Next app via Vercel serverless functions for authorization and handling RPC calls over WebSockets.

> [!NOTE]
> AnyCable-Go can be deployed to any platform. We use Fly.io in this example because it's easy to deploy and manage.

## Running locally

> [!NOTE]
> [PNPM](https://pnpm.io/installation) is required to install dependencies.

First, install the dependencies:

```bash
# Next.js project
pnpm install
```

Then, start AnyCable-Go:

```bash
pnpm anycable-go
```

And start the Next.js app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying the app

### Deploying the Next.js app

Check out [Next.js documentation](https://nextjs.org/docs/pages/building-your-application/deploying#managed-nextjs-with-vercel) for more details.

### Deploying AnyCable-Go

Using [fly CLI](https://fly.io/docs/hands-on/install-flyctl/), run the following command to create and launch a new AnyCable-Go application:

```sh
# Create a new Fly application
fly launch --image anycable/anycable-go:1.4 --generate-name --ha=false --internal-port 8080 --env PORT=8080 --env ANYCABLE_PRESETS=fly,broker
```

Answer all the questions ("No" to all database-related questions, "Yes" to deployment). In the end, you will a `fly.toml` file with the minimal configuration for your app. See also [fly.toml.example](./fly.toml.example) to learn more about other available (and recommended) configuration options.

### Configuring and linking the apps

Now, we need to tell both apps how to find each other and configure shared secrets. For that, we recommend creating an `.env.production` file with the following contents:

```env
CABLE_URL=wss://<YOUR_FLY_APP_HOSTNAME>/cable
ANYCABLE_RPC_HOST=https://<YOUR_VERCEL_APP_HOSTNAME>/api/anycable
ANYCABLE_HTTP_BROADCAST_URL=https://<YOUR_FLY_APP_HOSTNAME>/_broadcast
ANYCABLE_HTTP_BROADCAST_SECRET=<YOUR_SECRET>
ANYCABLE_JWT_ID_KEY=<YOUR_JWT_KEY>
```

Now, let's provision our apps with these parameters. First, let's set Fly secrets using the following command:

Finally, we neet to link the AnyCable-Go app with your Vercel app:

```sh
cat .env.production | fly secrets import
```

In the Vercel app configuration, you can copy-paste the contents of the `.env.production` file (or import it) on the Environment Variables configuration page.

### Authentication

We use [AnyCable JWT identification](https://docs.anycable.io/anycable-go/jwt_identification) feature to issue JWT tokens to authenticate clients. The benefit of using AnyCable JWTs is the ability to verify and identify clients at the WebSocket server side without making additional requests to the backend (Vercel functions in our case).

The `ANYCABLE_JWT_ID_KEY` environment variable is responsible for that.
