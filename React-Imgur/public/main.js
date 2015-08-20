"use strict";

$(document).ready(function () {
  var LoadingGif = React.createClass({
    displayName: "LoadingGif",

    render: function render() {
      return React.createElement(
        "div",
        { className: "loading" },
        React.createElement("img", { src: "ellipsis.gif", alt: "Loading ellipsis" })
      );
    }
  });

  var PictureGallery = React.createClass({
    displayName: "PictureGallery",

    propTypes: {
      token: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { images: [] };
    },

    componentDidMount: function componentDidMount() {
      var pictures = [];
      $.ajax({
        url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
        type: 'GET',
        headers: {
          Authorization: 'Client-ID ' + this.props.token
        },
        success: (function (result) {
          for (var i = 0; i < result.data.length; i++) {
            if (!result.data[i].is_album) {
              pictures.push({
                id: result.data[i].id,
                url: result.data[i].link,
                title: result.data[i].title
              });
            }
          }
          this.setState({ images: pictures });
          $('.loading').hide();
        }).bind(this)
      });
    },
    render: function render() {
      var imgGallery = this.state.images.map(function (image, i) {
        return React.createElement(
          "div",
          { key: i, identity: image.id, id: "parent" },
          React.createElement(
            "h4",
            null,
            image.title
          ),
          React.createElement(
            "a",
            { href: image.url, target: "_blank" },
            React.createElement("img", { id: "Centered", src: image.url })
          )
        );
      });

      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          " Simple React Web App that returns the hot and viral pictures in Imgur. Scroll down and enjoy!"
        ),
        React.createElement(LoadingGif, null),
        imgGallery
      );
    }
  });

  React.render(React.createElement(PictureGallery, { token: "ac4d88c5194be37" }), document.getElementById('content'));
});
