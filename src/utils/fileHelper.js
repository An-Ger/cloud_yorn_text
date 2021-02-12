//readFile && wirteFile
const fs = require("fs").promises;
const path = require("path");
const fileHelper = {
  readFile: (path) => {
    return fs.readFile(path, { encoding: "utf8" });
  },
  wirteFile: (path, content) => {
    return fs.writeFile(path, content, { encoding: "utf8" });
  },
  renameFile: (path, newPath) => {
      return fs.rename(path, newPath)
  },
  deleteFile: path => {
      return fs.unlink(path)
  }
};

const testPath = path.join(__dirname, "helper.js");
const testWritePath = path.join(__dirname, "hello.md");
const renamePath = path.join(__dirname, 'rename.md')
fileHelper.readFile(testPath).then((data) => {
  console.log(data);
});
fileHelper.wirteFile(testWritePath, "##hello world").then(() => {
  console.log("success");
});
fileHelper.renameFile(testWritePath, renamePath).then( () => {
    console.log('rename success');
})
fileHelper.deleteFile(renamePath).then( () => {
    console.log(`${renamePath}success`);
})