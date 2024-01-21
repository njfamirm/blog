import alpine from 'alpinejs';

import {loadComments} from './lib/comment.js';
import './lib/header.js';
import {logger} from './lib/logger.js';
import './lib/service-worker.js';

logger.banner?.('Alwatr 12fy');
logger.logModule?.('main');

alpine.start();

window.onload = loadComments;
