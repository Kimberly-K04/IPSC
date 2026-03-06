# IPSC

## Setup

```bash
cd <your-repo>
pnpm install --prefix client
pyhton -m venv .venv
source ./venv/bin/activate
pip install -r requirements.txt
```

- No need to run ```flask db init``` already done for you

### Enviroment Variables

- Create a .env with the following

```env
FLASK_APP=server.app
FLASK_RUN_PORT=5020
FLASK_DEBUG=True
FLASK_SQLALCHEMY_DATABASE_URI=sqlite:///app.db #for development
```
