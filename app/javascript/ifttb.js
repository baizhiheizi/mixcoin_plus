// Entry point for the build script in your package.json
import '@hotwired/turbo-rails';
import './controllers';
import { application } from './controllers/application';

import ModalComponentController from '../components/modal_component_controller';
application.register('modal-component', ModalComponentController);
