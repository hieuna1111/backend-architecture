## install in actions-runner default folder of action github
bash: sudo apt-get install -y nginx

## setup reverse proxy nginx
bash: cd /etc/nginx/sites-available
bash: sudo nano default
# copy proxy to default file
location /api {
  rewrite ^\/api\/(.*)$ /api/$1 break;
  proxy_pass http://localhost:3055; // change port
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
bash: sudo systemctl restart nginx