#!/bin/bash

# Set variables for the key file and passphrase
KEY_FILE="jwt"
PASSPHRASE='passpharse'

# Generate the RSA key with the specified passphrase
ssh-keygen -t rsa -b 4096 -f $KEY_FILE -N "$PASSPHRASE"

echo "RSA 4096-bit key generated and saved to $KEY_FILE"

# Display the paths to the generated keys
echo "Private key: $KEY_FILE"
echo "Public key: $KEY_FILE.pub"

# Display the contents of the public key
echo "Public key content:"
cat "$KEY_FILE.pub"