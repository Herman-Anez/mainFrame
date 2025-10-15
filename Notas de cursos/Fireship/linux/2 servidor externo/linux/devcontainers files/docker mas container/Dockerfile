FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Instalar SSH server
RUN apt-get update && \
    apt-get install -y openssh-server && \
    mkdir /var/run/sshd

# Configurar SSH
RUN echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config && \
    echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

# Crear usuario personalizado
RUN useradd -m -s /bin/bash kriv && \
    echo 'kriv:123' | chpasswd && \
    usermod -aG sudo kriv

    
EXPOSE 22

CMD bash -c "service ssh start && tail -f /dev/null"

