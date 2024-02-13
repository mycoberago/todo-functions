import admin = require("firebase-admin");

try {
  admin.initializeApp();
} catch (error) {
  console.log(error);
}

const addToDo = require("./funcs/addToDo");
exports.addToDo = addToDo.addToDo;

const deleteToDo = require("./funcs/deleteToDo");
exports.deleteToDo = deleteToDo.deleteToDo;

const updateToDo = require("./funcs/updateToDo");
exports.updateToDo = updateToDo.updateToDo;
