# TODO List

- [ ] **Environment Variables**: Copy `env.example` to `.env` and update secrets.
- [ ] **Database**: Ensure PostgreSQL is running and the user/db exists (see `docs/QUICKSTART.md`).
- [ ] **DNS**: Point `myinsurancebuddies.com` and `www.myinsurancebuddies.com` to your VPS IP.
- [ ] **SSL**: Run the Certbot command in `docs/QUICKSTART.md` after DNS propagation.
- [ ] **Admin User**: The seed script creates a Super Admin (`admin@myinsurancebuddies.com`). You need to update the password hash in `packages/db/prisma/seed.ts` or reset it via DB/Admin UI.
- [ ] **Content**: Add real content to the templates and blog posts.
