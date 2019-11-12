from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
	print(request.form)
	return "hello"
	# print(request.form)
	# return "hello"

if __name__ == '__main__':
    app.run(host = '10.130.40.107', port = 5001)
