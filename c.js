const fs = require('fs');
const path = require('path');
// const sscanf = require('sscanf');

function writeFileSyncRecursive(filename, content, charset = 'utf8') {
    let filepath = filename.replace(/\\/g,'/');  
  
    let root = '';
    if (filepath[0] === '/') { 
      root = '/'; 
      filepath = filepath.slice(1);
    } 
    else if (filepath[1] === ':') { 
      root = filepath.slice(0,3);   // c:\
      filepath = filepath.slice(3); 
    }
  
    const folders = filepath.split('/').slice(0, -1);  // remove last item, file
    folders.reduce(
      (acc, folder) => {
        const folderPath = acc + folder + '/';
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
        }
        return folderPath
      },
      root
    ); 
    
    fs.writeFileSync(root + filepath, content, charset);
}
  

function scaner(y){
    let y1 = fs.readdirSync(y);
    for(let x of y1){
        let Path = path.join(y, x);
        let stat = fs.statSync(Path); // тут забыли путь
        if(!stat.isFile()){
            scaner(Path);
        }
        else compileFile(Path);
    }
}
scaner('./src');

function compileFile(path) {
    let code = fs.readFileSync(path).toString();
    // fs.writeFileSync(__dirname + '/index_compiled.js', );
    let lines = code.split('\r\n');
    lines = lines.filter(value => value.length > 0)
    // console.log(lines);
    let replacedLines = []; // массив заменённых строк, чтобы заново не заменять
    let ignoreLines = []; // строки, которые нужно игнорировать
    
    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if(line.search('<style>') != -1) {
            for(let j = i; j < lines.length; j++) {
                if(lines[j].search('</style>') != -1) break;
                ignoreLines.push(j);
            }
            break;
        }
    }

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if(line.search('<script>') != -1) {
            for(let j = i; j < lines.length; j++) {
                if(lines[j].search('</script>') != -1) break;
                ignoreLines.push(j);
            }
            break;
        }
    }
    
    // 1 этап компиляции(обрабатываем многострочный HTML)
    
    for(let i = 0; i < lines.length; i++) {
        //console.log(lines[i]);
        if(ignoreLines.includes(i)) continue;
        const line = lines[i];
    
        if(line.search('<>') != -1) {
            let start = i;
            // console.log('Found <> on', start, ' in ', line);
            lines[i] = line.replace('<>', '`');
            replacedLines.push(i);
            for(let j = start; j < lines.length; j++) {
                if(ignoreLines.includes(j)) continue;
                const lline = lines[j];
                //console.log('j', j, lline);
                replacedLines.push(j);
                if(lline.search('</>') != -1) 
                {
                    lines[j] = lline.replace(new RegExp('</>', 'g'), '`');
                    replacedLines.push(j);
                    // console.log('End on', j);
                    break;
                }
                lines[j] = lline.replace(new RegExp('{', 'g'), '${');
            }
        }
    }
    
    // console.log(replacedLines);
    
    String.prototype.reverse = function () {
        return this.split('').reverse().join('');
    };
    function replaceLast(str, what, replacement) {
        return str.reverse().replace(new RegExp(what.reverse()), replacement.reverse()).reverse();
    }
    
    // 2 этап, обрабатываем однострочный HTML
    for(let i = 0; i < lines.length; i++) {
        if(ignoreLines.includes(i)) continue;
        const line = lines[i];
    
        if(/<[\s\S]*?!?>/.test(line) && replacedLines.indexOf(i) == -1) { // если есть HTML тэги
    
            let start = line.indexOf('<');
            let end = line.lastIndexOf('>');
            let beforeTags = line.slice(0, start);
            let underTags = replaceLast(line.slice(start, end+1).replace('<', '`<').replace(new RegExp('{', 'g'), '${'), '>', '>`');
            let afterTags = line.slice(end+1);
    
            lines[i] = beforeTags + underTags + afterTags;
        }
    }
    
    // 3 этап(заменяем кастомные теги на вызовы функций компонентов)
    for(let i = 0; i < lines.length; i++) {
        if(ignoreLines.includes(i)) continue;
        const line = lines[i];
    
        let index = line.search('<');
        if(/[A-Z]/.test(line[index+1]) && line[index-1] != "'" && line[index-1] != '"' && line[index-1] != "`") { // Если тэг начинается с большой буквы, значит это компонент!
            let start = index+1;
            let end = -1;
            for(let j = start; j < line.length; j++) {
                if(line[j] == '>') {
                    end = j;
                    break;
                }
            }
    
            lines[i] = '${'+line.slice(start, end).replace('/', '') + '()}';
        }
    }
    
    writeFileSyncRecursive(path.replace('src', 'dist'), lines.join('\r\n'));
}