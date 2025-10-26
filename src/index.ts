import { attactComponent } from './ui/parsing/dom_utils';
import { App } from './ui/components/App/App';

const main = document.getElementById('main');

const app = App({});

const remove = attactComponent(main, app);
