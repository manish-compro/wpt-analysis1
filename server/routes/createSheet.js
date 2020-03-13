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
    const sheet = await doc.addSheet({ title: 'WPT DATA',  headerValues: ['Step', 'Miss/Hit', 'Load Time']  });
    await sheet.loadCells('A1:E10');
    
    const a1 = sheet.getCell(0, 0)
    const a2 = sheet.getCell(0, 1)
    const a3 = sheet.getCell(0, 2)
    a1.backgroundColor = { green : 1 };
    a2.backgroundColor = { green : 1};
    a3.backgroundColor = { green : 1 };
    const larryRow = await sheet.addRow({ name: 'Larry Page', email: 'larry@google.com' });
const moreRows = await sheet.addRows([
  { name: 'Sergey Brin', email: 'sergey@google.com' },
  { name: 'Eric Schmidt', email: 'eric@google.com' },
]);

// read rows
const rows = await sheet.getRows(); // can pass in { limit, offset }

// read/write row values
console.log(rows[0].name); // 'Larry Page'
rows[1].email = 'sergey@abc.xyz'; // update a value
await rows[1].save(); // save updates
await rows[1].delete(); // delete a row
    
   
   
    a1.textFormat = { bold: true, fontSize: 12  };
    a2.textFormat = { bold: true, fontSize: 12  };
    a3.textFormat = { bold: true, fontSize: 12  };
  

    await sheet.saveUpdatedCells();
}




module.exports = router;
