// lib/create.js
import path from 'path';
import fs from 'fs'
import Creator from './creator.js';
import inquirer from 'inquirer';

/**
 * 执行create时的处理
 * @param {any} name // 创建的项目名
 * @param {any} options // 配置项 必须是上面option配置的选项之一，否则就报错  这里取的起始就是cmd里面的options的各个option的long属性
 * @param {any} cmd // 执行的命令本身 一个大对象，里面很多属性
 */
const create = async (projectName, options, cmd) => {
  // 获取工作目录
  const cwd = process.cwd();
  // 目标目录也就是要创建的目录
  const targetDir = path.join(cwd, projectName);

  if(fs.existsSync(targetDir)) {
    // 目录已存在
    if(options.force){
      fs.unlink(targetDir,(err)=>{
        if(err) console.log(err);
      });
    } else {
      const {action} = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: `Target directory ${projectName} already exists. Pick an action:`,
        choices: [
          { name: 'overwrite', value: 'overwrite' },
          { name: 'cancel', value: false }
        ]
      });

      if(!action) {
        return;
      }else{
        console.log('\r\noverwriting...');
        fs.unlink(targetDir,(err)=>{
          if(err){
            console.log(err);
            return;
          }
          console.log('overwrite done');
        });
        
      }
    }
  }
  // 创建项目
  const creator = new Creator(projectName, targetDir);
  creator.create();
};

export default create;



