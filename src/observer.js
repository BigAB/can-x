import React, {Component} from "react";
import compute from 'can-compute';

const reactiveMixin = {
	componentWillMount() {
		this._render = this.render;
		this.render = compute(function() {
			return this._render();
		}, this);
		this.render.on("change", () => {
			this.forceUpdate();
		});
	},
	componentDidMount() {},
	componentWillUnmount() {
		this.render.off('change');
	},
	componentDidUpdate() {

		// },
		// shouldComponentUpdate(nextProps, nextState, nextContext) {
		//   return true;
	}
};

function createObservedClass(componentClass) {
	if (!componentClass) {
		throw new Error("Please pass a valid component to 'observer'");
	}
	if (componentClass.isCanXInjector === true) {
		// eslint-disable-next-line no-console
		console.warn("CanX observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'");
	}
	// if is a stateless function component, wrap in a full React class
	if (isFunctionComponent(componentClass)) {
		componentClass = statifyFunctionComponent(componentClass);
	}
	mixinLifecycleEvents(componentClass.prototype || componentClass);
	return componentClass;
}

export const isFunctionComponent = Component => {
	return (typeof Component === "function" && (!Component.prototype || !Component.prototype.render) && !Component.isReactClass && !React.Component.isPrototypeOf(Component));
};

export const statifyFunctionComponent = componentClass => {
	return class extends Component {
		static displayName = componentClass.displayName || componentClass.name;
		static contextTypes = componentClass.contextTypes;
		static propTypes = componentClass.propTypes;
		static defaultProps = componentClass.defaultProps;
		render() {
			return componentClass.call(this, this.props, this.context);
		}
	};
};

function mixinLifecycleEvents(target) {
	patch(target, "componentWillMount", true);
	["componentDidMount", "componentWillUnmount", "componentDidUpdate"].forEach(function(funcName) {
		patch(target, funcName);
	});
	// if (!target.shouldComponentUpdate) {
	//   target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate;
	// }
}

/* Taken directly from MobX */
function patch(target, funcName, runMixinFirst = false) {
	const base = target[funcName];
	const mixinFunc = reactiveMixin[funcName];
	const f = !base
		? mixinFunc
		: runMixinFirst === true
			? function() {
				mixinFunc.apply(this, arguments);
				base.apply(this, arguments);
			}
			: function() {
				base.apply(this, arguments);
				mixinFunc.apply(this, arguments);
			};
	target[funcName] = f;
}

/**
 * Observer function / decorator
 */
export default function observer(target) {
	if (typeof target === "function") {
		return createObservedClass(target);
	} else {
		const config = target;
		return componentClass => createObservedClass(componentClass, config);
	}
}
