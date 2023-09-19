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

# AnyCable-Go
brew install anycable-go
```

See [AnyCable-Go documentation](https://docs.anycable.io/anycable-go/getting_started?id=installation) for other installations options.

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

Using [fly CLI](https://fly.io/docs/hands-on/install-flyctl/), run the following commands:

```sh
# Create a new Fly application
fly apps create --name=vercel-cable

# Deploy the app using the fly.toml configuration
fly deploy
```

Finally, connect the AnyCable-Go app to your Vercel app:

```sh
fly secrets set ANYCABLE_RPC_HOST=https://<YOUR_VERCEL_APP_HOSTNAME>/api/anycable
```

In the Vercel app configuration, specify the following env vars:

- `CABLE_URL`: set it to `<YOUR_FLY_APP_HOSTNAME>/cable` (e.g., `wss://vercel-cable.fly.dev/cable`).
- `ANYCABLE_BROADCAST_URL`: set it to `<YOUR_FLY_APP_HOSTNAME>/_broadcast` (e.g., `https://vercel-cable.fly.dev/_broadcast`).

It's recommend to protect the broadcasting endpoint with a secret token. You can do it by setting the `ANYCABLE_HTTP_BROADCAST_SECRET` environment variable for **both apps**:

```sh
fly secrets set ANYCABLE_HTTP_BROADCAST_SECRET=<YOUR_SECRET>
```

Set the same secret in the Vercel app configuration.

### Authentication

We use [AnyCable JWT identification](https://docs.anycable.io/anycable-go/jwt_identification) feature to issue JWT tokens to authenticate clients. The benefit of using AnyCable JWTs is the ability to verify and identify clients at the WebSocket server side without making additional requests to the backend (Vercel functions in our case).

In order to fully leverage this feature, configure the same JWT secret via the `ANYCABLE_JWT_ID_KEY` environment variable for **both apps**.
