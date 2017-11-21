//Doco: https://transparency.entsoe.eu/load-domain/r2/totalLoadR2/show geeft de actuele load per kwartier.
// er is een api: https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html
//           api token: <deleted>
//

function myFunction() {
  // example use
  getMillData();
}

function SAVE_DATA() {
  Logger.log('function: SAVE_DATA');
 var millData=parseInt(getMillData());
    Logger.log('millData :' + millData); 
 var loadData=parseInt(getLoadData());
 var landMillData=parseInt(getLandMillData());
 var percOfLoad = millData / loadData * 100;
 var loadPerc = parseInt(percOfLoad * 10)/10;
 var landNut = parseInt (landMillData * 0.14 * 1000 / 0.4 *10) /10;
 var landNutMax = parseInt (3290 * 0.14 * 1000 / 0.4 *10) /10;
  
  Logger.log('landnut :' + landNut); 
    Logger.log('landnutMax :' + landNutMax); 
  
  CurrentDate = new Date();
  var now = parseInt(Utilities.formatDate(CurrentDate, "GMT+0100", "HH")) ;
  Logger.log('now:' + now);
  if (now >9 && now <22) {
    var treintag = '#';
    if (landNut <= 500000) {
      var tag = '#';
    } else {
      var tag = '';
    }    
  } else {
    var treintag = '';
    var tag = '';
  }
  
  //nog even checken of het numeriek is! anders hashtag weghalen
  
  
  
    Logger.log('tag :' + tag); 
    Logger.log('treintag :' + treintag); 
  
    var subject = tag + 'windmillcalc';
 
 // 
 //huishoudens tweet maken mailen. IFTTT pakt hem dan verder op op basis van de hashtag
 //
  try {
    MailApp.sendEmail('xxx@gmail.com',
                   subject,
                   'Op dit moment leveren alle #windmolens op land samen stroom voor ' +landNut+ ' huishoudens in plaats van 2,4 Miljoen. (http://bit.ly/2njAj0s) ');
  }  catch (err) {
      // handle the error here

    
    }
    try {
    MailApp.sendEmail('xxx@gmail.com',
                   'uitleg Molentjes',
                      'Landelijke vraag is '+ loadData + ' MW. Windmolens op land leveren '+ landMillData + ' MW. Totaal molens '+ millData + ' MW.' +
                     ' 14% van het strooomverbruik komt van huishoudens die gemiddeld 3500 KWh in 8760 uur verbruiken, maakt ' + landNut + ' huishoudens');
      
    //  Bijvoorbeeld gisteravond om 2200 was de landelijke vraag 16525 MW, en de landmolens in NL leverden op dat moment 43 MW (Totaal molens 169 MW).
//14% van het strooomverbruik komt van huishoudens (maar wanneer idd?) en reken ik 3500 KWh terug (via 8760 uur) naar gemiddeld 400W per huishouden continue dan werden er dus 15050 huishoudens bediend. 

  }  catch (err) {
      // handle the error here

    
    }
  


  //
//treintjestweet maken en mailen. IFTTT pakt hem dan verder op op basis van de hashtag
//
  
  //even rekenen:
  // 1% van beschikbare landwindvermogen is voor treinen dus
  //var landwindvermogenvoortreinen = (0.01 * landMillData);
  //
  // 1% van energieverbruik NL is voor treinen
  var windvermogenvoortreinen = (0.01 * millData);
  //
  //
  var verbruik1trein = 1000;
  var treinenmogelijk;
  //treinenmogelijk = landwindvermogenvoortreinen / verbruik1trein;
  treinenmogelijk = windvermogenvoortreinen / verbruik1trein;
  var treinenperuur = 1200000 / 365 /18; //Totaalreizen / dagen in een jaar / treinuren in een dag
  var treinenuitval = treinenperuur - treinenmogelijk;
  treinenuitvalint = parseInt(treinenuitval + 0.5);
  Logger.log('windvermogenvoortreinen ' + windvermogenvoortreinen);
  Logger.log('treinenperuur ' + treinenperuur);
  Logger.log('treinenmogelijk ' + treinenmogelijk);
  Logger.log('treinenuitval ' + treinenuitval);
  Logger.log('treinenuitvalint ' + treinenuitvalint);
             
  if (treinenmogelijk < 1) {
    twittermsg = 'Op dit moment leveren Nederlandse #windmolens te weinig stroom om ook maar een enkele #NS trein te laten rijden. http://bit.ly/2jCGNCl';
  } else {
    //uitval
    //twittermsg = 'Op dit moment zouden ' + treinenuitvalint + ' treinen uitvallen als de #NS treinen zouden rijden op die #windmolens. http://bit.ly/2jCGNCl';
    twittermsg = 'Op dit moment zouden ' + treinenuitvalint + ' treinen uitvallen als de #NS treinen zouden rijden op stroom van Nederlandse #windmolens.';
  }
    try {
    MailApp.sendEmail('xxx@gmail.com',
                   treintag + 'treintjes',
                   twittermsg);
  }  catch (err) {
      // handle the error here

    
    }
  
  

}

