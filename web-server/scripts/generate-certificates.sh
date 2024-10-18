CERT_DIR="./certs"
CERT_KEY="$CERT_DIR/server.key"
CERT_CRT="$CERT_DIR/server.cert"

mkdir -p $CERT_DIR

# Generate the certificates if they don't exist
if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CRT" ]; then
  echo "Generating self-signed certificates..."
  openssl req -x509 -newkey rsa:4096 -nodes -keyout "$CERT_KEY" -out "$CERT_CRT" -days 365 -subj "/CN=localhost"
else
  echo "Certificates already exist."
fi
