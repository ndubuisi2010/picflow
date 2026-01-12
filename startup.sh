#!/bin/bash

echo "Starting Laravel..."

cd /home/site/wwwroot

php artisan config:clear
php artisan cache:clear
php artisan view:clear

php -S 0.0.0.0:8080 -t public public/index.php