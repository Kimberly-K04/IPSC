web: PORT=4000 npm run dev --prefix client
api: gunicorn -b 127.0.0.1:5020 'server.app:create_app()'