import axios from 'axios';
import https from 'https'

axios.interceptors.request.use((config) => {
  config.httpsAgent = new https.Agent({
    rejectUnauthorized: false
  })

  return config
});


axios.interceptors.response.use((res) => {
  return res.data;
});

// 这里是获取模板仓库的所有分支，url写自己的模板仓库url
export const fetchRepoList = () => {
  return axios.get('https://api.github.com/repos/YoseR1cho/next-blog/branches');
};