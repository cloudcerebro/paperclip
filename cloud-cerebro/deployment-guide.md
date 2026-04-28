# Cloud Cerebro — Mac Mini Deployment Guide

Deploy Paperclip with the Cloud Cerebro company on a dedicated Mac Mini, exposed via Cloudflare Tunnel at `cloudcerebro.siva2k.com`.

## Prerequisites (already in place)

- Mac Mini with macOS
- Claude Code CLI installed and authenticated (subscription active)
- `cloudflared` installed and logged in (`cloudflared tunnel login` already done)
- DNS domain: `cloudcerebro.com` managed on Cloudflare

## Step 1: Install Node.js and pnpm

```sh
# Install Node.js 22 (if not already installed)
brew install node@22

# Install pnpm 9
npm install -g pnpm@9
```

Verify:
```sh
node --version    # expect: v22.x.x
pnpm --version    # expect: 9.x.x
```

If either command fails, check that brew's bin is in PATH:
```sh
export PATH="/opt/homebrew/bin:$PATH"
```

## Step 2: Clone the repo and build

```sh
cd ~
git clone https://github.com/cloudcerebro/paperclip.git
cd ~/paperclip
pnpm install
pnpm build
```

Expected: build completes with no errors. Warnings about plugin-sdk bins are safe to ignore.

## Step 3: Generate auth secret and set runtime env

Generate the auth secret and set the runtime env vars before configuring Paperclip:

```sh
GENERATED_SECRET=$(openssl rand -base64 32)
{
  echo "export BETTER_AUTH_SECRET=\"${GENERATED_SECRET}\""
  echo 'export PAPERCLIP_SECRETS_STRICT_MODE=true'
  echo 'export PAPERCLIP_BIND=loopback'
  echo 'export PAPERCLIP_API_URL=https://cloudcerebro.siva2k.com'
} >> ~/.zshrc
source ~/.zshrc
```

`PAPERCLIP_BIND=loopback` keeps the server reachable only on localhost — Cloudflare Tunnel runs on the same Mac, so this is sufficient and avoids exposing port 3100 on your LAN. `PAPERCLIP_API_URL` tells the server its public-facing URL so auth callbacks and invite emails use the tunnel domain instead of `localhost:3100`.

Verify:
```sh
echo $BETTER_AUTH_SECRET    # should print a 44-char base64 string
echo $PAPERCLIP_BIND        # loopback
echo $PAPERCLIP_API_URL     # https://cloudcerebro.siva2k.com
```

## Step 4: Configure Paperclip in authenticated mode

Use the `configure` command with explicit flags to avoid interactive prompts:

```sh
cd ~/paperclip

# Initialize Paperclip data directory
pnpm paperclipai onboard --mode authenticated --exposure public --url https://cloudcerebro.siva2k.com --yes
```

If the `--mode` flags are not supported by the current version, use the configure command instead:

```sh
pnpm paperclipai configure --section server
```

And select: `authenticated` → `public` → `https://cloudcerebro.siva2k.com`

Alternatively, write the config directly:

```sh
mkdir -p ~/.paperclip/instances/default
cat > ~/.paperclip/instances/default/config.json << 'CONFIGEOF'
{
  "server": {
    "deploymentMode": "authenticated",
    "exposure": "public",
    "port": 3100
  },
  "auth": {
    "baseUrlMode": "explicit",
    "publicBaseUrl": "https://cloudcerebro.siva2k.com",
    "disableSignUp": false
  }
}
CONFIGEOF
```

Note: if a config.json already exists, merge these fields rather than overwriting.

Run doctor to validate:
```sh
pnpm paperclipai doctor --repair
```

## Step 5: Start server and import Cloud Cerebro

```sh
cd ~/paperclip

# Start the server in background, wait for it to be ready
pnpm dev:once &
SERVER_PID=$!

# Poll until healthy (up to 60 seconds)
for i in $(seq 1 30); do
  if curl -sf http://localhost:3100/api/health > /dev/null 2>&1; then
    echo "Server is ready"
    break
  fi
  sleep 2
done

# Verify health
curl -s http://localhost:3100/api/health

# Import the company
pnpm paperclipai company import ./cloud-cerebro --yes

# Stop the temporary server
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
```

Expected output should show: 6 agents created, 1 project created.

## Step 6: Set up Cloudflare Tunnel

**IMPORTANT**: If `cloudflared tunnel login` has not been done yet, the user must do this manually — it opens a browser for Cloudflare authentication. Claude Code cannot complete this step.

```sh
# Create the tunnel (capture the tunnel ID)
TUNNEL_OUTPUT=$(cloudflared tunnel create paperclip 2>&1)
TUNNEL_ID=$(echo "$TUNNEL_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
echo "Tunnel ID: $TUNNEL_ID"

# If tunnel already exists, get its ID instead:
# TUNNEL_ID=$(cloudflared tunnel list | grep paperclip | awk '{print $1}')

# Route DNS
cloudflared tunnel route dns paperclip cloudcerebro.siva2k.com
```

Create the tunnel config:

