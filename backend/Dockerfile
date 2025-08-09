FROM php:8.2-apache

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql zip bcmath mbstring xml

# 2. Enable Apache mod_rewrite
RUN a2enmod rewrite

# 3. Install Composer properly (multi-stage)
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# 4. Set working directory
WORKDIR /var/www

# 5. Copy only composer files first (for caching)
COPY composer.json composer.lock ./

# 6. Install dependencies (including fruitcake/php-cors)
RUN composer install --no-interaction --no-scripts --no-autoloader

# 7. Copy the rest of the application
COPY . .

# 8. Use custom Apache config
COPY apache/laravel.conf /etc/apache2/sites-available/000-default.conf

# 9. Final optimizations
RUN composer dump-autoload --optimize && \
    chown -R www-data:www-data /var/www && \
    chmod -R 775 storage bootstrap/cache

EXPOSE 80
CMD ["apache2-foreground"]
