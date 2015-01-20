var React = require('react');
React.initializeTouchEvents(true);

var Select = React.createClass({

  getDefaultProps: function() {
    return {
      options: ['one', 'two', 'three']
    };
  },

  getInitialState: function() {
    return {
      classes: 'react-select',
      userInput: ''
    };
  },

  handleChange: function(e) {
    this.setState({ userInput: e.target.value });
  },

  handleItemSelection: function(index){
    if (index && this.props.options[index]) {
      this.setState({ userInput: this.props.options[index] });
    }
  },

  appendListItems: function(arr) {
    var self = this;
    arr.forEach(function(opt, i){
      self.props.options.push(opt);
    });
    this.forceUpdate();
    return this;
  },

  insertListItems: function(index, arr){
    this.props.options.splice.apply(this.props.options, [index,0].concat(arr));
    this.forceUpdate();
    return this;
  },

  removeListItems: function(){
    this.props.options = [];
    this.forceUpdate();
    return this;
  },

  sortListItems: function(str){
    this.props.options.sort(function(a,b){
      return str === 'desc' ? a < b : b < a;
    });
    this.forceUpdate();
    return this;
  },

  // componentWillMount: function(){},
  // componentDidMount: function() {},
  // componentWillUnmount: function() {},

  render: function(){
    var self = this;
    var options = this.props.options.map(function(option, index) {

      // If input is present, skip items that don't match
      if (self.state.userInput.length > 0 && option.search(self.state.userInput) < 0) return;

      var boundClick = self.handleItemSelection.bind(self, index);
      return <li className="react-select-option" key={index} onClick={boundClick}>{option}</li>
    });
    return <div className={this.state.classes}>
      <input ref="input" value={this.state.userInput} onChange={this.handleChange} />
      <ul ref="list">
        {options}
      </ul>
    </div>
  }

});

// For testing
window.demoSelect = React.render( <Select />, document.getElementById('example') );
// demoSelect
//   .appendListItems(['four', 'five', 'six', 'seven'])
//   .insertListItems(0, ['a', 'b', 'c'])
//   .sortListItems('desc');

module.exports = Select;
