
require.config({
    baseUrl: '..',
    paths: {
        'mocha': 'build/mocha/mocha',
        'assert': 'build/node-assert/assert',
    },
    //urlArgs: 'bust=' + (new Date()).getTime()
});

require(['require', 'mocha'],function(require){
    mocha.setup('bdd');
    mocha.bail(false);
    require(['base.js'], function(){
        mocha.run(); });
});
