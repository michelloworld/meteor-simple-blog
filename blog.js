Posts = new Meteor.Collection('posts');

if (Meteor.isClient) {
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

      Template.home.posts = function() {
        return Posts.find();
      }

      return 'home';
    },

    '/posts/create': function() {
      Template.postCreate.events({
        'submit form': function(e) {
          e.preventDefault();
          Posts.insert({title: $('#title').val(), message: $('#message').val()});
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

/*if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}*/