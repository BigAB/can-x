import QUnit from 'steal-qunit';
import * as CanX from '../can-x';

QUnit.module('can-x', function() {

	QUnit.test('It has the same properties as MobX', function(assert) {
		assert.ok(['Provider', 'inject', 'observer', 'action'].every(exprt => exprt in CanX) );
	});
	
});
