/**
 * Created by ishanguru on 11/21/16.
 */

Router.configure({
    layoutTemplate: 'navigationLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'pageNotFound',
    landingTemplate: 'home'
});

var requireLogin = function() {
    if (Meteor.user()) {
        this.next();
    } else {
        if (Meteor.loggingIn()) {
            this.render('loading');
        }
        this.render('notLoggedIn');
    }
};

//hooks
Router.onBeforeAction(requireLogin, {only: ['home', 'addEvents', 'eventsPage', 'messages', 'profile']});

Router.route('/', {
    name: 'home'
});

Router.route('/addEvents');

Router.route('/messages');

Router.route('/profile');

Router.route('/eventsPage');

