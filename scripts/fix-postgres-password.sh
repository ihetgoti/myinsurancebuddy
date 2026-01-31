#!/bin/bash
# Fix PostgreSQL password - Run on VPS

echo "Checking PostgreSQL status..."

# Check if PostgreSQL is running
if systemctl is-active --quiet postgresql; then
    echo "✓ PostgreSQL is running"
else
    echo "Starting PostgreSQL..."
    systemctl start postgresql
fi

# Check existing users
echo ""
echo "Existing database users:"
sudo -u postgres psql -c "\du" | grep -E "(mibuser|postgres)"

# Check if mibuser exists
USER_EXISTS=$(sudo -u postgres psql -t -c "SELECT 1 FROM pg_roles WHERE rolname='mibuser'" | xargs)

if [ "$USER_EXISTS" = "1" ]; then
    echo ""
    echo "User 'mibuser' exists. Resetting password to 'mibpass2024'..."
    sudo -u postgres psql -c "ALTER USER mibuser WITH PASSWORD 'mibpass2024';"
    echo "✓ Password reset to: mibpass2024"
else
    echo ""
    echo "Creating user 'mibuser' with password 'mibpass2024'..."
    sudo -u postgres psql -c "CREATE USER mibuser WITH PASSWORD 'mibpass2024';"
    sudo -u postgres psql -c "ALTER USER mibuser WITH SUPERUSER;"
    echo "✓ User created with password: mibpass2024"
fi

# Check database
DB_EXISTS=$(sudo -u postgres psql -t -c "SELECT 1 FROM pg_database WHERE datname='myinsurancebuddy'" | xargs)

if [ "$DB_EXISTS" != "1" ]; then
    echo ""
    echo "Creating database 'myinsurancebuddy'..."
    sudo -u postgres psql -c "CREATE DATABASE myinsurancebuddy OWNER mibuser;"
    echo "✓ Database created"
else
    echo ""
    echo "Database 'myinsurancebuddy' exists. Setting owner..."
    sudo -u postgres psql -c "ALTER DATABASE myinsurancebuddy OWNER TO mibuser;"
    echo "✓ Owner updated"
fi

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE myinsurancebuddy TO mibuser;"

echo ""
echo "========================================"
echo "✅ PostgreSQL Setup Complete!"
echo "========================================"
echo ""
echo "Username: mibuser"
echo "Password: mibpass2024"
echo "Database: myinsurancebuddy"
echo ""
echo "Connection string:"
echo "postgresql://mibuser:mibpass2024@localhost:5432/myinsurancebuddy?schema=public"
