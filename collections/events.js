/**
 * Created by ishanguru on 12/18/16.
 */
import { Mongo } from 'meteor/mongo'

import { UsersSchema } from './users.js'

export const Events = new Mongo.Collection("events");

/*Events.allow({
   insert: function (userId, doc) {
   }
});*/

EventSchema = new SimpleSchema({

    eventId: {
        type: String,
        label: "EventId",
        autoValue: function () {
            return new Meteor.Collection.ObjectID().toHexString();
        }
    },

    category: {
        type: String,
        label: "Category"
    },

    name: {
        type: String,
        label: "Name"
    },

    description: {
        type: String,
        label: "Description"
    },

    location: {
        type: String,
        label: "Location"
    },

    eventDate: {
        type: String,
        label: "Event Date"
    },

    createdAt: {
        type: Date,
        label: "Created At",
        autoValue: function (){
            return new Date()
        }
    },

    host: {
        type: String,
        label: "Host"
    },

    users: {
        type: [String],
        label: "People going"
    }

});

Events.attachSchema(EventSchema);

if (Meteor.isServer) {
    Meteor.publish('events', function() {
        return Events.find({});
    });
} else if (Meteor.isClient) {
    Meteor.subscribe('events');
}
