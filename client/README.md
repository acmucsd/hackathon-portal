This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Copy `client/.env.example` to `client/.env.local`.

   Download
   [`.env` and Firebase credentials](https://drive.google.com/drive/u/2/folders/1r9w9NFSBFmobQsJ4yXhOwaMRgGMGVs9X)
   to `server/.env` and `server/firebaseServiceAccountKey.json`.

   Add `PORT=4000` to the end of `server/.env`.

2. Run the backend database service in one terminal shell:

   ```shell
   # in server/
   $ docker-compose --env-file .env up
   ```

3. Build and run the backend server in another shell:

   ```shell
   # in server/
   $ yarn
   $ yarn db:migrate
   $ yarn build
   # Set up database
   $ yarn db:migrate
   $ yarn start
   ```

4. Run the frontend development server in a third shell:

   ```shell
   # in client/
   $ yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

   You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the
   file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to
automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!

### Useful Documentation Links:

- https://nextjs.org/docs/app/getting-started/layouts-and-pages (Creating new routes)
- We use `React-Hook-Form` for authentication: https://react-hook-form.com/
- We use useRouter to make API calls: https://nextjs.org/docs/app/api-reference/functions/use-router
- `NextResponse` for cookies: https://nextjs.org/docs/app/api-reference/functions/next-response

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.
