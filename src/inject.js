import React, {Component} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

const injectorContextTypes = {
	canxStores: PropTypes.object
};
Object.seal(injectorContextTypes);

const proxiedInjectorProps = {
	contextTypes: {
		get: function() {
			return injectorContextTypes;
		},
		configurable: true,
		enumerable: false
	},
	isCanXInjector: {
		value: true,
		writable: true,
		configurable: true,
		enumerable: false
	}
};

/**
 * Store Injection
 */
function createStoreInjector(grabStoresFn, component, injectNames) {
	let displayName = "inject-" + (component.displayName || component.name || (component.constructor && component.constructor.name) || "Unknown");
	if (injectNames) {
		displayName += "-with-" + injectNames;
	}

	class Injector extends Component {

		static displayName = displayName;

		render() {
			let newProps = Object.assign({}, this.props);
			const additionalProps = grabStoresFn(this.context.canxStores || {}, newProps) || {};
			Object.assign(newProps, additionalProps);
			return React.createElement(component, newProps);
		}
	}

	// Static fields from component should be visible on the generated Injector
	hoistStatics(Injector, component);

	Injector.wrappedComponent = component;
	Object.defineProperties(Injector, proxiedInjectorProps);

	return Injector;
}

function grabStoresByName(storeNames) {
	return function(baseStores, nextProps) {
		storeNames.forEach(storeName => {
			if (storeName in nextProps)
				return; // prefer props over stores

			if (!(storeName in baseStores)) {
				throw new Error("CanX observer: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
			}
			nextProps[storeName] = baseStores[storeName];
		});
		return nextProps;
	};
}

/**
 * higher order component (decorator) that injects stores to a child
 */
export default function inject(...storeNames) {
	const grabStoresFn = grabStoresByName(storeNames);
	return (componentClass) => {
		return createStoreInjector(grabStoresFn, componentClass, storeNames.join("-"));
	};
}
