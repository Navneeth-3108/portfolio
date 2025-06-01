from flask import Flask, render_template, request
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient("mongodb+srv://navneeth:navneethdb@cluster.gfcovbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster")

db = client["Portfolio"]
collection = db["Contact_Form"]

# Route to show the form
@app.route('/')
def show_form():
    return render_template('index.html')

# Route to handle form submission
@app.route('/submit', methods=['POST'])
def handle_form():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    # Insert the form data into MongoDB
    collection.insert_one({
        'name': name,
        'email': email,
        'message': message
    })

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
