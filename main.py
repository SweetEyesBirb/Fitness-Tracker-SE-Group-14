import json
import sqlite3
import uuid

from flask import Flask, Response, jsonify, make_response, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
'''
# database example
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
# Replace "your_database_name" with your desired database name
db = SQLAlchemy(app)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    def __repr__(self):
        return '<User %r>' % self.name
db.create_all()
print("Table 'User' created successfully!")
'''

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Create a table for storing user registration data
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        userID INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )
''')

conn.commit()
conn.close()


@app.route('/')
def index():
  return render_template('index.html')


@app.route('/index')
def hub_urlfor():
  return render_template('index.html')


@app.route('/login')
def login_urlfor():
  return render_template('login.html')


@app.route('/profile-hub')
def profile_hub_urlfor():
  return render_template('profile-hub.html')


@app.route('/live-classes')
def live_classes_urlfor():
  return render_template('live-classes.html')


@app.route('/live-classes-data', methods=['GET'])
def get_live_classes():
  exercise_classes = read_json_file("data/live-classes-fake.json")

  names = [
      entry.get("name", "") for entry in exercise_classes.get("classes", [])
  ]
  images = [
      entry.get("image", "") for entry in exercise_classes.get("classes", [])
  ]

  return jsonify({"names": names, "images": images})


@app.route('/news')
def news_urlfor():
  return render_template('news.html')


@app.route('/achievements')
def achievements_urlfor():
  return render_template('achievements.html')


@app.route('/diary_and_tracker')
def diary_and_tracker_urlfor():
  return render_template('diary-tracker.html')


@app.route('/exercise')
def exercise_urlfor():
  return render_template('exercise-page.html')


@app.route('/dietary')
def dietary_urlfor():
  return render_template('dietary.html')


@app.route('/registration')
def registration():
  return render_template('registration.html')


@app.route('/registration', methods=['POST'])
def register():
  #registration_success = False

  if request.method == 'POST':
    name = request.form['name']
    surname = request.form['surname']
    email = request.form['email']
    password = request.form['password']

    # Insert the data into the SQLite database
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO users (
        name, surname, email, password) VALUES (?, ?, ?, ?)''',
        (name, surname, email, password))
    conn.commit()
    conn.close()

    #registration_success = True
    response_html = render_template('registration-confirmation.html',
                                    name=name,
                                    surname=surname,
                                    email=email)
    return Response(response_html, status=200, mimetype='text/html')
    '''return render_template('registration.html',
                               registration_success=registration_success, 
                               ser_name=request.form.get('name'),
                               user_surname=request.form.get('surname'),
                               user_email=request.form.get('email'))'''


@app.route('/registration-confirmation')
def registration_confirmation():
  return render_template('registration-confirmation.html')


# POSTS EXERCISE TRACKER DATA TO THE DB
@app.route('/submit_exercises_data', methods=['POST'])
def submit_exercise():
    data = request.json

    # Generate a unique ID for the new exercise entry
    data['id'] = str(uuid.uuid4())

    # Read existing data from the JSON file
    with open('data/tracked-exercises.json', 'r') as file:
        existing_data = json.load(file)

    # Append the new exercise data to the existing array
    existing_data.append(data)

    # Write the updated array back to the JSON file
    with open('data/tracked-exercises.json', 'w') as file:
        json.dump(existing_data, file)

    return jsonify({'message': 'Data submitted and stored successfully'})


# DELETE AN EXERCISE ENTRY FROM tracked-exercises.json VIA diary_and_tracker.html 
@app.route('/delete_exercise_entry/<string:entry_id>', methods=['DELETE'])
def delete_exercise_entry(entry_id):
  global exercise_data
  exercise_data = [entry for entry in exercise_data if 'id' in entry and entry['id'] 
                   != entry_id]
  with open('data/tracked-exercises.json', 'w') as file:
    json.dump(exercise_data, file)
    
  return jsonify({'message': 'Exercise entry deleted successfully'})



# GETS EXERCISE TRACKER DATA FROM THE DB
@app.route('/get_exercises_data', methods=['GET'])
def get_data():
    # Read data from the JSON file
    with open('data/tracked-exercises.json', 'r') as f:
        global exercise_data 
        exercise_data = json.load(f)
        return jsonify(exercise_data)


# POST DIARY ENTRIES TO THE DB
@app.route('/submit_diary_entries', methods=['POST'])
def submit_diary_entries():
    data = request.json

    # Generate a unique ID for the new diary entry
    data['id'] = str(uuid.uuid4())
  
      # Read existing data from the JSON file
    with open('data/diary-entries.json', 'r') as file:
        existing_data = json.load(file)
      # Append the new exercise data to the existing array
    existing_data.append(data)
  # Write the updated array back to the JSON file
    with open('data/diary-entries.json', 'w') as file:
        json.dump(existing_data, file)
      # Return a success message
    return jsonify({'message': 'Data submitted and stored successfully'})
  

# DELETE A DIARY ENTRY FROM diary-entries.json VIA diary_and_tracker.html
@app.route('/delete_diary_entry/<string:entry_id>', methods=['DELETE'])
def delete_diary_entry(entry_id):
  global diary_entries
  diary_entries = [entry for entry in diary_entries if 'id' in entry and entry['id']
                    != entry_id]
  with open('data/diary-entries.json', 'w') as file:
    json.dump(diary_entries, file)
  return jsonify({'message': 'Diary entry deleted successfully'})


# GET DIARY ENTRIES FROM THE DB
@app.route('/get_diary_entries', methods=['GET'])
def get_diary_entries():
  # Read data from the JSON file
  with open('data/diary-entries.json', 'r') as f:
    global diary_entries
    diary_entries = json.load(f)
    return jsonify(diary_entries)




# do not modify
app.run(host='0.0.0.0', port=81)
