FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql zip bcmath mbstring xml

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working dir
WORKDIR /var/www

# Copy Laravel app
COPY . .

# Use custom Apache config
COPY apache/laravel.conf /etc/apache2/sites-available/000-default.conf

# Permissions
RUN chown -R www-data:www-data /var/www && \
    chmod -R 775 storage bootstrap/cache

# Composer install
RUN curl -sS https://getcomposer.org/installer | php && \
    php composer.phar install --no-interaction --prefer-dist --optimize-autoloader

EXPOSE 80
CMD ["apache2-foreground"]

