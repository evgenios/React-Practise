$(document).ready(function() {
  const Comment = React.createClass({
    propTypes: {
      author: React.PropTypes.string.isRequired,
      children: React.PropTypes.string.isRequired,
    },
    render: function() {
      const rawMarkup = marked(this.props.children.toString(), {sanitize: true});
      return (
        <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
          <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>
      );
    },
  });
  const CommentList = React.createClass({
    propTypes: {
      data: React.PropTypes.array.isRequired,
    },
    render: function() {
      const commentNodes = this.props.data.map(function(comment, i) {
        return (
          <Comment key={i} author={comment.author}>
            {comment.text}
          </Comment>
        );
      });
      return (
        <div className="commentList">
          {commentNodes}
        </div>
      );
    },
  });

  const CommentForm = React.createClass({
    propTypes: {
      onCommentSubmit: React.PropTypes.func.isRequired,
    },
    render: function() {
      return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
          <input type="submit" value="Post" />
        </form>
      );
    },
    handleSubmit: function(e) {
      e.preventDefault();
      const author = React.findDOMNode(this.refs.author).value.trim();
      const text = React.findDOMNode(this.refs.text).value.trim();
      if (!text || !author) {
        return;
      }
      this.props.onCommentSubmit({author: author, text: text});
      React.findDOMNode(this.refs.author).value = '';
      React.findDOMNode(this.refs.text).value = '';
      return;
    },
  });

  const CommentBox = React.createClass({
    propTypes: {
      url: React.PropTypes.string.isRequired,
      pollInterval: React.PropTypes.number.isRequired,
    },

    getInitialState: function() {
      return {data: []};
    },

    componentDidMount: function() {
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
      return (
        <div className="commentBox">
          <h1>Comments</h1>
          <CommentList data={this.state.data} />
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      );
    },

    loadCommentsFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },

    handleCommentSubmit: function(comment) {
      //Adding the new comment, without waiting for the server response
      const comments = this.state.data;
      const newComments = comments.concat([comment]);
      this.setState({data: newComments});
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },
  });

  React.render(
    <CommentBox url="http://localhost:3000/comments.json" pollInterval={2000} />,
    document.getElementById('content')
  );
});
