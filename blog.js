
Posts = new Meteor.Collection('posts');

if (Meteor.isClient) {

  Handlebars.registerHelper("debug", function(optionalValue) { 
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  Meteor.Router.add({
    '/': function() {
      Template.home.events({
        'click a.postCreateBtn': function(e) {
          e.preventDefault();
          Meteor.Router.to('/posts/create');
        },
        'click a.postView': function(e) {
          e.preventDefault();
          Meteor.Router.to('/posts/'+this._id);
        }
      });

      Template.home.data = function() {
        return {
          posts: Posts.find(), 
          user: Meteor.users.findOne({_id: Meteor.userId()})
        };
      }

      // helper
      Template.home.avatar = function(userId) {
        Meteor.autosubscribe(function() {
          Meteor.subscribe('users', userId);
        });

        user = Meteor.users.findOne({_id: userId});
        avatar = '';
        if(user.services) {
          avatar = get_avatar_from_service('google', user.services.google.id, 70);
        }
        
        return avatar;
      }

      return 'home';
    },

    '/posts/create': function() {
      if(Meteor.user() == null) {
        Meteor.Router.to('/');
      }

      Template.postCreate.events({
        'submit form': function(e) {
          e.preventDefault();
          Posts.insert({title: $('#title').val(), message: $('#message').val(), user: Meteor.user()});
          Meteor.Router.to('/');
        }
      });

      return 'postCreate';
    },

    '/posts/:id': function(id) {
      Template.postView.post = function() {
        return Posts.findOne({ _id: id });
      }

      return 'postView';
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('users', function(userId) {
      user = Meteor.users.find({_id: userId}, {fields: {
        createdAt: 1,
        profile: 1,
        services: 1
      }});
      return user;
    });
  });
}