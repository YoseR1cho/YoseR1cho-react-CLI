import ora from 'ora';
import { SPINNERSTYLE } from './config.js';

export const loading = async (fn, msg, ...args) => {
  // 计数器，失败自动重试最大次数为3，超过3次就直接返回失败
  let counter = 0;
  const run = async () => {
    const spinner = ora(msg);
    spinner.spinner = SPINNERSTYLE
    spinner.start();
    try {
      const result = await fn();
      spinner.succeed();
      return result;
    } catch (error) {
      console.log(error);

      spinner.fail('something go wrong, refetching...');
      if (++counter < 3) {
        return run();
      } else {
        return Promise.reject();
      }
    }
  };
  return run();
};
