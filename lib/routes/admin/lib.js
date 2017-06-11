const Promise = require('bluebird');
const { dumpTable, resetTable } = require('../../utils/db');

const { debug } = require('debugger-256')('api:routes:admin');

const outputTableText = (name, records) => {
  let output = `\n${name}`;
  records.forEach((record) => {
    output += `\n   ${record.id}`;
    Object.keys(record).forEach((field) => {
      if (field !== 'id') {
        output += `\n      ${field} => ${record[field]}`;
      }
    });
  });
  return output;
};

const outputTableHtml = (name, records) => {
  let output = `<br /><h3>${name}</h3>`;
  records.forEach(function (record) {
    output += `<pre>${JSON.stringify(record)}</pre>`;
  });
  return output;
};

const outputTable = (name, isCurl) => {
  return dumpTable(name)
    .then(records => {
      if (isCurl) {
        return outputTableText(name, records);
      } else {
        return outputTableHtml(name, records);
      }
    });
};

const outputModel = (name, isCurl, models) => {
  return models[name].all
    .then(records => {
      if (isCurl) {
        return outputTableText(name, records);
      } else {
        return outputTableHtml(name, records);
      }
    });
};

const outputLine = (line, isCurl) => {
  return isCurl ? line : line.replace('\n', '<br />');
};

const outputCount = (name, models) => {
  return models[name].getCount()
    .then(count => {
      return `\n${name}\t${count}`;
    });
};

const resetModel = (name, isCurl, models) => {
  return models[name].reset()
    .then((results) => {
      if (results.errors === 0) {
        return outputLine(`\nReset model ${name} with ${results.inserted} records`);
      } else {
        throw Error(`Error resetting model ${name}`);
      }
    });
};

const emptyModel = (name, isCurl, models) => {
  // TODO: setup custom error handling
  if (!models[name]) {
    return Promise.resolve(`\nModel ${name} does not exist`);
  }
  return models[name].empty()
    .then((results) => {
      if (results.errors === 0) {
        return outputLine(`\nEmptied model ${name}`);
      } else {
        throw Error(`Error emptying model ${name}`);
      }
    });
};

module.exports = {
  emptyModel,
  resetModel,
  outputCount,
  outputModel,
  outputTable
};