const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// 确保目标目录存在
const distDir = path.join(__dirname, '../dist/main');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 编译主进程代码
exec('tsc --project tsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`编译错误: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log('主进程代码编译完成');
}); 