import { Meteor } from 'meteor/meteor';

import { Events } from '../collections/events.js'
import { Messages } from '../collections/messages.js'
import { CurrentUsers } from '../collections/users.js'

Meteor.startup(() => {
  // code to run on server at startup
    Meteor.methods({
        store: function (category, description, name, host, location, date) {
            console.log("!@#$%^&*()");
            Events.insert({'category': category, 'name': name, 'description': description, 'eventDate': date, 'location': location, 'host': host, 'users': ["temp"]});
        },
         getCurrentMessages: function(){
         	var name=CurrentUsers.find({userId:Meteor.userId()}, {fields:{name: 1}}).fetch()[0]['name'];
         	var finalArr=[];
         	console.log(name);
         	newName=[];
         	newName[0]=name;
        	var toArr=Messages.find({to: newName}, {fields:{from: 1}}).fetch();
        	var map={};
        	var counter=0;
        	for (var i = 0; i < toArr.length; i++){
        		if(toArr[i]['from'] in map){
        			counter+=1;
        			continue;
        		}
        		finalArr[i-counter]=toArr[i]['from'];
        		map[toArr[i]['from']]=1;
        	}
        	console.log(finalArr);
        	return finalArr;
        },

        storeMessages: function(to, message){
        	var newFrom=CurrentUsers.find({userId:Meteor.userId()}, {fields:{name: 1}}).fetch();
        	console.log(newFrom)
        	console.log(to)
        	console.log(message)
        	Messages.insert({'to': to, 'from':newFrom[0]['name'], 'message':message});
        },
        getMessages: function(name){
       		var newName=name.split(',');
			var curUser=CurrentUsers.find({userId:Meteor.userId()}, {fields:{name: 1}}).fetch()[0]['name'];
			var newCurUser=[];
			newCurUser[0]=curUser;
        	console.log(name);
        	console.log(curUser);
        	console.log(newName);
        	console.log(newCurUser);
        	//console.log(Messages.find({"$or":[{"$and":[{to: name}, {from: name}]}, {"sort": [['datefield', 'desc']]}, {"limit":10}).fetch());
        	var recentMessages=Messages.find({"$or":[{"$and":[{to: newCurUser}, {from: name}]}, {"$and":[{to: newName}, {from:curUser}]}]}, {"sort": [['datefield', 'desc']]}, {"limit":10}).fetch();
        	console.log(recentMessages);
        	return recentMessages;
        },
        
        profile_update: function (curr_id, name, bio) {
            console.log("in profile update");
            console.log(curr_id);
            console.log(CurrentUsers.find({userId: curr_id}).fetch());
            CurrentUsers.update({userId: curr_id}, { $set: {name: name, bio: bio}}, {multi: true});
            console.log("after");
            console.log(CurrentUsers.find({userId: curr_id}).fetch());
        },
        add_curr_user: function (curr_id) {
            console.log("in add_curr_user");
            var curr = CurrentUsers.find({userId: curr_id}).fetch().length;
            console.log("curr length: " + curr);
            if ( curr === 0) {
                return true;
            }
        },
        check_profile_info : function(curr_id) {
            console.log("in check user profile Info");
            var curr_user = (CurrentUsers.find({userId: curr_id}).fetch())[0];
            var json = [false];
            if (curr_user !== undefined) {
                console.log(curr_user.name);
                console.log(curr_user.bio);
                var curr_name = curr_user.name;
                var curr_bio = curr_user.bio;

                if (curr_name !== "undefined" && curr_bio !== "undefined") {
                    console.log("in main, updating look");
                    json = [true, curr_name, curr_bio];
                }
                else {
                    console.log("no name and bio");
                }
            }
            return json;
        },
        joinEvents: function (userId, eventId) {
            var updatedRecords = Events.update(
                { _id: eventId},
                { $push: {users: userId}}
            );
            return updatedRecords
        },
        leaveEvents: function (userId, eventId) {
            var updatedRecords = Events.update(
                { _id: eventId},
                { $pull: {users: userId}}
            );
            return updatedRecords
        },
        cancelEvents: function (eventId) {
            var updatedRecords = Events.remove(
                { _id: eventId}
            );
            return updatedRecords
        },
        find_host_events : function(curr_id) {
            console.log("in find events ****************************");
            var events_array = Events.find({host: curr_id}, {multi: true}).fetch();
            console.log(events_array);
            console.log("type is =.= " + typeof(events_array));
            var data;
            if (events_array.length > 0) {
                console.log("in main - have events - display events");
                data = [true, events_array];
            }
            else {
                console.log("no events - display text");
                data = [false];
            }
            return data;
        },
        find_going_events : function(curr_id) {
            console.log("in find going  events $$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            var curr_user_name = ((CurrentUsers.find({userId: curr_id}).fetch())[0]).name; // get user name
            console.log(curr_user_name);
            var all_events = Events.find({}).fetch();
            console.log(all_events);
            var curr_user_events_array = [];

            // get all the events -> check their users lists -> check if the current user_name
            // is in the users list -> if yes, get the event info
                                //  -> if not, skip
            // if events.array lenth > 0, return true and the array; else, return false array

            for(var i = 0; i < all_events.length; i++) {
                var users = all_events[i].users;
                console.log("users: " + users);
                for(var j = 0; j < users.length; j++) {
                    if(users[j] === curr_user_name) {
                        console.log("have the same name!");
                        // get the event data into the curr_user_events_array;
                        curr_user_events_array.push(all_events[i]);
                    }
                }
            }
            console.log("finally event_list: " + curr_user_events_array);
             var data;
            if (curr_user_events_array.length > 0) {
                console.log("in main - going to events - display events");
                data = [true, curr_user_events_array];
            }
            else {
                console.log("not going to any events - display text");
                data = [false];
            }
            return data;
        }
    })
});
