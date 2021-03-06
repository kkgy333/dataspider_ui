// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称
import BaseLayout from './layouts/BaseLayout';
import BlankLayout from './layouts/BlankLayout';
import Home from './pages/Home';
import ServerError from './pages/Exception/ServerError';
import NotFound from './pages/Exception/NotFound';
import View from './pages/View';
import Login from './pages/Login';

const routerConfig = [
  {
    path: '/',
    layout: BaseLayout,
    component: Home,
  },
  {
    path: '/login',
    layout: BlankLayout,
    component: Login,
  },
  {
    path: '/view',
    component: View,
    layout: BaseLayout,
  },
  {
    path: '/500-with-basic-layout',
    layout: BaseLayout,
    component: ServerError,
  },
  {
    path: '*',
    layout: BlankLayout,
    component: NotFound,
  },
];

export default routerConfig;
