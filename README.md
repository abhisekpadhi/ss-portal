# SureSampatti Admin Portal
This is the admin portal to manage suresampatti.

Visit the Live portal [Link](https://portal.suresampatti.com)

## How to setup
- Close and install dependencies
```shell
git clone git@github.com:abhisekpadhi/suresampatti-admin-portal.git
cd suresampatti-admin-portal/
yarn
```
- 
- Run the development server:
```bash
npm run dev
# or
yarn dev
```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
This project is deployed with vercel.
- Each commit to `main` is deployed to vercel but you need to manually go to vercel dashboard to promote the build to production.

### Why vercel?
- We are using NextJS `middlewares`, `dynamic routes` for pages and api. 
- To get these features working Netlify & Cloudflare pages were proving to be uphill battle.
- Caveat: To use vercel free of cost, this project had to moved out of github organisation into a personal account and made publicly visible repository.
- IMP: Do not commit sensitive secrets (ex: username/passowords, API Keys)
