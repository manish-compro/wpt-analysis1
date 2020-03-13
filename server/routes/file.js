const { google } = require('googleapis');
const keys = require('../../test/data/googleSheetKey.json');

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);
const SHEETNAME = "Prod";
const opt = {
  spreadsheetId: "1r8i-3JxP5AQwU4zXpe6zshBkVVMQ2mZZa3_MKdipjDE",
  range: SHEETNAME + "!A2:A"
};
const gsapi = google.sheets({version: 'v4', auth: client});

const writeData = function(apiData, cb) {
  let apiTimeTaken = [];
  let newApis = [];
  let len;
  let columnName = getDateWiseColumnName();
  readSheetData()
  .then(sheetData => {
    for (let apiDetails of apiData) {
      var indexNum = getMatchingIndexNumberForApi(apiDetails.title, sheetData);
      if(indexNum == undefined) {
        console.log("No Matching Row found. Creating a new entry");
        if(sheetData["data"]["values"] != undefined) {
          len = sheetData["data"]["values"].length;
          sheetData["data"]["values"].push([apiDetails.title.replace(/.*? - /, '')]);
        } else {
          len = 0;
          sheetData["data"]["values"] = [apiDetails.title.replace(/.*? - /, '')];
        }
        newApis[len] = apiDetails.title.replace(/.*? - /, '');
        apiTimeTaken[len] = apiDetails.timeTaken;
      } else {
        apiTimeTaken[indexNum] = apiDetails.timeTaken;
      }
    }
    if(newApis.length != 0) {
      updateCellData(SHEETNAME + "!A2", newApis, opt.spreadsheetId)
      .then( () => {
        cellRef = SHEETNAME + "!" + columnName + 2;
        updateCellData(cellRef, apiTimeTaken, opt.spreadsheetId)
        .then( () => {
          cb();
        })
        .catch(err => {
          console.log(`Update cell data failed with error ${err}`);
          cb();              
        })
      })
      .catch(err => {
        console.log(`Update cell data failed with error ${err}`);
        cb();        
      })
    } else {
    cellRef = SHEETNAME + "!" + columnName + 2;
    updateCellData(cellRef, apiTimeTaken, opt.spreadsheetId)
    .then( () => {
      cb();
    })
    .catch(err => {
      console.log(`Update cell data failed with error ${err}`);
      cb();
    });
  }   
  })
  .catch(err => {
    console.log(`Read cell data failed with error ${err}`);
    cb();
  })
}

function updateCellData(cellRef, data, spreadsheetId) {
  return new Promise(function(resolve,reject) {
    let range = cellRef;
    let valueInputOption = "RAW";
    let values = [data];
    let resource = {
      values: values,
      majorDimension: "COLUMNS"
    };
    gsapi.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: valueInputOption,
      resource: resource
    })
    .then( () => {
      resolve();
    })
    .catch(err => {
      reject(err);
    })
  });
}

function readSheetData() {
  return new Promise(function(resolve,reject) {
    gsapi.spreadsheets.values.get(opt)
    .then(data => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    });
  });
}

function getMatchingIndexNumberForApi(apiTitle, data) {
  if (data["data"]["values"] != undefined) {
    for (i=0; i < (data["data"]["values"]).length; i++) {
      if((((data["data"]["values"])[i])[0]) != undefined) {
        str = (((data["data"]["values"])[i])[0]).toLowerCase();
        if (apiTitle.replace(/.*? - /, '').toLowerCase() === str) {
          return i;
        }
      }
    }
  }
  return undefined;
}

function getDateWiseColumnName() {
  let currentDate = new Date().getDate();
  if(currentDate + 65 <= 90) {
    return String.fromCharCode(currentDate + 65);
  } else {
    return ("A" + String.fromCharCode(currentDate + 65 - 26));
  }
} 

module.exports = {
  writeData: writeData
};