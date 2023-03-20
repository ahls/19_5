from boggle import Boggle
from flask import Flask, request, render_template, redirect, session
app = Flask(__name__)
app.config['SECRET_KEY'] = '1'

boggle_game = Boggle()


@app.route('/')
def homeDef():
    boggle = Boggle()
    session['board'] =  boggle.make_board()
    print(session['board'])
    return render_template('app.html')

@app.route('/checkWord')
def checkWord():
    if(session.get('board') == None):
        session['board']=boggle_game.make_board()
    response = boggle_game.check_valid_word(session['board'],request.args['word'])
    return {'result':response}
    
@app.route('/postScore', methods=['POST'])
def recordScore():
    prevBest = session.get('score',0)
    recievedScore = request.json.get('score',0)
    bestScore = prevBest if prevBest>recievedScore else recievedScore
    session['numPlay'] = session.get('numPlay',0) + 1 
    session['score'] = bestScore
    print(bestScore)
    return {"highScore":bestScore}