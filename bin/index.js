#! /usr/bin/env node

// 1 配置可执行的命令 commander
import { Command } from 'commander';
import chalk from 'chalk';
import config from '../package.json' assert { type: 'json' };
import create from '../lib/create.js';

const program = new Command();

program
  .command('create <app-name>')  // 创建命令
  .description('create a new project') // 命令描述
  .action((name, options, cmd) => {
    create(name,options,cmd);
  });

program.on('--help', () => {
  console.log();
  console.log(`Run ${chalk.cyan('rippi <command> --help')} to show detail of this command`);
  console.log();
});

program
  // 说明版本
  .version(`YoseR1cho@${config.version}`)
  // 说明使用方式
  .usage('<command [option]');

// 解析用户执行命令传入的参数
program.parse(process.argv);
