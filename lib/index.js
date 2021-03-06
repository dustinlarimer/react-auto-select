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
      selectedItem: 0,
      visible: false,
      visibleItems: 0
    };
  },

  resetState: function(){
    this.setState({
      limit: 30,
      selectedItem: 0,
      visible: false
    });
  },

  handleChange: function(e) {
    this.setState({ userInput: e.target.value });
    if (this.state.visible) {
      this.setState({ limit: 30, selectedItem: 0 });
      this.refs.scrollpane.getDOMNode().scrollTop = 0;
    }
    else {
      this.setState({ visible: true });
    }
  },

  handleFocus: function(e) {
    // if !this.refs.input.getDOMNode().value.length
    if (!this.state.visible) {
      this.setState({ visible: true });
    }
    else {
      this.resetState();
    }
  },

  handleBlur: function(e) {
    this.timeout = setTimeout(this.resetState, 250);
  },

  handleItemFocus: function(index) {
    clearTimeout(this.timeout);
  },

  handleItemSelection: function(index) {
    if (typeof this.props.items[index]) {
      this.setState({ userInput: String(this.props.items[index]) });
      this.refs.input.getDOMNode().focus();
      this.resetState();
    }
  },

  handleKeyDown: function(e) {
    var itemHeight, itemOffset;

    // console.log(e.keyCode, e.key, this.state.selectedItem);
    if (e.key === "Tab" || e.key === "Shift") return;

    this.setState({ visible: true });
    if (this.refs.list) {
      itemHeight = this.refs.list.getDOMNode().children[this.state.selectedItem].scrollHeight + 1;
      itemOffset = itemHeight * this.state.selectedItem;
    }

    switch (e.key) {

      case "ArrowUp": // up
        if (this.state.selectedItem-1 >= 0) {
          this.setState({ selectedItem: this.state.selectedItem-1 });
        }
        else {
          this.setState({ selectedItem: 0 });
        }
        if (this.refs.list && itemOffset > itemHeight*3) {
          this.refs.scrollpane.getDOMNode().scrollTop -= itemHeight;
        }
        e.preventDefault();
        break;

      case "ArrowDown": // down
        if (this.state.selectedItem+1 < this.state.visibleItems) {
          this.setState({ selectedItem: this.state.selectedItem+1 });
        }
        else {
          this.setState({ selectedItem: this.state.visibleItems-1 });
        }
        if (this.refs.list && itemOffset > itemHeight*3) {
          this.refs.scrollpane.getDOMNode().scrollTop += itemHeight;
        }
        e.preventDefault();
        break;

      case "Enter": // enter
        if (this.refs.list) {
          this.handleItemSelection( this.refs.list.getDOMNode().children[this.state.selectedItem].value );
        }
        else {
          this.resetState();
          // this.handleFocus();
        }
        e.preventDefault();
        break;

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

  // Data management

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

  // React methods

  render: function(){
    var self = this,
        count = 0;

    self.state.visibleItems = 0;
    var items = this.props.items.map(function(item, index) {
      // If input is present, skip items that don't match
      if (self.state.userInput.length > 0 && String(item).search(self.state.userInput) < 0) return;

      // Simple result limiting
      count++; if (count > self.state.limit) return;
      self.state.visibleItems = self.state.visibleItems+1;
      return <li className={self.state.selectedItem === count-1 ? "react-select-item active" : "react-select-item" }
          key={index}
          value={item}
          onClick={self.handleItemSelection.bind(self, index)}
          onFocus={self.handleItemFocus.bind(self, index)}>
            {item}
        </li>;
    });

    // Hide scrollpane unless active
    var scrollpane;
    if (self.state.visible) {
      scrollpane = <div ref="scrollpane" className="react-select-scrollpane" onScroll={this.handleScroll} tabIndex="-1">
        <ul ref="list" className="react-select-list">
          {items}
        </ul>
      </div>;
    }

    return <div ref="wrapper" className={this.state.classes}>
      <input ref="input" className="react-select-input" value={this.state.userInput}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown} />
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
