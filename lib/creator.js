// lib/creator.js 编写一个creator类，整个找模板到下载模板的主要逻辑都抽象到了这个类中。
import { fetchRepoList } from './request.js';
import { loading } from './utils.js';
import ora from 'ora';
import downloadGitRepo from 'download-git-repo';
import inquirer from 'inquirer';
import chalk from 'chalk';
import util from 'util';
import { SPINNERSTYLE } from './config.js';

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName;
    this.dir = targetDir;
    // 将downloadGitRepo转成promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  fetchRepo = async () => {
    try{
      const branches = await loading(fetchRepoList, 'waiting for fetch resources');

      return branches;
    }catch(e){
      console.log(e);
    }
  }


  download = async (branch) => {
    const spinner = ora(`downloading ${branch}...,If the download is too slow, please try to use VPN`);
    spinner.start();
    spinner.spinner = SPINNERSTYLE;

    // 1 拼接下载路径 这里放自己的模板仓库url
    const requestUrl = `github:YoseR1cho/next-blog/#${branch}`;
    try{
    // 2 把资源下载到某个路径上
      await this.downloadGitRepo(requestUrl, this.dir);
      spinner.succeed()
    }catch(e){
      console.log(e);
      spinner.fail('something go wrong,Please retry later.');
    }
    
    console.log(chalk.green('done!'));
  }

  create = async () => {
    // 1 先去拉取当前仓库下的所有分支
    const branches = await this.fetchRepo();
    // 这里会在shell命令行弹出选择项，选项为choices中的内容
    const { curBranch } = await inquirer.prompt([
      {
        name: 'curBranch',
        type: 'list',
        // 提示信息
        message: 'please choose current version:',
        // 选项
        choices: branches
          .filter((branch) => branch.name !== 'main')
          .map((branch) => ({
            name: branch.name,
            value: branch.name,
          })),
      },
    ]);
    // 2 下载
    await this.download(curBranch);
  }
};

export default Creator;
