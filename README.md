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
useRef返回一个对象，其中current属性保存变量的值

使用Svg而不是font icon，使用reactfontawesome
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome

使用PropTypes进行类型检查
FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

npm i --save @fortawesome/free-brands-svg-icons

files.map(file => (file.title))
files.map(file {return(file.title)})
圆括号直接返回，是省略掉return的写法

使用npm install node-sass --save支持sass预处理器
npm install classnames --save
npm install --save react-simplemde-editor React适配的SimpleMDE
npm install --save uuid 生成独一无二的id码