import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/legnaxz.github.io', // 또는 '/yourname.github.io' 로 설정할 수도 있음
    }
  }
};

export default config;
