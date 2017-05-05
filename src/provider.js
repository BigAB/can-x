import React, {Component} from 'react';
import * as PropTypes from './prop-types';

const specialReactKeys = {
	children: true,
	key: true,
	ref: true
};

export default class Provider extends Component {

	static contextTypes = {
		canxStores: PropTypes.canObservable
	};

	static childContextTypes = {
		canxStores: PropTypes.canObservable.isRequired
	};

	static propTypes = {
		children: PropTypes.node
	};
	
	getChildContext() {
		const stores = {};
		// inherit stores
		const baseStores = this.context.canxStores;
		if (baseStores)
			for (let key in baseStores) {
				stores[key] = baseStores[key];
			}
		// add own stores
		for (let key in this.props) {
			if (!specialReactKeys[key]) {
				stores[key] = this.props[key];
			}
		}
		return {canxStores: stores};
	}

	render() {
		return React.Children.only(this.props.children);
	}
}
