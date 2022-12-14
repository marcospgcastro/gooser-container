// const { resolve } = require('path/win32');

// =============================================================================
exports.existPath = function  (savePath, targetSite) {
  const fileSyst = require('fs');                                               // Evoca biblioteca fs, responsável por verificar o "Path"
  const linkName = require('url');                                              // Biblioteca para manipulação de URL
  const { exit } = require('process');
  const lastName = require('path');
  const siteName = linkName.parse(targetSite, true).host;                       // Seleciona nome do Host por link fornecido
  const pathName = '/'+lastName.basename(targetSite,
                       lastName.extname(targetSite));
  
  if (!fileSyst.existsSync(savePath+siteName+pathName)) { 
    console.log(' Criando arvore de diretórios...')
    if (!fileSyst.existsSync(savePath)) {                                         // Verifica caminho de "imagem" de forma Síncrona                                       
        console.log(' Não foi localizado o caminho: '+savePath,
        ' verifique seu diretório de imagens!')
        console.error(' Erro: '+savePath+' não localizado | '+err)                                                     // Emissão de erro
        exit(1)
    }
    if (!fileSyst.existsSync(savePath+siteName)) {                                // Verifica caminho de "imagem" de forma Síncrona                                       
      fileSyst.mkdirSync(savePath+siteName, function(err){                        // Cria diretório em caso de ausência
          console.log(' Falha na criação de: '+savePath+siteName)
          console.error(' Erro: criação de /'+siteName+': '+err)                                                     // Emissão de erro
          exit(1)
       })
       console.log(' Criado: '+savePath+siteName)
    }
    if (!fileSyst.existsSync(savePath+siteName+pathName)) {                       // Verifica caminho de "imagem" de forma Síncrona                                       
      fileSyst.mkdirSync(savePath+siteName+pathName, function(err){               // Cria diretório em caso de ausência
          console.log(' Falha na criação de: '+savePath+siteName+pathName)
          console.error(' Erro: criação de /'+pathName+': '+err)                                                     // Emissão de erro
          exit(1)
      })
      console.log(' Criado: '+savePath+siteName+pathName);
    }
    console.log(' Ainda não há arquivos no diretório.')
    return false;
  } else {
    console.log(' Localizada arvore de diretórios: '+savePath+siteName+pathName)

    var cont = fileSyst.readdirSync(savePath+siteName+pathName, function(err){
        console.log(' Falha na leitura de: '+savePath+siteName+pathName)
        console.error(err)
        exit(1)                                                                 // Emissão de erro
    })

    if( cont.length == 0 ) {
      console.log(' Não foram encontrados arquivos no diretório.')
      return false;
    } else if(cont.length == 1){
      console.log(' Encontrado somente um arquivo no diretório.')
      return true;
    } else if(cont.length > 1){
      console.log(' Encontrados '+cont.length+' arquivos no diretório.')
      return true;
    }
  }
}

// =============================================================================
exports.onlineHost = function ( hostName ) { 
  const linkName = require('url');                                              // Biblioteca para manipulação de URL
  const linkTest = require('dns');  
  linkTest.lookup( linkName.parse( hostName, true ).host, (error) => {
    if(error && error.code === 'ENOTFOUND') {
       console.error( ' Alvo não localizado - Gooser finalizado!')
       throw error;
    }
  }) 
};
// =============================================================================
exports.printFile = async function ( pathSave, x, y, targetSite, logical ) { 

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))       // Condição para uso de Timer
  const puppeteer= require('puppeteer')                                         // Evoca biblioteca Puppeteer
  const editDate = require('node-datetime')                                     // Evoca biblioteca datetime  
  const linkName = require('url')                                               // Biblioteca para manipulação de URL
  const lastName = require('path')

  const browser = await puppeteer.launch({                                      // Função que simula abertura de navegador
    args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  });
  
  const webpage = await browser.newPage()                                       // Função que simula abertura de nova aba

  var formDate = editDate.create().format(' Y-m-d H:M:S')                       // Formatação de data
  var siteName = linkName.parse(targetSite, true).host                          // Seleciona nome do Host por link fornecido
  var pathName = '/'+lastName.basename(targetSite, lastName.extname(targetSite))
  var nameSave = 'uGetcha '+siteName+formDate+'.png'                            // Define nome do arquivo JPEG gerado
      pathSave = pathSave+siteName+pathName                                     // Atualiza o caminho do arquivo JPEG grado 

  try {
    await webpage.setViewport({width: x, height: y})                            // Dimensionamento de janela para print
    await webpage.goto(targetSite,{waitUntil: 'load',timeout: 0});              // Inserir escolha de link do alvo para print                                   
    await delay(5000)                                                           // Timer para carregamento do conteúdo - janelas de "popup"
    await webpage.screenshot({path: pathSave+'/'+nameSave, fullPage: logical})  // Inserir escolha de local para salvar os arquivos                                 
    await browser.close()                                                       // Encerra puppeteer
    return pathSave+'/'+nameSave;                                               // Retorno de função
  } catch (error) {                                                             // Emissão de erro
    console.log(' Falha ao obter imagem de '+siteName+' reportado em '
      +formDate+' | Saída do sistema: '+error)                                                          
  }  
};