function nu() {
  
   CurrentDate = new Date();
  var now = parseInt(Utilities.formatDate(CurrentDate, "GMT+0100", "HH")) ;
  Logger.log('now:' + now);
  if (now >10 && now <22) {
    Logger.log('overdag');
    return true;
  } else {
   Logger.log('\'snachts');;
    return false;
  }
  
}

function getMillData() {
  Logger.log('function: getMillData');
    var url = "http://www.windstats.nl/";
//  "images/turbine.png"); $("#infobox").hide(); redrawChart(
//    , "4234", "Nederland");
    var fromText = '"images/turbine.png"); $("#infobox").hide(); redrawChart(';
    var toText = ', "4243", "Nederland")';
    var fromText = '$("#offsi").attr("src", "images/turbine.png"); $("#infobox").hide(); redrawChart(';
    var toText = ', "4234", "Nederland")';
      
    try {
    var content = UrlFetchApp.fetch(url).getContentText();
    } catch (error) {
  throw new Error( "windstats error." );
    }
      
    var scraped = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
    Logger.log('scraped: ' + scraped);
    return scraped;
}

function getLandMillData() {
  Logger.log('function: getLandMillData');
    var url = "http://www.windstats.nl/";
    var fromText = '"Offshore"); $("#infol3").html("';
    var toText = 'MWh"); $("#maxon").html("Max. 957MW");';
    try {
    var content = UrlFetchApp.fetch(url).getContentText();
    } catch (error) {
  throw new Error( "windstats error." );
    }   
      var scraped = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
  Logger.log('scraped: ' + scraped);
    return scraped;
}

function getLoadData() {
  Logger.log('function getLoadlData');
  // begin en eindtijd yyyymmddhhmm  en dan afronden op kwartieren
  //periodStart=201701231030&periodEnd=201701231045
  CurrentDate = new Date();
  var startDate = Utilities.formatDate(CurrentDate, "GMT-0100", "yyyyMMddHH") + '00' ; //2 uurtjes geleden
  var endDate = Utilities.formatDate(CurrentDate, "GMT-0100", "yyyyMMddHH") + '15' ;
  
  Logger.log('startDate: ' + startDate);
  Logger.log('endDate: ' + endDate);
  
  //strip it
    //var url = 'https://transparency.entsoe.eu/api?securityToken=409a6b5a-d819-44d7-9763-f6947010c8d5&documentType=A65&processType=A16&outBiddingZone_Domain=10YNL----------L&periodStart=201701231030&periodEnd=201701231045';
    var url = 'https://transparency.entsoe.eu/api?securityToken=409a6b5a-d819-44d7-9763-f6947010c8d5&documentType=A65&processType=A16&outBiddingZone_Domain=10YNL----------L&periodStart=' + startDate + '&periodEnd=' + endDate;

  
    Logger.log(url);
    var fromText = '<quantity>';
    var toText = '</quantity>';
    try {
    var content = UrlFetchApp.fetch(url).getContentText();
           } catch (error) {
           Logger.log('content error catch: ' + content);
             throw new Error( "Error fetching entso-e." );
           }
    var scraped = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
    Logger.log('scraped'+ scraped);
      return scraped;
}

function getLoadData1() {
  
  //Waarom werkt het niet met XMLService? google script namespace heeft afwijking
  
  //vorige kwartier:
  //https://transparency.entsoe.eu/api?securityToken=409a6b5a-d819-44d7-9763-f6947010c8d5&documentType=A65&processType=A16&outBiddingZone_Domain=10YNL----------L&periodStart=201701231030&periodEnd=201701231045
  
  var url = 'https://transparency.entsoe.eu/api?securityToken=409a6b5a-d819-44d7-9763-f6947010c8d5&documentType=A65&processType=A16&outBiddingZone_Domain=10YNL----------L&periodStart=201701231030&periodEnd=201701231045';
           //https://transparency.entsoe.eu/api?securityToken=409a6b5a-d819-44d7-9763-f6947010c8d5&documentType=A65&processType=A16&outBiddingZone_Domain=10YNL----------L&periodStart=201703101200&periodEnd=201703101215'
  var entsoeXml = UrlFetchApp.fetch(url);//.getContentText();
  var document = XmlService.parse(entsoeXml);
  var root = document.getRootElement();

  Logger.log(root);
   
  var mwActual = root.getChild('TimeSeries').getChild('Period').getChild('Point').getChild('quantity').getText();
  
    Logger.log(mwActual);
    return mwActual;
}



