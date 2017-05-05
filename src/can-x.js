import Provider from './provider';
import inject from './inject';
import observer from './observer';

export function action(target) {
	return target;
}

export {inject, observer, Provider};

export default {
	action,
	inject,
	observer,
	Provider
};
