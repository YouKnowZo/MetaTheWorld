# Meta The World — Deployment Guide

## Domain: metatheworld.online (Namecheap)

---

## Option 1: Vercel Deployment (RECOMMENDED)

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to web app
cd /a0/usr/workdir/Meta_The_World/apps/web

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 2: Configure Custom Domain in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Add `metatheworld.online`
5. Vercel will show you DNS records to add in Namecheap

### Step 3: Configure Namecheap DNS

1. Log in to [Namecheap](https://namecheap.com)
2. Go to **Domain List** → Click **Manage** next to `metatheworld.online`
3. Go to **Advanced DNS** tab
4. Delete existing records (if any)
5. Add these records from Vercel:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.21.21 | Automatic |
| CNAME Record | www | cname.vercel-dns.com | Automatic |

Or if Vercel shows different values, use those.

### Step 4: Enable HTTPS

- Vercel automatically provisions SSL certificates
- HTTPS will be active within minutes of DNS propagation

---

## Option 2: Custom Server Deployment

### Requirements
- VPS (AWS, DigitalOcean, Linode, etc.) with Ubuntu 20.04+
- Node.js 18+
- Nginx reverse proxy
- PM2 for process management

### Step 1: Server Setup

```bash
# On your VPS
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/YouKnowZo/Meta_The_World.git
cd Meta_The_World/apps/web

# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build
```

### Step 2: Configure PM2

```bash
# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'meta-the-world',
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/root/Meta_The_World/apps/web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

### Step 3: Configure Nginx

```bash
# Create Nginx config
sudo tee /etc/nginx/sites-available/metatheworld << 'EOF'
server {
    listen 80;
    server_name metatheworld.online www.metatheworld.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/metatheworld /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Configure SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d metatheworld.online -d www.metatheworld.online

# Auto-renewal is set up automatically
```

### Step 5: Configure Namecheap DNS

In Namecheap **Advanced DNS**:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | YOUR_SERVER_IP | Automatic |
| A Record | www | YOUR_SERVER_IP | Automatic |

Replace `YOUR_SERVER_IP` with your VPS IP address.

---

## Option 3: Netlify Deployment

### Step 1: Build Configuration

Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### Step 2: Deploy

```bash
# Build static site
npm run build

# Deploy to Netlify
cd dist
netlify deploy --prod --site=YOUR_SITE_ID
```

### Step 3: Custom Domain

1. In Netlify dashboard: **Site settings** → **Domain management**
2. Add custom domain: `metatheworld.online`
3. Configure Namecheap DNS as instructed

---

## Environment Variables

Create `.env.local` file for production:

```bash
# In /a0/usr/workdir/Meta_The_World/apps/web/.env.local

# Network
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_NETWORK=polygon

# Wallet Connect (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# API Endpoints
NEXT_PUBLIC_API_URL=https://api.metatheworld.online
NEXT_PUBLIC_SPATIAL_API_URL=https://spatial.metatheworld.online

# Contract Addresses (update after mainnet deployment)
NEXT_PUBLIC_LAND_REGISTRY=0x...
NEXT_PUBLIC_MTW_TOKEN=0x...
NEXT_PUBLIC_NFT_MARKETPLACE=0x...
NEXT_PUBLIC_PARTY_ROOM=0x...
NEXT_PUBLIC_AD_SPACE=0x...
NEXT_PUBLIC_PLATFORM_REVENUE=0x...

# Feature Flags
NEXT_PUBLIC_ENABLE_VIP_ROOMS=true
NEXT_PUBLIC_ENABLE_AD_SPACE=true
NEXT_PUBLIC_ENABLE_PARTY_ROOM=true
```

---

## Deployment Checklist

### Pre-deployment
- [ ] Update all contract addresses in `.env.local`
- [ ] Set `NODE_ENV=production`
- [ ] Configure Wallet Connect project ID
- [ ] Test build locally: `npm run build && npm start`
- [ ] Verify all pages load without errors

### Namecheap DNS Setup
- [ ] A record pointing to server/Vercel
- [ ] CNAME for www subdomain
- [ ] DNS propagation checked (can take 24-48 hours)

### Post-deployment
- [ ] HTTPS working (SSL certificate)
- [ ] All pages accessible
- [ ] Wallet connection working
- [ ] Live crypto prices loading
- [ ] Party room functional
- [ ] Mobile responsive check
- [ ] Performance audit (Lighthouse)

---

## Troubleshooting

### DNS Not Propagating
```bash# Check DNS propagation
dig metatheworld.online
nslookup metatheworld.online
```

Wait 24-48 hours for full propagation.

### SSL Certificate Issues
```bash# Renew certificate manually (custom server)
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### 502 Bad Gateway
```bash# Check if Next.js is running
pm2 status
pm2 logs meta-the-world

# Restart if needed
pm2 restart meta-the-world
```

### Wallet Connection Not Working
- Verify Wallet Connect project ID is set
- Check that domain is whitelisted in Wallet Connect dashboard
- Ensure HTTPS is enabled (required for wallet connections)

---

## Recommended: Vercel + Custom API Server

For production, recommended architecture:

```
metatheworld.online (Vercel)
├── Frontend (Next.js) - Serverless
├── Static assets - CDN
└── API Routes - Serverless Functions

api.metatheworld.online (Custom VPS)
├── Spatial Service (Node.js/PostGIS)
├── Bridge Service (Go/gRPC)
└── AI Agent Service
```

This gives you:
- Global CDN for fast static delivery
- Serverless frontend scaling
- Dedicated backend for database/API operations
- Cost efficiency

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Namecheap DNS Guide**: https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-do-i-set-up-host-records-for-a-domain/
- **Let's Encrypt**: https://letsencrypt.org/getting-started/
