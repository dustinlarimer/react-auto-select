var React = require('react');

var Select = React.createClass({

  getDefaultProps: function() {
    return {
      items: []
    };
  },

  getInitialState: function() {
    return {
      classes: 'react-select',
      limit: 30,
      userInput: '',
      visible: false
    };
  },

  resetState: function(){
    this.setState({
      visible: false,
      limit: 30
    });
  },

  handleChange: function(e) {
    this.setState({ userInput: e.target.value });
    this.refs.scrollpane.getDOMNode().scrollTop = 0;
  },

  handleFocus: function(e) {
    this.setState({ visible: true });
  },

  handleBlur: function(e) {
    var self = this;
    setTimeout(self.resetState, 250);
  },

  handleItemSelection: function(index){
    if (typeof this.props.items[index]) {
      this.setState({ userInput: String(this.props.items[index]) });
      this.resetState();
    }
  },

  handleScroll: function(e) {
    var pane = this.refs.scrollpane.getDOMNode();
    var diff = pane.scrollHeight - pane.scrollTop - 200;
      // -200 offset is a hack to account for fixed height
    if (diff < 50) {
      this.setState({ limit: this.state.limit + 30 });
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

  render: function(){
    var self = this,
        count = 0;

    var items = this.props.items.map(function(item, index) {
      // If input is present, skip items that don't match
      if (self.state.userInput.length > 0 && String(item).search(self.state.userInput) < 0) return;

      // Simple result limiting
      count++; if (count > self.state.limit) return;

      // Bind onClick action
      var boundClick = self.handleItemSelection.bind(self, index);
      return <li className="react-select-item" key={index} onClick={boundClick}>{item}</li>
    });

    // Hide scrollpane unless active
    var scrollpane;
    if (self.state.visible) {
      scrollpane = <div ref="scrollpane" className="react-select-scrollpane" onScroll={this.handleScroll}>
        <ul ref="list" className="react-select-list">
          {items}
        </ul>
      </div>;
    }

    return <div ref="wrapper" className={this.state.classes}>
      <input ref="input" className="react-select-input" value={this.state.userInput} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
      {scrollpane}
    </div>
  }

});

module.exports = Select;

// ----------------------------------
// Let's test it!
// ----------------------------------
window.demoSelect = React.render( <Select />, document.getElementById('example') );

// Load up 2000 data points quick
var demoData = [];
for (var i = 0; i < new Array(2000).length; i++) {
  demoData.push(i);
}

// Let loose the Kraken!
window.demoSelect.appendListItems(demoData);

// .appendListItems(['four', 'five', 'six', 'seven'])
// .insertListItems(0, ['a', 'b', 'c'])
// .sortListItems('desc');
