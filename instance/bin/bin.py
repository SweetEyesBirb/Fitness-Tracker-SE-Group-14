# binned python functions
''' 
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
        ''' '''INSERT INTO users (
        name, surname, email, password) VALUES (?, ?, ?, ?)''',
'''      (name, surname, email, password))
    conn.commit()
    conn.close()

    #registration_success = True
    response_html = render_template('registration-confirmation.html',
                                    name=name,
                                    surname=surname,
                                    email=email)
    return Response(response_html, status=200, mimetype='text/html')
    ''' '''return render_template('registration.html',
                               registration_success=registration_success, 
                               ser_name=request.form.get('name'),
                               user_surname=request.form.get('surname'),
                               user_email=request.form.get('email'))'''


'''@app.route('/')
def index():
  return render_template('index.html')
'''

'''
def read_json_file(file_path):
  with open(file_path, 'r') as file:
    data = json.load(file)
  return data
'''