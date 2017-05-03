import QUnit from 'steal-qunit';
import plugin from './can-x';

QUnit.module('can-x');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-x plugin');
});
