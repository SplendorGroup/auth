sudo cp localhost.crt /usr/local/share/ca-certificates/localhost.crt
sudo update-ca-certificates
sudo ls /etc/ssl/certs | grep localhost
