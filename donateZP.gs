function myFunction() {
  //https://www.doneeractie.nl/boetes-betalen-voor-blokkade-snelweg-anti-pieten/-4928
  
  var opgehaald=laatsteStandDonaties();
  Logger.log('OPGEHAALD:'+ opgehaald);
  
  var nog=dagenTeGaan();
  Logger.log('NOG:'+ nog);
  
  //Mailen. IFTTT pakt hem uit gmail op om naar buffer te schrijven om te tweeten.  
   var body = 'Er is al '+ opgehaald + ' euro gedoneerd voor de #kozp anti-#zwartepiet blokkade op weg naar #dokkum. Met '+ nog + '. https://buff.ly/2j9ajkU';
   var subject = '#A7donaties';
       try {
    MailApp.sendEmail('xxx@gmail.com',
                   subject,
                   body);
  }  catch (err) {
           Logger.log('mail error catch: ' + subject);
             throw new Error( "Error sending mail." );
    }
}
  
function laatsteStandDonaties() {
  //library key: M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV
  var url = 'https://www.doneeractie.nl/boetes-betalen-voor-blokkade-snelweg-anti-pieten/-4928'  
  Logger.log('URL:'+url);
     var fromText = '&euro;';
    var toText = '</span>';
    try {
    var content = UrlFetchApp.fetch(url).getContentText();
           } catch (error) {
           Logger.log('content error catch: ' + content);
             throw new Error( "Error fetching donaties." );
           }
    var scraped = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
  Logger.log('SCRAPED:'+ scraped);
    return scraped.trim();
}

function dagenTeGaan() {
  //library key: M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV
  var url = 'https://www.doneeractie.nl/boetes-betalen-voor-blokkade-snelweg-anti-pieten/-4928'  
  Logger.log('URL:'+url);
     var fromText = '<div class="detail-2">';
    var toText = '</div>';
    try {
    var content = UrlFetchApp.fetch(url).getContentText();
           } catch (error) {
           Logger.log('content error catch: ' + content);
             throw new Error( "Error fetching donaties." );
           }
    var scraped = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
  Logger.log('SCRAPED:'+ scraped);
    return scraped.trim();
}
