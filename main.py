import json
import sqlite3
import uuid

from flask import Flask, Response, jsonify, make_response, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


def read_json_file(file_path):
  with open(file_path, 'r') as file:
    data = json.load(file)
  return data


@app.route('/')
def index():
  return render_template('index.html')


@app.route('/index')
def hub_urlfor():
  return render_template('index.html')


@app.route('/settings')
def settings_urlfor():
  return render_template('settings.html')


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
  """
  The function `get_live_classes` retrieves data from a JSON file and
  returns a JSON response containing the names, images, and codes of exercise classes.
  :return: a JSON response containing three lists: "names", "images",
  and "codes". These lists contain the corresponding values extracted
  from the "classes" entries in the "live-classes-fake.json" file.
  """
  # Read the JSON file
  exercise_classes = read_json_file("data/live-classes-fake.json")
  # Extract the names, images, and codes from the "classes" entries
  names = [
      entry.get("name", "") for entry in exercise_classes.get("classes", [])
  ]
  images = [
      entry.get("image", "") for entry in exercise_classes.get("classes", [])
  ]
  codes = [
      entry.get("code", "") for entry in exercise_classes.get("classes", [])
  ]

  return jsonify({"names": names, "images": images, "codes": codes})



@app.route('/live-classes/live-class/<unique_id>')
def live_class_urlfor(unique_id):
  return render_template('live-class.html', unique_id=unique_id)


@app.route('/live-classes/live-class-data/<unique_id>')
def live_class_data(unique_id):
  """
  The `live_class_data` function retrieves data for a specific live class
  based on a unique ID and returns it as a JSON response.

  :param unique_id: The `unique_id` parameter is a placeholder for a unique
  identifier of a live class. It is used to retrieve the data of a
  specific live class from a JSON file
  :return: If the selected class is found in the classes_data, the code, name,
  and image of the class are returned as a JSON response.
  If the selected class is not found, a JSON response with an error
  message "Class not found" and a status code of 404 is returned.
  """
  
  classes_data = read_json_file("data/live-classes-fake.json")

  selected_class = next((entry for entry in classes_data.get("classes", [])
                         if entry.get("code") == unique_id), None)

  if selected_class:
    return jsonify({
        "code": selected_class.get("code", ""),
        "name": selected_class.get("name", ""),
        "image": selected_class.get("image", ""),
    })
  else:
    return jsonify({"error": "Class not found"}), 404


@app.route('/live-classes/live-class-chat')
def live_class_chat():
  """
  The function `live_class_chat` returns the contents of a JSON file called
  "live-class-chat.json" as a JSON response.
  :return: a JSON response containing the "chat" data from the
  "live-class-chat.json" file.
  """
  
  class_chat = read_json_file("data/live-class-chat.json")
  return jsonify({"chat": class_chat})

  

@app.route('/live-classes/add-chat-entry', methods=['POST'])
def add_chat_entry():
  """
    The `add_chat_entry` function receives a POST request with a new chat entry,
    appends it to the existing chat data, and saves the updated chat data
    to a JSON file.
    :return: a JSON response. If a new chat entry is successfully added, it returns
    a JSON object with the keys "status" and "chat". The "status" key has
    the value "success" and the "chat" key has the updated chat data.
    If the new chat entry is invalid, it returns a JSON object with the keys
    "status" and "message" with the corresponding error messages.
    """
  
  # Get the new chat entry from the request data
  try:
    data = request.get_json()
    new_chat_entry = data.get('chatEntry')
  
    if new_chat_entry:
      chat_data = read_json_file("data/live-class-chat.json")

      chat_data.append(new_chat_entry)

      with open("data/live-class-chat.json", 'w') as file:
        json.dump(chat_data, file, indent=4)

      return jsonify({"status": "success", "chat": chat_data})
    else:
      return jsonify({"status": "error", "message": "Invalid chat entry"}), 400
  except Exception as e:
    return jsonify({"status": "error", "message": str(e)}), 500


    
@app.route('/news')
def news_urlfor():
  return render_template('news.html')


