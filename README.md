# AnyCable Next.js/Vercel Example

This is an example of how to use [AnyCable](https://anycable.io) with [Next.js](https://nextjs.org) and [Vercel](https://vercel.com) to build real-time applications.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanycable%2Fvercel-anycable-demo&env=CABLE_URL,ANYCABLE_HTTP_BROADCAST_URL,ANYCABLE_HTTP_BROADCAST_SECRET,ANYCABLE_JWT_ID_KEY&envDescription=Link%20Vercel%20application%20with%20AnyCable%20server&envLink=https%3A%2F%2Fgithub.com%2Fanycable%2Fvercel-anycable-demo&project-name=vercel-anycable-demo&repository-name=vercel-anycable-demo)

Learn more about AnyCable for serverless JavaScript apps in [the documentation](https://docs.anycable.io/guides/serverless).

## Deployment

### Prerequisites

You need to deploy AnyCable-Go server to the platform of your choice. For a quick start, we recommend using [Fly.io](https://fly.io) and provide an example configuraiton.

> [!NOTE]
> AnyCable-Go can be deployed to any platform. We use Fly.io in this example because it's easy to deploy and manage.

Using [fly CLI](https://fly.io/docs/hands-on/install-flyctl/), run the following command to create and launch a new AnyCable-Go application:

```sh
# Create a new Fly application
fly launch --image anycable/anycable-go:1.4 --generate-name --ha=false --internal-port 8080 --env PORT=8080 --env ANYCABLE_PRESETS=fly,broker
```

Answer all the questions ("No" to all database-related questions, "Yes" to deployment). In the end, you will a `fly.toml` file with the minimal configuration for your app. See also [fly.toml.example](./fly.toml.example) to learn more about other available (and recommended) configuration options.

### Steps

- Click on "Deploy" button

- Fill the required environment variables as follows:

  ```env
  CABLE_URL=wss://<YOUR_ANYCABLE_GO_HOSTNAME>/cable
  ANYCABLE_HTTP_BROADCAST_URL=https://<YOUR_ANYCABLE_GO_HOSTNAME>/_broadcast
  ANYCABLE_HTTP_BROADCAST_SECRET=<YOUR_SECRET>
  ANYCABLE_JWT_ID_KEY=<YOUR_JWT_SECRET>
  ```

  Feel free to use any strings as secrets (but don't forget to keep them in a safe and secure place).

- Finally, link AnyCable-Go server with your Vercel app by setting the following environment variables (at the AnyCable-Go side):

  ```env
  ANYCABLE_RPC_HOST=https://<YOUR_VERCEL_APP_HOSTNAME>/api/anycable
  ANYCABLE_HTTP_BROADCAST_SECRET=<YOUR_SECRET>
  ANYCABLE_JWT_ID_KEY=<YOUR_JWT_SECRET>
  ```

When using Fly, you can keep all env vars in the `.env.production` file and import the secrets using the following command:

```sh
cat .env.production | fly secrets import
```

In the Vercel app configuration, you can copy-paste the contents of the `.env.production` file (or import it) on the Environment Variables configuration page.

### Authentication

We use [AnyCable JWT identification](https://docs.anycable.io/anycable-go/jwt_identification) feature to issue JWT tokens to authenticate clients. The benefit of using AnyCable JWTs is the ability to verify and identify clients at the WebSocket server side without making additional requests to the backend (Vercel functions in our case).

The `ANYCABLE_JWT_ID_KEY` environment variable is responsible for that.

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
