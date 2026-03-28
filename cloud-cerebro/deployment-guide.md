# Cloud Cerebro — Mac Mini Deployment Guide

Deploy Paperclip with the Cloud Cerebro company on a dedicated Mac Mini, exposed via Cloudflare Tunnel at `paperclip.cloudcerebro.com`.

## Prerequisites (already in place)

- Mac Mini with macOS
- Claude Code CLI installed and authenticated (subscription active)
- `cloudflared` installed
- DNS domain: `cloudcerebro.com` on Cloudflare

## Step 1: Install Node.js and pnpm

```sh
# Install Node.js 20+ (if not already installed)
brew install node@22

# Install pnpm
npm install -g pnpm@9
```

Verify:
```sh
node --version    # should be >= 20
pnpm --version    # should be >= 9
```

## Step 2: Clone the repo and build

```sh
cd ~
git clone https://github.com/cloudcerebro/paperclip.git
cd paperclip
pnpm install
pnpm build
```

## Step 3: Configure Paperclip in authenticated mode

```sh
pnpm paperclipai onboard
```

When prompted:
1. **Deployment mode**: choose `authenticated`
2. **Exposure**: choose `public`
3. **Public URL**: enter `https://paperclip.cloudcerebro.com`

This writes your config to `~/.paperclip/instances/default/config.json`.

## Step 4: Set secrets

Create a `.env` file or export these before starting the server:

```sh
# Generate a strong random secret (run once, save the output)
openssl rand -base64 32

# Set it
export BETTER_AUTH_SECRET="<paste-your-generated-secret>"
export PAPERCLIP_SECRETS_STRICT_MODE=true
```

For persistence, add these to `~/.zshrc` or `~/.zprofile`:

```sh
echo 'export BETTER_AUTH_SECRET="<your-secret>"' >> ~/.zshrc
echo 'export PAPERCLIP_SECRETS_STRICT_MODE=true' >> ~/.zshrc
```

## Step 5: Import Cloud Cerebro company

Start the server temporarily to import:

```sh
pnpm dev:once &
sleep 20

# Verify server is running
curl -s http://localhost:3100/api/health

# Import the company
pnpm paperclipai company import ./cloud-cerebro --yes

# Stop the temporary server
kill %1
```

## Step 6: Set up Cloudflare Tunnel

```sh
# Login to Cloudflare (if not already)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create paperclip

# Route DNS — points paperclip.cloudcerebro.com to this tunnel
cloudflared tunnel route dns paperclip paperclip.cloudcerebro.com
```

Create the tunnel config file at `~/.cloudflared/config.yml`:

```yaml
tunnel: <tunnel-id-from-create-step>
credentials-file: /Users/<username>/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: paperclip.cloudcerebro.com
    service: http://localhost:3100
  - service: http_status:404
```

Replace `<tunnel-id>` with the ID output from `cloudflared tunnel create`.

Test the tunnel:

```sh
# Start Paperclip
pnpm dev:once &
sleep 20

# Start tunnel
cloudflared tunnel run paperclip

# Visit https://paperclip.cloudcerebro.com in your browser
```

## Step 7: Keep Paperclip running with pm2

```sh
# Install pm2
npm install -g pm2

# Start Paperclip
cd ~/paperclip
pm2 start "pnpm dev:once" --name paperclip --cwd ~/paperclip

# Start Cloudflare Tunnel
pm2 start "cloudflared tunnel run paperclip" --name cloudflare-tunnel

# Auto-start on reboot
pm2 startup
# Follow the command it prints (copy-paste and run it)

# Save current process list
pm2 save
```

Useful pm2 commands:

```sh
pm2 list              # see running processes
pm2 logs paperclip    # view Paperclip logs
pm2 logs cloudflare-tunnel  # view tunnel logs
pm2 restart paperclip # restart after updates
pm2 stop paperclip    # stop the server
```

## Step 8: Claim board ownership

1. Open `https://paperclip.cloudcerebro.com` in your browser
2. Sign up with your email and password
3. Check the Paperclip server logs for the one-time board claim URL:
   ```sh
   pm2 logs paperclip | grep "board-claim"
   ```
4. Open the claim URL while logged in — this promotes you to board admin

## Step 9: Add second board member

1. Second person opens `https://paperclip.cloudcerebro.com`
2. Signs up with their email and password
3. You (as admin) grant them board access from the dashboard settings

## Step 10: Configure agent heartbeats

From the dashboard at `https://paperclip.cloudcerebro.com/CLO/dashboard`:

1. Go to **Agents** → click each agent → **Configuration**
2. Set heartbeat schedules:
   - CEO: every 8 hours
   - CTO: every 8 hours
   - Head of Research: every 8 hours
   - YouTube Parser: disabled (on-demand only)
   - Head of Engineering: every 8 hours
   - Head of Marketing: every 12 hours

## Step 11: Verify Claude Code connectivity

Each agent uses `claude_local` adapter which runs Claude Code CLI. Verify it works:

1. Go to any agent in the dashboard
2. Click **Run Test** to verify the CLI responds
3. If it fails, ensure Claude Code is authenticated on the Mac Mini:
   ```sh
   claude --version
   ```

## Updating

To pull latest changes and redeploy:

```sh
cd ~/paperclip

# Pull from your fork
git pull origin master

# Pull upstream updates
git pull https://github.com/paperclipai/paperclip.git master --rebase

# Rebuild and restart
pnpm install
pnpm build
pm2 restart paperclip
```

## Backup

Paperclip auto-backs up the database every 60 minutes to:
```
~/.paperclip/instances/default/data/backups/
```

Manual backup:
```sh
cd ~/paperclip
pnpm paperclipai db:backup
```

Configure backup settings:
```sh
pnpm paperclipai configure --section database
```

## Troubleshooting

**Server won't start:**
```sh
pm2 logs paperclip --lines 50   # check logs
pnpm paperclipai doctor          # run diagnostics
```

**Tunnel not connecting:**
```sh
pm2 logs cloudflare-tunnel --lines 50
cloudflared tunnel info paperclip
```

**Agent runs failing:**
- Check agent runs in the dashboard under **Agents → [agent] → Runs**
- Verify Claude Code auth: `claude --version` on the Mac Mini
- Check if the subscription is active

**Database reset (nuclear option):**
```sh
pm2 stop paperclip
rm -rf ~/.paperclip/instances/default/db
pm2 start paperclip
# Re-import the company:
pnpm paperclipai company import ./cloud-cerebro --yes
```

**Can't access from browser:**
- Verify tunnel is running: `pm2 list`
- Check DNS: `dig paperclip.cloudcerebro.com`
- Verify Cloudflare dashboard shows the tunnel as healthy

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` set to a strong random value (not the default)
- [ ] `PAPERCLIP_SECRETS_STRICT_MODE=true`
- [ ] Board ownership claimed by you
- [ ] Second board member added (not just anyone who signs up)
- [ ] Consider enabling Cloudflare Access for extra zero-trust layer
- [ ] Regular backups verified (check `~/.paperclip/instances/default/data/backups/`)
