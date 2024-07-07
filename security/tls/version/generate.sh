#!/bin/bash

# Definir nomes de arquivos
SERVER_KEY_FILE="localhost.key"
SERVER_CSR_FILE="localhost.csr"
SERVER_CERT_FILE="localhost.crt"
CONFIG_FILE="localhost.cnf"

# E-mail para incluir no certificado
EMAIL="contact@gfrancodev.com"

# Criar arquivo de configuração do certificado
cat > $CONFIG_FILE <<EOL
[req]
default_bits       = 4096
default_keyfile    = $SERVER_KEY_FILE
distinguished_name = req_distinguished_name
req_extensions     = req_ext
x509_extensions    = v3_ca
prompt             = no

[req_distinguished_name]
C            = BR
ST           = Bahia
L            = Lauro de Freitas
O            = GFRANCODEV
OU           = TI
CN           = localhost
emailAddress = $EMAIL

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names

[alt_names]
DNS.1   = localhost
EOL

# Gerar chave privada do servidor
openssl genpkey -algorithm RSA -out $SERVER_KEY_FILE -pkeyopt rsa_keygen_bits:4096

# Gerar CSR (Certificate Signing Request) do servidor
openssl req -new -key $SERVER_KEY_FILE -out $SERVER_CSR_FILE -config $CONFIG_FILE

# Gerar certificado autoassinado do servidor
openssl x509 -req -in $SERVER_CSR_FILE -signkey $SERVER_KEY_FILE -out $SERVER_CERT_FILE -days 365 -extfile $CONFIG_FILE -extensions req_ext

echo "Certificados e chaves gerados:"
echo "Chave privada do servidor: $SERVER_KEY_FILE"
echo "CSR do servidor: $SERVER_CSR_FILE"
echo "Certificado do servidor: $SERVER_CERT_FILE"
