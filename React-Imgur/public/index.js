$(document).ready(function() {
  const LoadingGif = React.createClass({
    render: function() {
      return (
        <div className="loading">
          <img src="ellipsis.gif" alt="Loading ellipsis"></img>
        </div>
      );
    },
  });

  const PictureGallery = React.createClass({
    propTypes: {
      token: React.PropTypes.string.isRequired,
    },
    getInitialState: function() {
      return {images: []};
    },

    componentDidMount: function() {
      const pictures = [];
      $.ajax({
        url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
        type: 'GET',
        headers: {
          Authorization: 'Client-ID ' + this.props.token,
        },
        success: function(result) {
          for (let i = 0; i < result.data.length; i++) {
            if (!result.data[i].is_album) {
              pictures.push({
                id: result.data[i].id,
                url: result.data[i].link,
                title: result.data[i].title,
              });
            }
          }
          this.setState({images: pictures});
          $('.loading').hide();
        }.bind(this),
      });
    },
    render: function() {
      const imgGallery = this.state.images.map(function(image, i) {
        return (
          <div key={i} identity={image.id} id = "parent">
            <h4>{image.title}</h4>
            <a href ={image.url} target ="_blank"><img id="Centered" src = {image.url} /></a>
          </div>
        );
      });

      return (
        <div>
          <h1> Simple React Web App that returns the hot and viral pictures in
          Imgur. Scroll down and enjoy!</h1>
          <LoadingGif />
          {imgGallery}
        </div>
      );
    },
  });

  React.render(
    <PictureGallery token=""/>,
    document.getElementById('content')
  );
});
