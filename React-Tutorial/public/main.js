"use strict";

$(document).ready(function () {
  var Comment = React.createClass({
    displayName: "Comment",

    propTypes: {
      author: React.PropTypes.string.isRequired,
      children: React.PropTypes.string.isRequired
    },
    render: function render() {
      var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
      return React.createElement(
        "div",
        { className: "comment" },
        React.createElement(
          "h2",
          { className: "commentAuthor" },
          this.props.author
        ),
        React.createElement("span", { dangerouslySetInnerHTML: { __html: rawMarkup } })
      );
    }
  });
  var CommentList = React.createClass({
    displayName: "CommentList",

    propTypes: {
      data: React.PropTypes.array.isRequired
    },
    render: function render() {
      var commentNodes = this.props.data.map(function (comment, i) {
        return React.createElement(
          Comment,
          { key: i, author: comment.author },
          comment.text
        );
      });
      return React.createElement(
        "div",
        { className: "commentList" },
        commentNodes
      );
    }
  });

  var CommentForm = React.createClass({
    displayName: "CommentForm",

    propTypes: {
      onCommentSubmit: React.PropTypes.func.isRequired
    },
    render: function render() {
      return React.createElement(
        "form",
        { className: "commentForm", onSubmit: this.handleSubmit },
        React.createElement("input", { type: "text", placeholder: "Your name", ref: "author" }),
        React.createElement("input", { type: "text", placeholder: "Say something...", ref: "text" }),
        React.createElement("input", { type: "submit", value: "Post" })
      );
    },
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      var author = React.findDOMNode(this.refs.author).value.trim();
      var text = React.findDOMNode(this.refs.text).value.trim();
      if (!text || !author) {
        return;
      }
      this.props.onCommentSubmit({ author: author, text: text });
      React.findDOMNode(this.refs.author).value = '';
      React.findDOMNode(this.refs.text).value = '';
      return;
    }
  });

  var CommentBox = React.createClass({
    displayName: "CommentBox",

    propTypes: {
      url: React.PropTypes.string.isRequired,
      pollInterval: React.PropTypes.number.isRequired
    },

    getInitialState: function getInitialState() {
      return { data: [] };
    },

    componentDidMount: function componentDidMount() {
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function render() {
      return React.createElement(
        "div",
        { className: "commentBox" },
        React.createElement(
          "h1",
          null,
          "Comments"
        ),
        React.createElement(CommentList, { data: this.state.data }),
        React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
      );
    },

    loadCommentsFromServer: function loadCommentsFromServer() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: (function (data) {
          this.setState({ data: data });
        }).bind(this),
        error: (function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }).bind(this)
      });
    },

    handleCommentSubmit: function handleCommentSubmit(comment) {
      //Adding the new comment, without waiting for the server response
      var comments = this.state.data;
      var newComments = comments.concat([comment]);
      this.setState({ data: newComments });
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: (function (data) {
          this.setState({ data: data });
        }).bind(this),
        error: (function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }).bind(this)
      });
    }
  });

  React.render(React.createElement(CommentBox, { url: "http://localhost:3000/comments.json", pollInterval: 2000 }), document.getElementById('content'));
});
