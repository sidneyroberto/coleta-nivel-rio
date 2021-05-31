# coleta-nivel-rio

Script para a coleta de dados de telemetria dos rios brasileiros. Os dados são capturados da [API](http://telemetriaws1.ana.gov.br/ServiceANA.asmx) de telemetria da Agência Nacional das Águas (ANA).

Para executar o script, primeiramente instale o [Node.js](https://nodejs.org/en/) em seu computador. Após, execute o comando abaixo para instalar as dependências do projeto:

#### `npm i`

Para executar o script, execute o comando abaixo:

#### `npm start codigo=CODIGO_ESTACAO inicio=DATA_INICIAL fim=DATA_FINAL`

Onde **CODIGO_ESTACAO** é o código da estação de telemetria, **DATA_INICIAL** é a data de início da leitura e **DATA_FINAL** é a data final da leitura. As datas devem estar no padrão **dd/mm/aaaa**.

Ao término da execução do script, serão gerados dois arquivos (JSON e CSV) na pasta raíz do projeto com os dados coletados.

Exemplos de códigos de estações do estado de Mato Grosso do Sul:

#### `Aquidauana(Rio Aquidauana): 66945000`
#### `Distrito de Palmeiras (Rio Aquidauana): 66941000`
#### `Coxim (Rio Taquari): 66870000`
#### `Ladário (Rio Paraguai): 66825000`
#### `Bonito (Rio Miranda): 66900000`
#### `Bataguassu (Rio Pardo): 63970000`

  
Para consultar códigos de estações, acesse o [mapa de estações da ANA](http://www.snirh.gov.br/hidrotelemetria/Mapa.aspx).