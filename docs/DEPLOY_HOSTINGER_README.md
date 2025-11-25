Hostinger deployment quick guide (for this repo)

Overview
- Build output directory: `dist/morpho-crm-web/browser`
- Upload target: `public_html` for domain root, or a subfolder for subdomain/path
- This guide assumes you'll upload the content of the `browser` folder to Hostinger

1) (Optional) Rebuild with correct base-href
- Root domain (https://example.com/):
  npx ng build --configuration production --source-map --output-path=dist/morpho-crm-web/browser --base-href "/"

- Subfolder (https://example.com/app/):
  npx ng build --configuration production --source-map --output-path=dist/morpho-crm-web/browser --base-href "/app/"

2) Create a zip of the build (Windows PowerShell)
- From repo root:
  Compress-Archive -Path .\dist\morpho-crm-web\browser\* -DestinationPath .\site.zip

3) Upload options
- File Manager (hPanel):
  - Log into Hostinger hPanel -> Files -> File Manager
  - Open `public_html` (or a subfolder)
  - Upload `site.zip` and use Extract to place files in the directory

- FTP (FileZilla) or SFTP:
  - Get FTP credentials from Hostinger hPanel -> FTP Accounts
  - Connect to host and upload all files inside `browser` to `public_html`

- SCP (SSH enabled):
  scp -r .\dist\morpho-crm-web\browser\* user@your_host_ip:/home/username/public_html/

4) `.htaccess`
- A recommended `.htaccess` is included at `dist/morpho-crm-web/browser/.htaccess` (handles SPA deep links and compression headers).
- If you upload via zip, ensure `.htaccess` is extracted to `public_html`.

5) SSL
- In hPanel -> SSL, enable Free SSL (Let's Encrypt) for your domain. After enabling, you can force HTTPS in `.htaccess` (already included but only effective after SSL is on).

6) Testing
- Visit the domain root.
- Test SPA deep routes (e.g., /opportunities/123) — must not 404.
- Test API calls from the app and confirm CORS & API base URL are correct in `src/environments/environment.production.ts`.

Troubleshooting
- 404 on deep link: verify `.htaccess` and that `index.html` is present.
- Wrong API: update `environment.production.ts` and rebuild with correct `apiUrl`.
- Large initial bundle: consider moving large vendor scripts (listed in `angular.json` -> scripts) to CDN or dynamically load them.
