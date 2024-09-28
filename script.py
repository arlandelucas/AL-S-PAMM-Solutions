import requests
import json

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

# Função para gerar arquivo JSON com dados da conta
def gerar_json(dados_conta):
    with open('dados_conta.json', 'w') as file:
        json.dump(dados_conta, file)
    print("Arquivo JSON gerado com sucesso!")

# Fluxo principal
session_id = autenticar_myfxbook(myfxbook_email, myfxbook_password)
if session_id:
    dados_conta = obter_informacoes_conta(session_id)
    gerar_json(dados_conta)
else:
    print("Erro ao autenticar no Myfxbook.")