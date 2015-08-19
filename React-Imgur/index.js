$(document).ready(function() {
  const PictureGallery = React.createClass({
    propTypes: {
      token: React.PropTypes.string.isRequired,
    },
    getInitialState: function() {
      return {images: []};
    },

    componentDidMount: function() {
      let images = [];
      $.ajax({
        url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
        type: 'GET',
        headers: {
          Authorization: 'Client-ID ' + this.props.token,
        },
        success: function(result) {
          for (let i = 0; i < result.data.length; i++) {
            if (!result.data[i].is_album) {
              images.push({
                id: result.data[i].id,
                url: result.data[i].link,
                title: result.data[i].title,
                desc: result.data[i].description,
              });
            }
          }
          this.setState({images: images});
        }.bind(this),
      });
    },
    render: function() {
      const imgGallery = this.state.images.map(function(image, i) {
        return (
          <div key={i} identity={image.id} id = "parent">
            <h4>{image.title}</h4>
            <img id="Centered" src = {image.url} />
            <p>{image.description}</p>
          </div>
        );
      });

      return (
        <div>{imgGallery}</div>
      );
    },
  });

  React.render(
    <PictureGallery id = "galleryStyle" token="ac4d88c5194be37"/>,
    document.getElementById('content')
  );
});
