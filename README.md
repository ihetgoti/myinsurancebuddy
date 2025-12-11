# MyInsuranceBuddy

A modern insurance management application.

## Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/ihetgoti/myinsurancebuddy.git
cd myinsurancebuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment

This project uses automated CI/CD deployment to Contabo VPS via GitHub Actions.

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete setup instructions.

## Features

- Insurance policy management
- Customer relationship management
- Claims processing
- Automated workflows

## Tech Stack

- **Frontend**: React/Next.js (or your preferred framework)
- **Backend**: Node.js/Python (adjust as needed)
- **Database**: PostgreSQL/MongoDB (adjust as needed)
- **Hosting**: Contabo VPS
- **CI/CD**: GitHub Actions

## Project Structure

```
myinsurancebuddy/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
├── src/                         # Source code
├── public/                      # Static assets
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=your_database_url
API_KEY=your_api_key
PORT=3000
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
