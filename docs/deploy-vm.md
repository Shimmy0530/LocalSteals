# Deploy LocalSteals to Ubuntu VM

## Prerequisites
- Ubuntu/Debian VM with SSH access
- A domain name pointed to your VM's IP (A record in DNS)
- The VM's IP address

## Step 1: SSH into your VM

```bash
ssh your-user@your-vm-ip
```

## Step 2: Install Node.js 22+

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # should show v22+
```

## Step 3: Install build tools (needed for better-sqlite3)

```bash
sudo apt-get install -y build-essential python3
```

## Step 4: Clone the repo

```bash
cd ~
git clone https://github.com/Shimmy0530/LocalSteals.git
cd LocalSteals
```

## Step 5: Create .env.local on the VM

```bash
nano .env.local
```

Paste your full `.env.local` contents (from your local machine). Save with Ctrl+X, Y, Enter.

**Tip**: To copy from your Windows machine:
```bash
# On your Windows machine (Git Bash), run:
scp /c/Users/nicka/AndroidStudioProjects/ShopSmallSteals/.env.local your-user@your-vm-ip:~/LocalSteals/.env.local
```

## Step 6: Install dependencies and build

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
```

## Step 7: Test it works

```bash
npm start
```

Visit `http://your-vm-ip:3000` — you should see the app. Press Ctrl+C to stop.

## Step 8: Install PM2 (keeps the app running forever)

PM2 is a process manager — it keeps your app running even if you close SSH, and restarts it if it crashes.

```bash
sudo npm install -g pm2
pm2 start npm --name "localsteals" -- start
pm2 save
pm2 startup  # follow the printed command to enable auto-start on reboot
```

Useful PM2 commands:
```bash
pm2 status          # check if it's running
pm2 logs localsteals  # see live logs
pm2 restart localsteals  # restart after updates
pm2 stop localsteals     # stop the app
```

## Step 9: Set up Nginx (reverse proxy + SSL)

Nginx sits in front of your app and handles your domain name + HTTPS.

```bash
sudo apt-get install -y nginx
```

Create the site config:
```bash
sudo nano /etc/nginx/sites-available/localsteals
```

Paste this (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
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
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/localsteals /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # remove default site
sudo nginx -t  # test config
sudo systemctl restart nginx
```

## Step 10: Enable HTTPS with Let's Encrypt (free SSL)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Follow the prompts — it will auto-configure SSL. Certbot auto-renews.

## Step 11: Open firewall ports

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

## Done!

Visit `https://yourdomain.com` from anywhere — including your phone.

To add it to your phone's home screen:
1. Open the URL in Chrome/Safari
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. It will appear as an app with your logo!

---

## Updating the app

When you make changes locally:

```bash
# On your Windows machine
git add -A && git commit -m "update" && git push

# On your VM
cd ~/LocalSteals
git pull
npm install
npm run build
pm2 restart localsteals
```
