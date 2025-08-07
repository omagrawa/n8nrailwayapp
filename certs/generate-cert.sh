#!/bin/bash

CERT_FILE="localhost.pem"
KEY_FILE="localhost-key.pem"
SUBJECT="/C=IN/ST=State/L=City/O=DevOrg/OU=Dev/CN=localhost"

# Generate private key
openssl genrsa -out "$KEY_FILE" 2048

# Generate self-signed certificate
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 -subj "$SUBJECT"

echo "✔ Certificate and key created:"
echo " - $CERT_FILE"
echo " - $KEY_FILE"