@app.route('/news-data', methods=['GET'])
def get_news():
  """
  The function `get_news()` retrieves a list of news headlines from a JSON
  file and returns them as a JSON response.
  :return: a JSON response containing a list of news headlines.
  """
  
  news_headlines = read_json_file("data/news-fake-headlines.json")
  headlines = news_headlines.get("headlines", [])
  return jsonify({"headlines": headlines})


@app.route('/achievements')
def achievements_urlfor():
  return render_template('achievements.html')


@app.route('/diary_and_tracker')
def diary_and_tracker_urlfor():
  """
  This function is a Flask route that
  renders a template called 'diary-tracker.html' when the 
  /diary_and_tracker' URL is accessed.
  :return: the rendered template 'diary-tracker.html'.
  """
  return render_template('diary-tracker.html')


@app.route('/exercise')
def exercise_urlfor():
  return render_template('exercise-page.html')


@app.route('/exercise-data', methods=['GET'])
def get_exercise_data():
  """
  The `get_exercise_data` function retrieves exercise data from a JSON
  file and returns it as a JSON response.
  :return: a JSON object that contains the following keys: "codes", "names",
  "images", "intensities", "durations", "descriptions", and "categories".
  The values associated with these keys are lists of data extracted from a JSON file.
  """
  
  exercise_data = read_json_file("data/fake-exercises.json")

  codes = [
      entry.get("code", "") for entry in exercise_data.get("exerciseData", [])
  ]
  names = [
      entry.get("name", "") for entry in exercise_data.get("exerciseData", [])
  ]
  images = [
      entry.get("image", "")
      for entry in exercise_data.get("exerciseData", [])
  ]
  intensities = [
      entry.get("intensity", "")
      for entry in exercise_data.get("exerciseData", [])
  ]
  durations = [
      entry.get("duration", 0)
      for entry in exercise_data.get("exerciseData", [])
  ]
  descriptions = [
      entry.get("description", "")
      for entry in exercise_data.get("exerciseData", [])
  ]
  categories = [
      entry.get("exercise", "")
      for entry in exercise_data.get("exerciseData", [])
  ]

  return jsonify({
      "codes": codes,
      "names": names,
      "images": images,
      "intensities": intensities,
      "durations": durations,
      "descriptions": descriptions,
      "categories": categories
  })



@app.route('/exercise/exercise-specific/<unique_id>')
def exercise_specific_urlfor(unique_id):
  return render_template('exercise-specific.html', unique_id=unique_id)


@app.route('/exercise/exercise-specific-data/<unique_id>')
def exercise_specific_data(unique_id):
  """
  This function retrieves exercise-specific data based on a unique ID from a JSON
  file and returns it as a JSON response.

  :param unique_id: The `unique_id` parameter is a placeholder for a unique
  identifier that is used to retrieve specific exercise data.
  It is expected to be a string value that corresponds to the code of
  the exercise in the `fake-exercises.json` file
  :return: a JSON response. If the selected exercise is found in the exercise data,
  it returns a JSON object containing the code, name, image, intensity,
  duration, description, and exercise of the selected exercise.
  If the exercise is not found, it returns a JSON object with an error message and
  a status code of 404.
  """
  
  exercise_data = read_json_file("data/fake-exercises.json")

  selected_exercise = next((entry
                            for entry in exercise_data.get("exerciseData", [])
                            if entry.get("code") == unique_id), None)

  if selected_exercise:
    return jsonify({
        "code": selected_exercise.get("code", ""),
        "name": selected_exercise.get("name", ""),
        "image": selected_exercise.get("image", ""),
        "intensity": selected_exercise.get("intensity", ""),
        "duration": selected_exercise.get("duration", 0),
        "description": selected_exercise.get("description", ""),
        "exercise": selected_exercise.get("exercise", "")
    })
  else:
    return jsonify({"error": "Exercise not found"}), 404

  

@app.route('/dietary')
def dietary_urlfor():
  return render_template('dietary.html')


@app.route('/registration')
def registration():
  return render_template('registration.html')


@app.route('/registration-confirmation')
def registration_confirmation():
  return render_template('registration-confirmation.html')


