var React = require('react');
var ReactFireMixin = require('reactfire');
var uuid = require('node-uuid');

var firebaseApp = 'https://react-with-friends.firebaseio.com/';

React.initializeTouchEvents(true);

var Circle = React.createClass({
  render: function(){
    return <circle
      className={this.props.className}
      cx={this.props.position.x}
      cy={this.props.position.y}
      fill={this.props.fill}
      id={this.props.id}
      r='25'>
    </circle>
  }
});


var Stage = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      'id': uuid.v1(),
      'friends': [],
      'height': window.innerHeight,
      'width': window.innerWidth,
      'position': {
        'x': window.innerWidth / 2,
        'y': window.innerHeight / 2
      }
    };
  },

  componentWillMount: function(){
    this.bindAsArray(new Firebase(firebaseApp + 'friends/'), 'friends');
  },

  componentDidMount: function() {
    this.state.currentUser = this.firebaseRefs['friends'].push();
    this.state.currentUser.set({ id: this.state.id, position: this.state.position });
    this.state.currentUser.onDisconnect().remove();
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('touchmove', this.preventBehavior, false);
  },

  // componentWillUnmount: function() {
  //   window.removeEventListener('resize', this.handleResize);
  //   document.removeEventListener('touchmove', this.preventBehavior);
  // },

  handleResize: function(){
    this.setState({
      'height': window.innerHeight,
      'width': window.innerWidth
    });
  },

  preventBehavior: function(e){
    e.preventDefault();
  },

  handleMouseMove: function(e){
    var touch = (e.touches) ? e.touches[0] : false;
    var newX = touch ? touch.pageX : e.clientX,
        newY = touch ? touch.pageY : e.clientY;
    this.setState({
      'position': {
        'x': newX,
        'y': newY
      }
    });
    this.state.currentUser.child('position').set(this.state.position);
  },

  render: function(){
    var self = this;
    var circles = this.state.friends.map(function(circle, index) {
      if (circle.id !== self.state.id) {
        return <Circle id={circle.id} className="guest" fill="#d7d7d7" position={circle.position} />
      }
    });
    return <svg id='main-stage'
      height={this.state.height}
      width={this.state.width}
      onMouseMove={this.handleMouseMove}
      onTouchMove={this.handleMouseMove}>
        {circles}
        <Circle id={this.state.id} className="current-user" fill="#1a1a1a" position={this.state.position} />
    </svg>
  }

});

React.render( <Stage />, document.getElementById('example') );

module.exports = Stage;
