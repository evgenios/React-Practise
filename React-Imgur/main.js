'use strict';

$(document).ready(function () {
  var PictureGallery = React.createClass({
    displayName: 'PictureGallery',

    propTypes: {
      token: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { images: [] };
    },

    componentDidMount: function componentDidMount() {
      var images = [];
      $.ajax({
        url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
        type: 'GET',
        headers: {
          Authorization: 'Client-ID ' + this.props.token
        },
        success: (function (result) {
          for (var i = 0; i < result.data.length; i++) {
            if (!result.data[i].is_album) {
              images.push({
                id: result.data[i].id,
                url: result.data[i].link,
                title: result.data[i].title,
                desc: result.data[i].description
              });
            }
          }
          this.setState({ images: images });
        }).bind(this)
      });
    },
    render: function render() {
      var imgGallery = this.state.images.map(function (image, i) {
        return React.createElement(
          'div',
          { key: i, identity: image.id, id: 'parent' },
          React.createElement(
            'h4',
            null,
            image.title
          ),
          React.createElement('img', { id: 'Centered', src: image.url }),
          React.createElement(
            'p',
            null,
            image.description
          )
        );
      });

      return React.createElement(
        'div',
        null,
        imgGallery
      );
    }
  });

  React.render(React.createElement(PictureGallery, { id: 'galleryStyle', token: 'ac4d88c5194be37' }), document.getElementById('content'));
});
