var express = require('express');
var router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');

const {google} = require('googleapis');
const keys = require('../keys.json');


const doc = new GoogleSpreadsheet('1TyKraiaM7Pqwxmm2VJx2TPpkTiYdmzw9d8PalBU4iwc');

 router.get('/', function(req, res, next) {

res.send(200)
createSheet();

    // Authorize a client with credentials, then call the Google Sheets API.
    //authorize(listMajors);


});

 async function createSheet(){
    await doc.useServiceAccountAuth(keys);
    await doc.loadInfo();
    console.log(doc.title);
    const sheet = await doc.addSheet({ title: 'WPT DATA',  headerValues: ['Step', 'Miss', 'loadTime']  });
    await sheet.loadCells('A1:E10');
    
    const a1 = sheet.getCell(0, 0)
    const a2 = sheet.getCell(0, 1)
    const a3 = sheet.getCell(0, 2)
    a1.backgroundColor = { green : 1 };
    a2.backgroundColor = { green : 1};
    a3.backgroundColor = { green : 1 };

    const larryRow = await sheet.addRows([
        { Step: 1 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 2 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 3 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 4 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 5 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 6 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 7 , Miss: 'Miss', loadTime : '0.1' },
        { Step: 8 , Miss: 'Miss', loadTime : '0.1' },
       
      ]);

  






    

   
    a1.textFormat = { bold: true, fontSize: 12  };
    a2.textFormat = { bold: true, fontSize: 12  };
    a3.textFormat = { bold: true, fontSize: 12  };
  

    await sheet.saveUpdatedCells();
}




module.exports = router;
