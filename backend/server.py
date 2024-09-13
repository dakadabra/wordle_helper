# Filename - server.py

# Import flask and datetime module for showing date and time
import re
from flask import Flask
import datetime
import requests

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)


# Route for seeing a data
@app.route('/data')
def get_time():

	# Returning an api for showing in reactjs
	return {
		'Name':"David", 
		"Age":"24",
		"Date":x, 
		"programming":"python"
		}

	
# Route for getting wordle word
@app.route('/word')
def get_word():

    """Copied from https://gist.github.com/iancward/afe148f28c5767d5ced7a275c12816a3"""
    # get list of five-letter words from meaningpedia.com
    # found it linked from Wikipedia:
    # https://en.wikipedia.org/wiki/Lists_of_English_words#External_links
    meaningpedia_resp = requests.get("https://meaningpedia.com/5-letter-words?show=all")
    # get list of words by grabbing regex captures of response
    # there's probably a far better way to do this by actually parsing the HTML
    # response, but I don't know how to do that, and this gets the job done
    print(meaningpedia_resp)
    # compile regex
    pattern = re.compile(r'<span itemprop="name">(\w+)</span>')
    # find all matches
    word_list = pattern.findall(meaningpedia_resp.text)
	# Returning an api for showing in reactjs
    return meaningpedia_resp

	

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# # Running app
# if __name__ == '__main__':
# 	app.run(debug=True)
