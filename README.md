# AnyCable Next.js/Vercel Example

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanycable%2Fvercel-anycable-demo&env=CABLE_URL,ANYCABLE_HTTP_BROADCAST_URL,ANYCABLE_HTTP_BROADCAST_SECRET,ANYCABLE_JWT_ID_KEY&envDescription=Link%20Vercel%20application%20with%20AnyCable%20server&envLink=https%3A%2F%2Fgithub.com%2Fanycable%2Fvercel-anycable-demo&project-name=vercel-anycable-demo&repository-name=vercel-anycable-demo)

This is an example of how to use [AnyCable](https://anycable.io) with [Next.js](https://nextjs.org) and [Vercel](https://vercel.com) to build real-time applications.

Learn more about AnyCable for serverless JavaScript apps in [the documentation](https://docs.anycable.io/guides/serverless).

## Prerequisites

You will need to deploy an AnyCable-Go server to the platform of your choice. We recommend using [Fly.io](https://fly.io) and provide an example configuration in `fly.toml.example` for seamless deployments. However, Anycable-Go server can be deployed on any platform.

Using [fly CLI](https://fly.io/docs/hands-on/install-flyctl/), run the following command to create and launch a new AnyCable-Go application:

```sh
# Create a new Fly application
fly launch --image anycable/anycable-go:1.4 --generate-name --ha=false --internal-port 8080 --env PORT=8080 --env ANYCABLE_BROKER=memory
```

Answer "No" to all database-related questions and "Yes" to deployment. This will deploy your app and create a `fly.toml` file with the minimum configuration. See the `fly.toml.example` file to learn more about other available and recommended configuration options.

## Deployment

- Click the **Deploy** button

- Fill in the required environment variables:

  ```env
  CABLE_URL=wss://<YOUR_ANYCABLE_GO_HOSTNAME>/cable
  ANYCABLE_HTTP_BROADCAST_URL=https://<YOUR_ANYCABLE_GO_HOSTNAME>/_broadcast
  ANYCABLE_HTTP_BROADCAST_SECRET=<YOUR_SECRET>
  ANYCABLE_JWT_ID_KEY=<YOUR_JWT_SECRET>
  ```

  * The `ANYCABLE_HTTP_BROADCAST_SECRET` and `ANYCABLE_JWT_ID_KEY` can be any strings.
  * You can create a secure value using this CLI command `openssl rand -hex 32`

- Set the following environment variables on your AnyCable-Go server:

  ```env
  ANYCABLE_RPC_HOST=https://<YOUR_VERCEL_APP_HOSTNAME>/api/anycable
  ANYCABLE_HTTP_BROADCAST_SECRET=<YOUR_SECRET>
  ANYCABLE_JWT_ID_KEY=<YOUR_JWT_SECRET>
  ```

When using Fly, you can keep all env vars in the `.env.production` file and import the secrets using the following command:

```sh
cat .env.production | fly secrets import
```

When deploying to Vercel you can use the [Vercel CLI](https://vercel.com/docs/cli) to pull environment variables:

```sh
vercel env pull
```

### Authentication

We use the [AnyCable JWT identification](https://docs.anycable.io/anycable-go/jwt_identification) feature to issue JWT tokens to authenticate clients. The benefit of using AnyCable JWTs is the ability to verify and identify clients at the WebSocket server side without making additional requests to the backend (Vercel functions in our case).

The `ANYCABLE_JWT_ID_KEY` environment variable is responsible for this.

## Running locally

> [PNPM](https://pnpm.io/installation) is required to install dependencies.

First, install the dependencies:

```bash
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
