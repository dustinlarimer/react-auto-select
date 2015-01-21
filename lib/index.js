var React = require('react');
React.initializeTouchEvents(true);

var Select = React.createClass({

  getDefaultProps: function() {
    return {
      items: [] //['one', 'two', 'three']
    };
  },

  getInitialState: function() {
    return {
      classes: 'react-select',
      limit: 30,
      userInput: ''
    };
  },

  handleChange: function(e) {
    this.setState({ userInput: e.target.value });
  },

  handleItemSelection: function(index){
    if (index && this.props.items[index]) {
      this.setState({ userInput: this.props.items[index] });
    }
  },

  appendListItems: function(arr) {
    var self = this;
    arr.forEach(function(opt, i){
      self.props.items.push(opt);
    });
    this.forceUpdate();
    return this;
  },

  insertListItems: function(index, arr){
    this.props.items.splice.apply(this.props.items, [index,0].concat(arr));
    this.forceUpdate();
    return this;
  },

  removeListItems: function(){
    this.props.items = [];
    this.forceUpdate();
    return this;
  },

  sortListItems: function(str){
    this.props.items.sort(function(a,b){
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
    var count = 0;
    var items = this.props.items.map(function(item, index) {

      // If input is present, skip items that don't match
      if (self.state.userInput.length > 0 && String(item).search(self.state.userInput) < 0) return;

      count++;
      if (count > self.state.limit) return;

      var boundClick = self.handleItemSelection.bind(self, index);
      return <li className="react-select-option" key={index} onClick={boundClick}>{item}</li>
    });
    return <div className={this.state.classes}>
      <input ref="input" value={this.state.userInput} onChange={this.handleChange} />
      <ul ref="list">
        {items}
      </ul>
    </div>
  }

});

// For testing
window.demoSelect = React.render( <Select />, document.getElementById('example') );
for (var i = 0; i < new Array(2000).length; i++) {
  // console.log(i)
  window.demoSelect.appendListItems([i]);
}

// .appendListItems(['four', 'five', 'six', 'seven'])
// .insertListItems(0, ['a', 'b', 'c'])
// .sortListItems('desc');

module.exports = Select;