```sh
WHOAMI=$(whoami)
cat > ~/.cloudflared/config.yml << TUNNELEOF
tunnel: ${TUNNEL_ID}
credentials-file: /Users/${WHOAMI}/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: cloudcerebro.siva2k.com
    service: http://localhost:3100
  - service: http_status:404
TUNNELEOF
```

Verify the config:
```sh
cat ~/.cloudflared/config.yml
cloudflared tunnel info paperclip
```

## Step 7: Install pm2 and start services

```sh
npm install -g pm2

cd ~/paperclip

# Start Paperclip
pm2 start "pnpm dev:once" --name paperclip --cwd ~/paperclip

# Wait for Paperclip to be ready
sleep 20
curl -s http://localhost:3100/api/health

# Start Cloudflare Tunnel
pm2 start "cloudflared tunnel run paperclip" --name cloudflare-tunnel

# Save process list
pm2 save
```

Set up auto-start on reboot:
```sh
pm2 startup
```

This prints a command starting with `sudo env PATH=...`. The user must copy-paste and run that command manually (it requires sudo). Claude Code should print the command and instruct the user to run it.

After running the sudo command:
```sh
pm2 save
```

Verify both processes are running:
```sh
pm2 list
```

Expected: both `paperclip` (online) and `cloudflare-tunnel` (online).

## Step 8: Verify deployment

```sh
# Check local server
curl -s http://localhost:3100/api/health

# Check tunnel (may take 30-60 seconds for DNS to propagate)
curl -sf https://cloudcerebro.siva2k.com/api/health
```

Both should return `{"status":"ok",...}`.

If the external URL fails, wait a minute for DNS propagation and try again:
```sh
dig cloudcerebro.siva2k.com    # should show CNAME to cfargotunnel.com
```

## Steps Requiring Human Action (cannot be automated)

The following steps must be done by a human in a web browser:

### Claim board ownership

1. Open `https://cloudcerebro.siva2k.com` in your browser
2. Sign up with your email and password
3. Find the board claim URL in the server logs:
   ```sh
   pm2 logs paperclip --lines 200 | grep "board-claim"
   ```
4. Open that URL in your browser while logged in — this promotes you to board admin

### Add second board member

1. Second person opens `https://cloudcerebro.siva2k.com`
2. Signs up with their email and password
3. Board admin grants them access from the dashboard settings

### Configure agent heartbeats

From `https://cloudcerebro.siva2k.com/CLO/dashboard`:

1. Go to **Agents** → click each agent → **Configuration**
2. Set heartbeat schedules:
   - CEO: every 8 hours
   - CTO: every 8 hours
   - Head of Research: every 8 hours
   - YouTube Parser: disabled (on-demand only)
   - Head of Engineering: every 8 hours
   - Head of Marketing: every 12 hours

### Verify agent connectivity

1. Go to any agent in the dashboard
2. Click **Run Test** to verify Claude Code CLI responds
3. If it fails, check Claude Code auth on the Mac Mini:
   ```sh
   claude --version
   ```

## Updating

```sh
cd ~/paperclip

# Pull latest from fork
git pull origin master

# Optionally pull upstream updates
git pull https://github.com/paperclipai/paperclip.git master --rebase

# Rebuild and restart
pnpm install
pnpm build
pm2 restart paperclip
```

## Backup

Paperclip auto-backs up every 60 minutes to:
```
~/.paperclip/instances/default/data/backups/
```

Manual backup:
```sh
cd ~/paperclip && pnpm paperclipai db:backup
```

Configure backup settings:
```sh
pnpm paperclipai configure --section database
```

## Troubleshooting

**Server won't start:**
```sh
pm2 logs paperclip --lines 50
pnpm paperclipai doctor --repair
```

**Tunnel not connecting:**
```sh
pm2 logs cloudflare-tunnel --lines 50
cloudflared tunnel info paperclip
```

**Agent runs failing:**
```sh
# Check Claude Code is working
claude --version

# Check agent runs in dashboard: Agents → [agent] → Runs
```

**Database reset (destroys all data):**
```sh
pm2 stop paperclip
rm -rf ~/.paperclip/instances/default/db
pm2 start paperclip
sleep 20
pnpm paperclipai company import ./cloud-cerebro --yes
```

**External URL not resolving:**
```sh
dig cloudcerebro.siva2k.com
pm2 list    # both processes should be "online"
```

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` set to a strong random value (verify with `echo $BETTER_AUTH_SECRET`)
- [ ] `PAPERCLIP_SECRETS_STRICT_MODE=true` (verify with `echo $PAPERCLIP_SECRETS_STRICT_MODE`)
- [ ] `PAPERCLIP_BIND=loopback` (server only reachable via localhost; tunnel handles ingress)
- [ ] Board ownership claimed by admin user
- [ ] `authDisableSignUp` considered after board members are registered (prevents random signups)
- [ ] Consider enabling Cloudflare Access for extra zero-trust auth layer
- [ ] Backups verified: `ls ~/.paperclip/instances/default/data/backups/`
- [ ] Master key backed up off the Mini: `~/.paperclip/instances/default/secrets/master.key` (without it, encrypted secrets cannot be recovered after disaster)
