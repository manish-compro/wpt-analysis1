var express = require('express');
var router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const keys = require('../keys.json');


const doc = new GoogleSpreadsheet('1TyKraiaM7Pqwxmm2VJx2TPpkTiYdmzw9d8PalBU4iwc');

 router.post('/', function(req, res, next) {


createSheet(req.body);
res.status(200).send('gotch');
    // Authorize a client with credentials, then call the Google Sheets API.
    //authorize(listMajors);


});

 async function createSheet(req){
    await doc.useServiceAccountAuth(keys);
    await doc.loadInfo();
    console.log(doc.title);
    const sheet = await doc.addSheet({ title: req.sheetName,  headerValues: ['run','step','label', 'miss', 'loadtime','thumbnailUrl']  });
    await sheet.loadCells('A1:H10');
    
    const a1 = sheet.getCell(0, 0)
    const b1 = sheet.getCell(0, 1)
    const c1 = sheet.getCell(0, 2)
    const d1 = sheet.getCell(0, 3)
    const e1 = sheet.getCell(0, 4)
    const f1 = sheet.getCell(0, 5)

    //const h1 = sheet.getcell(0, 8)
    a1.backgroundColor = { green : 1 };
    b1.backgroundColor = { green : 1};
    c1.backgroundColor = { green : 1 };
    d1.backgroundColor = { green : 1 };
    e1.backgroundColor = { green : 1 };
    f1.backgroundColor = { green : 1 };

    const larryRow = await sheet.addRows(req.data);

  






    

   
    a1.textFormat = { bold: true };
    b1.textFormat = { bold: true };
    c1.textFormat = { bold: true };
    d1.textFormat = { bold: true };
    e1.textFormat = { bold: true };
    f1.textFormat = { bold: true };
  

    await sheet.saveUpdatedCells();
}




module.exports = router;
