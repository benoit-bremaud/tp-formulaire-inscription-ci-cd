import os

import mysql.connector
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS ouvert : le navigateur pourra appeler l'API depuis n'importe quelle origine.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    """Ouvre une connexion MySQL depuis les variables d'environnement.

    On se connecte a chaque requete (et non au demarrage du module) : ainsi,
    au moment de l'appel, la base est prete. Cela evite la course au demarrage
    decrite au slide 13 ; on la traitera proprement avec un healthcheck plus
    loin dans le cours.
    """
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=3306,
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
    )


@app.get("/users")
async def get_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateur")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"utilisateurs": records}
