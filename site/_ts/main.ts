import alpine from 'alpinejs';

import './lib/header.js';
import {logger} from './lib/logger.js';
import './lib/quick-link.js';
import './lib/register-service-worker.js';

logger.banner?.('Alwatr 12fy');
logger.logModule?.('main');

alpine.start();