# POSTS EXERCISE TRACKER DATA TO THE DB
@app.route('/submit_exercises_data', methods=['POST'])
def submit_exercise():
  """
  This function receives exercise data, generates a unique ID for the entry,
  reads existing data from a JSON file, appends the new exercise data
  to the array, and writes the updated array back to the JSON file.
  :return: a JSON response with a message indicating that the data
  has been submitted and stored successfully.
  """

  data = request.json

  # Generates a unique ID for the new exercise entry
  data['id'] = str(uuid.uuid4())

  # Reads data from the JSON file
  with open('data/tracked-exercises.json', 'r') as file:
    existing_data = json.load(file)

  # Appends the new exercise data to the JSON array
  existing_data.append(data)

  # Writes the updated array back to the JSON file
  with open('data/tracked-exercises.json', 'w') as file:
    json.dump(existing_data, file)

  return jsonify({'message': 'Data submitted and stored successfully'})


# DELETE AN EXERCISE ENTRY FROM tracked-exercises.json VIA diary_and_tracker.html
@app.route('/delete_exercise_entry/<string:entry_id>', methods=['DELETE'])
def delete_exercise_entry(entry_id):
  """
  The function deletes an exercise entry from the 'tracked-exercises.json'
  file based on the provided entry_id and returns
  a JSON response indicating the success of the deletion.

  :param entry_id: The entry_id parameter is the unique identifier
  of the exercise entry that you want
  to delete from the tracked-exercises.json file
  :return: a JSON response with a message indicating that 
  the exercise entry has been deleted successfully.
  """

  global exercise_data
  exercise_data = [
      entry for entry in exercise_data
      if 'id' in entry and entry['id'] != entry_id
  ]
  with open('data/tracked-exercises.json', 'w') as file:
    json.dump(exercise_data, file)

  return jsonify({'message': 'Exercise entry deleted successfully'})


# GETS EXERCISE TRACKER DATA FROM THE DB
@app.route('/get_exercises_data', methods=['GET'])
def get_data():
  """
  This function retrieves exercise tracker data from a JSON file and
  returns it as a JSON response.
  :return: the exercise_data variable as a JSON response.
  """

  with open('data/tracked-exercises.json', 'r') as f:
    global exercise_data
    exercise_data = json.load(f)
    return jsonify(exercise_data)


# POST DIARY ENTRIES TO THE DB
@app.route('/submit_diary_entries', methods=['POST'])
def submit_diary_entries():
  """
  The function `submit_diary_entries` receives a POST request with JSON data,
  appends the data to an existing JSON file, and returns a success message.
  :return: a JSON response with a message indicating that the data has been
  submitted and stored successfully.
  """

  data = request.json

  data['id'] = str(uuid.uuid4())

  with open('data/diary-entries.json', 'r') as file:
    existing_data = json.load(file)

  existing_data.append(data)

  with open('data/diary-entries.json', 'w') as file:
    json.dump(existing_data, file)

  return jsonify({'message': 'Data submitted and stored successfully'})


# DELETE A DIARY ENTRY FROM diary-entries.json VIA diary_and_tracker.html
@app.route('/delete_diary_entry/<string:entry_id>', methods=['DELETE'])
def delete_diary_entry(entry_id):
  """
  The function deletes a diary entry with a specific ID from a list
  of diary entries and updates the JSON file containing the entries.

  :param entry_id: The `entry_id` parameter is a string that
  represents the unique identifier of the diary entry that needs to be deleted
  :return: a JSON response with a message indicating that the diary
  entry was deleted successfully.
  """

  global diary_entries
  diary_entries = [
      entry for entry in diary_entries
      if 'id' in entry and entry['id'] != entry_id
  ]
  with open('data/diary-entries.json', 'w') as file:
    json.dump(diary_entries, file)
  return jsonify({'message': 'Diary entry deleted successfully'})


# GET DIARY ENTRIES FROM THE DB
@app.route('/get_diary_entries', methods=['GET'])
def get_diary_entries():
  """
  The function `get_diary_entries` reads a JSON file containing
  diary entries and returns them as a
  JSON response.
  :return: the contents of the 'diary-entries.json' file as a JSON object.
  """

  with open('data/diary-entries.json', 'r') as f:
    global diary_entries
    diary_entries = json.load(f)
    return jsonify(diary_entries)


# do not modify
app.run(host='0.0.0.0', port=81)
