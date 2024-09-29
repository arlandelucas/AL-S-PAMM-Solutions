from flask import Flask, render_template
import requests

app = Flask(__name__)

# Credenciais do Myfxbook
myfxbook_email = 'arlandelucas72@gmail.com'
myfxbook_password = 'Ddtank8493@'

# Função para autenticar no Myfxbook
def autenticar_myfxbook(email, senha):
    url = f'https://www.myfxbook.com/api/login.json?email={email}&password={senha}'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['session']
    else:
        print("Erro ao autenticar.")
        return None

# Função para obter dados da conta
def obter_informacoes_conta(session):
    url = f'https://www.myfxbook.com/api/get-my-accounts.json?session={session}'
    response = requests.get(url)
    return response.json()

@app.route('/')
def index():
    # Autenticar e buscar os dados da conta
    session_id = autenticar_myfxbook(myfxbook_email, myfxbook_password)
    if session_id:
        dados_conta = obter_informacoes_conta(session_id)
        return render_template('index.html', contas=dados_conta['accounts'])
    else:
        return "Erro ao autenticar no Myfxbook", 500

if __name__ == '__main__':
    app.run(debug=True)