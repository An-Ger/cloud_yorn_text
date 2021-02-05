Electron
同时运行npm run dev和npm start使用&命令
    "ele": "electron .",
    "dev": "npm start & npm run dev"

使用npm install concurrently --save-dev同时运行
在package中需要转译使用
    "dev": "concurrently \"electron .\"  \"npm start\" "
在React运行之后，Electron才可以正常加载，否则是白屏，使用wait-on解决白屏问题
npm install wait-on --save-dev
改进package.json指令
 "dev": "concurrently \"wait-on http://localhost:3000 && electron .\"  \"npm start\" "
 解决React不打开浏览器tab，create-react-app提供了一个环境变量，启动的时候可以不打开该页面
 使用cross-env解决跨平台问题npm install cross-env --save-dev
     "dev": "concurrently \"wait-on http://localhost:3000 && electron .\"  \" cross-env BROWSER=none  npm start\" "

使用flex进行弹性盒布局