/**
 * Dependências externas necessárias para a execução do script
 */
const axios = require('axios').default
const {
    parseStringPromise
} = require('xml2js')
const {
    find
} = require('xml2js-xpath')
const {
    writeFileSync
} = require('fs')

const {
    URL_API
} = require('./config')

/**
 * Valida o formato das datas de início e fim
 * do período de leitura. 
 * @param {string} data Data no formato dd/mm/yyyy
 * @returns *true* caso a data seja válida e *false* caso contrário.
 */
const dataEhValida = data => /^\d{2}\/\d{2}\/\d{4}$/.test(data)

/**
 * Realiza a coleta dos dados de telemetria de uma 
 * determinada estação de leitura de dados fluviométricos.
 * @param {string} codigo Código da estação
 * @param {string} inicio Data de início da leitura
 * @param {string} fim Data de fim da leitura
 * @returns Array com os dados lidos
 */
const coletarDados = async (codigo, inicio, fim) => {
    let leituras = []

    const url =
        URL_API
        .replace('CODIGO', codigo)
        .replace('INICIO', inicio)
        .replace('FIM', fim)

    console.log(url)

    const resposta = await axios.get(url)
    const valorJson = await parseStringPromise(resposta.data)
    const resultados = find(valorJson, '//DadosHidrometereologicos')
    if (resultados) {
        leituras = resultados.map(resultado => {
            const dataHora = resultado.DataHora[0].trim()
            const nivel = resultado.Nivel[0]
            const vazao = resultado.Vazao[0]
            const chuva = resultado.Chuva[0]

            return {
                dataHora,
                nivel,
                vazao,
                chuva
            }
        })

        respostaJson = JSON.stringify(leituras)

    } else {
        console.log('Nenhum resultado retornado')
    }

    return leituras
}

const gerarArquivos = leituras => {
    const leiturasJSON = JSON.stringify(leituras)
    writeFileSync('resposta.json', leiturasJSON)

    let linhasCSV = 'DATA/HORA,NÍVEL,VAZÃO,CHUVA\n'
    leituras.forEach(leitura => {
        const linha = `${leitura.dataHora},${leitura.nivel},${leitura.vazao},${leitura.chuva}`
        linhasCSV += linha + '\n'
    })
    writeFileSync('resposta.csv', linhasCSV)
}

/**
 * Função principal que inicia o processo de coleta
 * realizando a validação simples dos parâmetros de entrada
 */
const iniciarColeta = async () => {
    const args = process.argv.slice(2)
    let parametrosIncorretos = false
    if (args.length >= 3) {
        let codigo = '',
            inicio = '',
            fim = ''
        args.forEach(arg => {
            const aux = arg.split('=')
            const valor = aux && aux.length > 0 ? aux[1] : ''

            if (arg.startsWith('codigo')) {
                codigo = valor
            } else if (arg.startsWith('inicio')) {
                inicio = valor
            } else if (arg.startsWith('fim')) {
                fim = valor
            }
        })

        if (codigo.length > 0 && dataEhValida(inicio) > 0 && dataEhValida(fim)) {
            const leituras = await coletarDados(codigo, inicio, fim)
            gerarArquivos(leituras)
            console.log('Arquivos gerados')
        } else {
            parametrosIncorretos = true
        }
    } else {
        parametrosIncorretos = true
    }

    if (parametrosIncorretos) {
        console.log('Parâmetros incorretos')
        console.log('Uso:')
        console.log('npm start codigo=CODIGO_ESTACAO inicio=DATA_INICIAL fim=DATA_FINAL')
        console.log('Datas no padrão dd/mm/aaaa')
    }
}

// Inicia o processo
iniciarColeta()