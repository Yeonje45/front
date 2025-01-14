# 1. Node.js를 사용해 React 앱을 빌드
FROM node:18 AS builder

# 2. 앱 소스 코드를 컨테이너로 복사하고, 필요한 패키지들을 설치
WORKDIR /app
COPY package*.json ./
RUN npm install

# 3. React 앱을 빌드 ( nginx에서 사용할 수 있도록 )
COPY . .
RUN npm run build

# 4. Nginx를 사용해 빌드된 앱을 서비스하기 위한 이미지 생성
FROM nginx:1.23

# 5. React 앱의 빌드 파일을 Nginx의 기본 경로에 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 7. 새로고침 문제 해결을 위한 Nginx 설정 (기존 default.conf를 수정)
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# 8. 포트 80을 외부에 노출
EXPOSE 80

# 9. Nginx를 실행
CMD ["nginx", "-g", "daemon off;"]
