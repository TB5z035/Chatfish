# First stage, build the frontend
FROM node:12.18.3

RUN npm config set registry https://registry.npm.taobao.org

ENV FRONTEND=/opt/frontend

WORKDIR $FRONTEND

COPY frontend/package.json $FRONTEND
COPY frontend/package-lock.json $FRONTEND
RUN npm install

COPY frontend/ $FRONTEND
RUN npm run build

ENV BACKEND=/opt/backend

WORKDIR $BACKEND

COPY websocket_server/package.json $BACKEND
COPY websocket_server/package-lock.json $BACKEND
RUN npm install

# Second Stage, build the backend

FROM nikolaik/python-nodejs:latest

ENV HOME=/opt/app

WORKDIR $HOME

COPY requirements.txt $HOME

RUN npm config set registry https://registry.npm.taobao.org &&\
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

COPY . $HOME

# Copy frontend from the first stage
COPY --from=0 /opt/frontend/build frontend/build

# Copy backend node_modules directory from the first stage
COPY --from=0 /opt/backend/node_modules websocket_server/node_modules

ENV EXPOSE_PORT 80
EXPOSE 80

ENV PYTHONUNBUFFERED=true
CMD ["/bin/sh", "config/run.sh"]
