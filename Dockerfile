FROM ubuntu:20.04

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install vim git curl wget systemctl zsh gpg -y
ENV DEBIAN_FRONTEND noninteractive
RUN apt install mysql-server -y
ENV DEBIAN_FRONTEND text
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
SHELL ["usr/bin/bash", "--login", "-i", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN source /root/.bashrc && nvm install 16.13.2
SHELL ["/bin/bash", "-c"]
EXPOSE 8071 3306 5173
RUN usermod -d /var/lib/mysql/ mysql
# RUN systemctl enable mysql