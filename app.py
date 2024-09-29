from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# Credenciais Myfxbook
MYFXBOOK_EMAIL = 'arlandelucas72@gmail.com'
MYFXBOOK_PASSWORD = 'Ddtank8493@'

# Função para autenticar no Myfxbook
def autenticar_myfxbook():
    url = f'https://www.myfxbook.com/api/login.json?email={MYFXBOOK_EMAIL}&password={MYFXBOOK_PASSWORD}'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('session')
    else:
        return None

# Função para obter dados da conta
@app.route('/api/conta', methods=['GET'])
def obter_informacoes_conta():
    session = autenticar_myfxbook()
    if not session:
        return jsonify({'error': 'Erro ao autenticar no Myfxbook'}), 400

    url = f'https://www.myfxbook.com/api/get-my-accounts.json?session={session}'
    response = requests.get(url)
    return jsonify(response.json())

# Função para obter dados diários da conta
@app.route('/api/conta/<int:account_id>/dados-diarios', methods=['GET'])
def obter_dados_diarios(account_id):
    session = autenticar_myfxbook()
    if not session:
        return jsonify({'error': 'Erro ao autenticar no Myfxbook'}), 400

    url = f'https://www.myfxbook.com/api/get-data-daily.json?session={session}&id={account_id}'
    response = requests.get(url)
    return jsonify(response.json())

# Executa o servidor Flask
if __name__ == '__main__':
    app.run(debug=True)