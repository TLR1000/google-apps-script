//Dit script draait elke 30 min.
//
//Checkt voor relevante email en extract daaruit een twitter message 
//Stuurt mail met twitter message naar xxx@gmail.com
//IFTTT pakt het vervolgens op en plaatst het als tweet in buffer
//Buffer tweet het met het twitter account

/*
Zie voor fleet documentatie:
https://docs.google.com/spreadsheets/d/1s0mrpmhwVQmJhldCQlgzWHLUn78wnGq-KdVcYaWo4h8/edit?usp=sharing

Aantallen migranten
http://data2.unhcr.org/en/situations/mediterranean

*/

function processMarineTrafficMail(){
    
  var label = GmailApp.getUserLabelByName("MarineTraffic");  
  if(label == null){
    //Er zijn geen mails met dit label
    
  }
  else{
    var threads = label.getThreads();  

    for (var i = 0; i < threads.length; i++) {  
      
      var message = threads[i].getMessages()[0];
      var from = message.getFrom();
      var subject = message.getSubject();
      var msgcontent = message.getRawContent()
      Logger.log (subject);
      
      var beweging = "";
      var tweetmsgbegin = '#mensensmokkel: NGO Smokkelschip';
      var commapos = subject.indexOf(',');
      var shipsnamestart = subject.indexOf(':')+2;
      var portnamestart = subject.lastIndexOf('Port')+5;   // De : gaat niet goed bij departures.
      var endsubjectstr = subject.length;
      var continueprocessing = false;
          
      //nu er iets mee doen
      //maar alleen als het aankomst of vertrek is (beweging).
      //voorbeeld: Arrival: SEA-WATCH TANGO, Port: VALLETTA      
      //voorbeeld: Departure: SEA-WATCH TANGO, Port: VALLETTA
  
      if (subject) {
        if (subject.indexOf('Arrival') > -1) {
          beweging = "aangekomen in";
          continueprocessing = true;
        }
      }
         
      if (subject) {
        if (subject.indexOf('Departure') > -1) {
          beweging = "vertrokken uit";
          continueprocessing = true;
        }
      }
        
      if (continueprocessing){
        
        //namen uit het subject vissen
        var shipsname = subject.substring(shipsnamestart, commapos).toProperCase();
        var portname = subject.substring(portnamestart, endsubjectstr).trim().toProperCase(); //trim omdat er nog een space blijft hangen voor de naam ivm. zoeken op Port ipv ;


        //uitzonderingen
        //
        
        if (shipsname == "C Star") { 
          tweetmsgbegin = "SAR missie van #defendeurope:  ";
        }        
        if (portname == "Malta Anch") { 
          beweging = "voor anker ";
          portname = "op de reede van Malta";
        }
        if (portname == "Trapani Anch") { 
          beweging = "voor anker ";
          portname = "op de reede van Trapani";
        }
        if (portname == "Lampedusa Anch") { 
          beweging = "voor anker ";
          portname = "op de reede van Lampedusa";
        }
        Logger.log(beweging);
        Logger.log(portname);
        


        
        //marinetraffic.com Link eruit peuteren
        //voorbeeld link van "Position and track. (Datum en tijd ook uit de mail overnemen!)
        //http://www.marinetraffic.com/en/ais/home/oldshipid:5014988/oldmmsi:211773720/zoom:10/olddate:2017-07-02 09:07
        //oldshipid en olddate zijn uniek. 
        //Logger.log (msgcontent);   
        var oldshipPos = msgcontent.indexOf('oldshipid');
        var olddatePos = msgcontent.indexOf('olddate');   
        var linktext = msgcontent.substring(oldshipPos - 41,olddatePos + 24);
        linklength = linktext.length;
        var tijdtext = linktext.substring((linklength -5),linklength);
        linktext = linktext.substring(0,linktext.length - 6).concat("%20").concat(tijdtext);
        //Logger.log ('linktext = '+ linktext);
     
        //url shorten
        var url = UrlShortener.Url.insert({longUrl: linktext});
        //Logger.log ('Shortened URL is ' + url.id) ;
        
        //Tweet samenstellen
        tweetmsg = tweetmsgbegin + ' ' + shipsname + ' ' + beweging + ' ' + portname + '. ' + url.id;
        Logger.log (tweetmsg);
        
        //tweet mailen
        try {
          MailApp.sendEmail('xxx@gmail.com', '#mensensmokkel', tweetmsg);
        }  catch (err) {
          // handle the error here
        }
        
        //mail verwijderen
        threads[i].moveToTrash();
        Logger.log ('trashed email: '+ subject);            
      }
     
    }
    
  }

}

String.prototype.toProperCase = function () {
//Function to return all words in a string capitalized
/* 
https://www.w3schools.com/jsref/jsref_obj_regexp.asp
https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
*/
      return this.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
