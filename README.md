# RecipeApi

## Instruções para configuração:

#### No arquivo config.json escolher o endereço (HOST) e a porta (PORT) desejados.
#### Atenção: E for rodar com docker é necessário utilizar a mesma porta no arquivo config.json e no Dockerfile em EXPOSE.

#### Clonar a pasta no local desejado

## Instruções com Docker:

docker build -t deliverymuchapi/docker .

docker run -p 3000:3000 -d deliverymuchapi/docker

## Instruções sem Docker:

npm start

## Testando:
#### Utilizar a collection disponível em .\doc\ para testar o endpoint com Insomnia. Caso seja alterado o endereço de localhost para outro endereço é necessário alterar os endereços na collection.
