import json

from flask import Flask, jsonify, make_response, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# database example
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database_name.db'
# Replace "your_database_name" with your desired database name
db = SQLAlchemy(app)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    def __repr__(self):
        return '<User %r>' % self.username
      

@app.route('/')
def index():
    return render_template('index.html')


app.run(host='0.0.0.0', port=81)



''' When I mentioned that Replit does not provide external databases, I mean that Replit itself does not offer hosting or management of databases like PostgreSQL, MySQL, MongoDB, etc. These databases are typically hosted on separate servers, either locally or on cloud platforms like AWS, Azure, or Google Cloud.

However, within the Replit environment, you can still develop and test your Flask application using databases like SQLite. SQLite is a self-contained, serverless, file-based database engine that allows you to store and manipulate data without the need for a separate database server.

Using SQLite with Flask in Replit is an excellent option for local development and testing because it does not require any external database connections or configurations. You can define and interact with your SQLite database directly within your Flask application code.

With SQLite, you can create tables, define models, perform database operations (such as inserts, updates, and selects), and test your application's functionality that interacts with the database.

Please note that when you deploy your Flask application to a production environment, if you need to use an external database like PostgreSQL, MySQL, MongoDB, or others, you will have to set up a separate database server and update your Flask application configuration accordingly. Replit does not provide the infrastructure or services for hosting these databases, so you will need to use an external hosting provider or service for that purpose. '''